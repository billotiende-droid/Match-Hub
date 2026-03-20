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