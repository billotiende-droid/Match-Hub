from app import app  
from models import db, Client, Admin, Turf, Game, Booking
from datetime import datetime, date, time, timezone

def seed_data():
    with app.app_context():
        print("Plucking old data...")
        # Delete in order of dependency to avoid Foreign Key errors
        db.session.query(Booking).delete()
        db.session.query(Game).delete()
        db.session.query(Turf).delete()
        db.session.query(Client).delete()
        db.session.query(Admin).delete()

        # 1. Create an Admin (Required for Turf)
        a1 = Admin(
            full_name="Super Admin",
            email="admin@matchhub.com",
            password_hash="hashed_password_123",
            role="super_admin"
        )
        db.session.add(a1)
        db.session.flush() # Flushed to get a1.id

        # 2. Create a Client
        c1 = Client(
            full_name="Job Ndonga", 
            email="job@example.com",
            password_hash="hashed_password_456",
            skill_level="intermediate"
        )
        db.session.add(c1)

        # 3. Create a Turf
        t1 = Turf(
            name="Goal Hub", 
            admin_id=a1.id,
            price_per_hour=3500.00,
            is_active=True
        )
        db.session.add(t1)
        db.session.flush()

        # 4. Create a Public Game
        # Note: Your Game model uses game_date as DateTime
        g1 = Game(
            turf_id=t1.id,
            title="Friday Night Lights",
            game_date=datetime(2026, 3, 27, 18, 0) # March 27, 6:00 PM
        )
        db.session.add(g1)
        db.session.flush()

        # 5. Create an initial booking (to test occupancy)
        b1 = Booking(
            client_id=c1.id,
            turf_id=t1.id,
            game_id=g1.id,
            booking_type='game_join',
            participant_count=2,
            booking_date=date(2026, 3, 27),
            start_time=time(18, 0),
            end_time=time(19, 0),
            total_amount=1000.00,
            status='confirmed',
            payment_status='paid'
            
        )
        db.session.add(b1)

        db.session.commit()
        print("🌱 Database seeded successfully!")
        print(f"--- TEST DATA ---")
        print(f"Client ID: {c1.id}")
        print(f"Turf ID:   {t1.id}")
        print(f"Game ID:   {g1.id}")

if __name__ == "__main__":
    seed_data()