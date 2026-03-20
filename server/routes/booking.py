from flask_restful import Resource,  reqparse
from models import db,  Booking,  Game,  Turf
from sqlalchemy import func

class BookingResource(Resource):
    def post(self):
        # 1. Define required inputs (Better than raw request.json)
        parser = reqparse.RequestParser()
        parser.add_argument('client_id', required=True, type=str)
        parser.add_argument('booking_type', choices=('private_rent', 'game_join'), required=True)
        parser.add_argument('game_id', type=str)
        parser.add_argument('turf_id', type=str)
        parser.add_argument('participant_count', type=int, default=1)
        args = parser.parse_args()

        try:
            # Atomic Transaction Start
            with db.session.begin():
                
                # --- LOGIC FOR JOINING A PUBLIC GAME ---
                if args['booking_type'] == 'game_join':
                    if not args['game_id']:
                        return {"error": "game_id required for game_join"}, 400
                    
                    # Performance: select_for_update() prevents double-booking 
                    # by locking this game row until we finish.
                    game = Game.query.with_for_update().get(args['game_id'])
                    
                    if not game or game.deleted_at: # Soft Delete Check
                        return {"error": "Game not found or unavailable"}, 404

                    # Calculate slots left
                    booked_count = db.session.query(func.sum(Booking.participant_count))\
                        .filter(Booking.game_id == game.id, Booking.status != 'cancelled').scalar() or 0
                    
                    if (booked_count + args['participant_count']) > game.max_players:
                        return {"error": "Game is full"}, 400
                    
                    new_booking = Booking(
                        client_id=args['client_id'],
                        booking_type='game_join',
                        game_id=game.id,
                        turf_id=game.turf_id, # Inherit turf from game
                        participant_count=args['participant_count'],
                        total_amount=game.price_per_player * args['participant_count'],
                        status='pending'
                    )