from app import app
from models import db, Client, Admin, Turf, Game, Booking, Tournament, Transaction, Review
from datetime import datetime, date, time, timedelta

def seed_data():
    with app.app_context():
        print("🗑️  Cleaning out the old data...")
        # Delete in order (Child tables first)
        Review.query.delete()
        Transaction.query.delete()
        Booking.query.delete()
        Game.query.delete()
        Tournament.query.delete()
        Turf.query.delete()
        Client.query.delete()
        Admin.query.delete()

        print("🌱 Creating fresh test data...")

        # 1. Create Admins (One Owner, One Super Admin)
        owner = Admin(
            full_name="Bill Otiende",
            email="bill@turfowner.com",
            password_hash="pbkdf2:sha256:owner123", # Matches your real app hash style
            role="owner"
        )
        super_admin = Admin(
            full_name="MatchHub Admin",
            email="admin@matchhub.com",
            password_hash="pbkdf2:sha256:admin123",
            role="super_admin"
        )
        db.session.add_all([owner, super_admin])
        db.session.flush()

        # 2. Create Clients
        c1 = Client(full_name="Job Ndonga", email="job@example.com", password_hash="hash", skill_level="intermediate")
        c2 = Client(full_name="Alice Smith", email="alice@test.com", password_hash="hash", skill_level="beginner")
        db.session.add_all([c1, c2])
        db.session.flush()

        # 3. Create Turfs
        t1 = Turf(
            name="Goal Hub - Arena A", 
            admin_id=owner.id,
            price_per_hour=3500.00,
            location="Nairobi, Westlands",
            amenities='["Parking", "Showers", "Floodlights"]',
            sport_type="football",
            is_active=True
        )
        t2 = Turf(
            name="Basket Park", 
            admin_id=owner.id,
            price_per_hour=2500.00,
            location="Nairobi, Kilimani",
            sport_type="basketball",
            is_active=True
        )
        db.session.add_all([t1, t2])
        db.session.flush()

        # 4. Create a Tournament (To test AdminTournamentResource)
        tourney = Tournament(
            admin_id=owner.id,
            name="Easter Cup 2026",
            description="The biggest amateur tournament of the season.",
            entry_fee=5000.00,
            prize_pool=50000.00,
            max_teams=8,
            start_date=datetime(2026, 4, 1),
            end_date=datetime(2026, 4, 5),
            status="upcoming"
        )
        db.session.add(tourney)
        db.session.flush()

        # 5. Create Games
        g1 = Game(
            turf_id=t1.id,
            title="Friday Night Kickoff",
            game_date=datetime(2026, 3, 27, 19, 0),
            max_players=10,
            price_per_player=500.00,
            skill_level="intermediate",
            status="open"
        )
        db.session.add(g1)
        db.session.flush()

        # 6. Create Bookings (Testing RevenueCompareResource)
        # Type: Private Rent
        b1 = Booking(
            client_id=c1.id,
            turf_id=t1.id,
            booking_type='private_rent',
            booking_date=date(2026, 3, 25),
            start_time=time(10, 0),
            end_time=time(11, 0),
            total_amount=3500.00,
            status='confirmed',
            payment_status='paid'
        )
        # Type: Game Join (Joining g1)
        b2 = Booking(
            client_id=c2.id,
            turf_id=t1.id,
            game_id=g1.id,
            booking_type='game_join',
            participant_count=1,
            booking_date=date(2026, 3, 27),
            start_time=time(19, 0),
            end_time=time(20, 0),
            total_amount=500.00,
            status='confirmed',
            payment_status='paid'
        )
        db.session.add_all([b1, b2])
        db.session.flush()

        # 7. Create Transactions & Reviews (Testing Detail Resources)
        trans1 = Transaction(booking_id=b1.id, amount=3500.00, status='completed', reference='REF123')
        rev1 = Review(booking_id=b1.id, rating=5, comment="Excellent turf quality!")
        
        db.session.add_all([trans1, rev1])

        db.session.commit()
        
        print("\n✅ Seed successful!")
        print(f"--- USE THESE FOR TESTING ---")
        print(f"Admin ID: {owner.id}")
        print(f"Turf ID:  {t1.id}")
        print(f"Game ID:  {g1.id}")
        print(f"Tourn ID: {tourney.id}")
        print(f"--- --- --- --- --- --- ---")

if __name__ == "__main__":
    seed_data()