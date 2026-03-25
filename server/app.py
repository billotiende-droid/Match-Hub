import os
from flask import Flask
from flask_restful import Api
from flask_migrate import Migrate
from flask_cors import CORS
from models import db
from routes.auth import SignupResource, LoginResource
from routes.booking import BookingResource
from routes.admin import (
    AdminTurfResource, AdminTurfDetailResource, AdminTurfStatusResource,
    AdminTournamentResource, AdminTournamentDetailResource,
    AdminGameResource, AdminGameDetailResource,
    AdminBookingResource, AdminBookingDetailResource,
    AdminTransactionResource, AdminReviewResource,
    AdminRevenueCompareResource, AdminTeamResource,
    AdminDashboardResource
)

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///match_hub.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
migrate = Migrate(app, db)
api = Api(app)

# Enable CORS for all routes
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

# Auth routes
api.add_resource(SignupResource, '/api/auth/signup')
api.add_resource(LoginResource, '/api/auth/login')
api.add_resource(BookingResource, '/bookings')

# Admin routes - Turf Management
api.add_resource(AdminTurfResource, '/admin/turfs')
api.add_resource(AdminTurfDetailResource, '/admin/turfs/<turf_id>')
api.add_resource(AdminTurfStatusResource, '/admin/turfs/<turf_id>/status')

# Admin routes - Tournament Management
api.add_resource(AdminTournamentResource, '/admin/tournaments')
api.add_resource(AdminTournamentDetailResource, '/admin/tournaments/<tournament_id>')

# Admin routes - Game Management
api.add_resource(AdminGameResource, '/admin/games')
api.add_resource(AdminGameDetailResource, '/admin/games/<game_id>')

# Admin routes - Booking Oversight
api.add_resource(AdminBookingResource, '/admin/bookings')
api.add_resource(AdminBookingDetailResource, '/admin/bookings/<booking_id>')

# Admin routes - Transaction Oversight
api.add_resource(AdminTransactionResource, '/admin/transactions')

# Admin routes - Review Oversight
api.add_resource(AdminReviewResource, '/admin/reviews')

# Admin routes - Revenue Comparison
api.add_resource(AdminRevenueCompareResource, '/admin/revenue/compare')

# Admin routes - Team Coordination
api.add_resource(AdminTeamResource, '/admin/teams')

# Admin routes - Dashboard
api.add_resource(AdminDashboardResource, '/admin/dashboard')


if __name__ == '__main__':
    app.run(port=5555, debug=True)