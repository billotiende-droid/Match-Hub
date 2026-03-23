from flask_restful import Resource, reqparse, inputs
from models import db, Booking, Game, Turf
from sqlalchemy import func
from datetime import datetime, time, date, timedelta

class BookingResource(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        # Common Arguments
        parser.add_argument('client_id', required=True, type=str, help="Client ID is required")
        parser.add_argument('booking_type', choices=('private_rent', 'game_join'), required=True)
        parser.add_argument('participant_count', type=int, default=1)
        
        # Specific Arguments (Updated for Private Rent)
        parser.add_argument('game_id', type=str)
        parser.add_argument('turf_id', type=str)
        parser.add_argument('booking_date', type=str) # Format: YYYY-MM-DD
        parser.add_argument('start_time', type=str)    # Format: HH:MM
        parser.add_argument('end_time', type=str)      # Format: HH:MM
        
        args = parser.parse_args()

        try:
            # 1. Start Transaction
            with db.session.begin():
                
                # --- CASE 1: JOINING A PUBLIC GAME ---
                if args['booking_type'] == 'game_join':
                    if not args['game_id']:
                        return {"error": "game_id required for game_join"}, 400
                    
                    game = Game.query.with_for_update().get(args['game_id'])
                    if not game or game.status == 'cancelled':
                        return {"error": "Game not found or unavailable"}, 404

                    # Calculate current occupancy
                    booked_count = db.session.query(func.sum(Booking.participant_count))\
                        .filter(Booking.game_id == game.id, Booking.status != 'cancelled').scalar() or 0
                    
                    if (booked_count + args['participant_count']) > game.max_players:
                        return {"error": f"Only {game.max_players - booked_count} slots left"}, 400

                    # Extract timing from game_date
                    booking_date = game.game_date.date()
                    start_time = game.game_date.time()
                    # Assume 1 hour duration for game bookings, or extract from game if available
                    from datetime import timedelta
                    end_time = (game.game_date + timedelta(hours=1)).time()
                    
                    new_booking = Booking(
                        client_id=args['client_id'],
                        booking_type='game_join',
                        game_id=game.id,
                        turf_id=game.turf_id, 
                        booking_date=booking_date,
                        start_time=start_time,
                        end_time=end_time,
                        participant_count=args['participant_count'],
                        total_amount=game.price_per_player * args['participant_count'],
                        status='pending',
                        payment_status='unpaid'
                    )

                # --- CASE 2: PRIVATE RENTAL ---
                else:
                    if not all([args['turf_id'], args['booking_date'], args['start_time'], args['end_time']]):
                        return {"error": "turf_id, date, start_time, and end_time are required"}, 400
                    
                    # Parse string values to proper date/time objects
                    try:
                        booking_date = datetime.strptime(args['booking_date'], '%Y-%m-%d').date()
                        start_time = datetime.strptime(args['start_time'], '%H:%M').time()
                        end_time = datetime.strptime(args['end_time'], '%H:%M').time()
                    except ValueError as e:
                        return {"error": f"Invalid date/time format: {str(e)}"}, 400
                    
                    # VALIDATION: Check if Turf exists and is active
                    turf = Turf.query.get(args['turf_id'])
                    if not turf or not turf.is_active:
                        return {"error": "This turf is currently unavailable for private rent"}, 404
                    
                    # OVERLAP CHECK: Is the turf busy?
                    conflict = Booking.query.filter(
                        Booking.turf_id == args['turf_id'],
                        Booking.booking_date == booking_date,
                        Booking.status != 'cancelled',
                        Booking.start_time < end_time,
                        Booking.end_time > start_time
                    ).first()

                    if conflict:
                        return {"error": "Time slot overlap detected with an existing booking"}, 409
                    
                    # CALCULATION: Price based on hours (Simple version)
                    # Note: You can add logic here to calculate duration * turf.price_per_hour
                    new_booking = Booking(
                        client_id=args['client_id'],
                        booking_type='private_rent',
                        turf_id=args['turf_id'],
                        game_id=None,
                        booking_date=booking_date,
                        start_time=start_time,
                        end_time=end_time,
                        participant_count=args['participant_count'],
                        total_amount=turf.price_per_hour, # Or calculate duration-based
                        status='pending',
                        payment_status='unpaid'
                    )

                db.session.add(new_booking)
            
            # Flush to get the ID, then commit (handled by 'with db.session.begin()')
            return {"message": "Booking initiated successfully", "booking_id": str(new_booking.id)}, 201
        
        except Exception as e:
            # The transaction automatically rolls back on error
            return {"error": f"Database error: {str(e)}"}, 500