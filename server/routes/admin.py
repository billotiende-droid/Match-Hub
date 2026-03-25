from flask import request
from flask_restful import Resource, reqparse
from models import db, Admin, Turf, Game, Tournament, TournamentTeam, Booking, Transaction, Review, Team, TeamMember
from sqlalchemy import func
from datetime import datetime, timedelta

class AdminTurfResource(Resource):
    """Admin turf management endpoints"""
    
    def post(self):
        """Create a new turf - requires admin authentication"""
        parser = reqparse.RequestParser()
        parser.add_argument('admin_id', required=True, type=str, help="Admin ID is required")
        parser.add_argument('name', required=True, type=str, help="Turf name is required")
        parser.add_argument('price_per_hour', required=True, type=float, help="Price per hour is required")
        parser.add_argument('location', type=str)
        parser.add_argument('amenities', type=str)  # JSON string
        parser.add_argument('images', type=str)  # JSON string
        parser.add_argument('operating_hours', type=str)  # JSON string
        parser.add_argument('sport_type', type=str, default='football')
        
        args = parser.parse_args()
        
        # Verify admin exists
        admin = Admin.query.get(args['admin_id'])
        if not admin:
            return {"error": "Admin not found"}, 404
        
        # Only owners can create turfs
        if admin.role not in ['owner', 'super_admin']:
            return {"error": "Only turf owners can create turfs"}, 403
        
        try:
            turf = Turf(
                admin_id=args['admin_id'],
                name=args['name'],
                price_per_hour=args['price_per_hour'],
                location=args.get('location'),
                amenities=args.get('amenities'),
                images=args.get('images'),
                operating_hours=args.get('operating_hours'),
                sport_type=args.get('sport_type', 'football'),
                is_active=True
            )
            db.session.add(turf)
            db.session.commit()
            return {"message": "Turf created successfully", "turf_id": str(turf.id)}, 201
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500
    
    def get(self):
        """List all turfs for an admin"""
        parser = reqparse.RequestParser()
        parser.add_argument('admin_id', required=True, type=str, location='args')
        args = parser.parse_args(req=request)
        
        turfs = Turf.query.filter_by(admin_id=args['admin_id']).all()
        # Use a comprehensive serialization approach that excludes all nested relationships
        # that could cause circular recursion
        return {"turfs": [t.to_dict(only=('id', 'name', 'price_per_hour', 'location', 'amenities', 'images', 'operating_hours', 'sport_type', 'is_active')) for t in turfs]}, 200

