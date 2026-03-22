import uuid
from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData, Enum, UniqueConstraint, String, Date, Time, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy_serializer import SerializerMixin

# Essential for PostgreSQL migrations to avoid "unnamed constraint" errors
convention = {
    "ix": 'ix_%(column_0_label)s',
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}

metadata = MetaData(naming_convention=convention)
db = SQLAlchemy(metadata=metadata)

def generate_uuid():
    return str(uuid.uuid4())

class Admin(db.Model, SerializerMixin):
    __tablename__ = "admins"
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    password_hash = db.Column(db.String(255), nullable=False)
    
    # Updated Role Column using Enum for PostgreSQL compatibility
    role = db.Column(
        db.Enum('super_admin', 'owner', 'manager', 'staff', name='admin_role_types'), 
        nullable=False, 
        default='staff'
    )
    
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    turfs = db.relationship("Turf", back_populates="admin")
    tournaments = db.relationship("Tournament", back_populates="admin")

class Client(db.Model, SerializerMixin):
    __tablename__ = "clients"
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    password_hash = db.Column(db.String(255), nullable=False)
    # Native PG Enum name='skill_level_types'
    skill_level = db.Column(db.Enum('beginner', 'intermediate', 'advanced', name='skill_level_types'))
    is_verified = db.Column(db.Boolean, default=False)

    bookings = db.relationship("Booking", back_populates="client")
    teams = db.relationship("Team", back_populates="owner")
    notifications = db.relationship("Notification", back_populates="client", cascade="all, delete-orphan")

class Turf(db.Model, SerializerMixin):
    __tablename__ = "turfs"
    
    # Don't re-serialize the admin or the lists of games/bookings in a simple list view
    serialize_rules = ('-admin', '-games.turf', '-bookings.turf')

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    admin_id = db.Column(db.String(36), db.ForeignKey("admins.id"))
    name = db.Column(db.String(100), nullable=False)
    price_per_hour = db.Column(db.Numeric(10, 2), nullable=False) # Changed from Float
    is_active = db.Column(db.Boolean, default=True) # Added this (missing in model)

    admin = db.relationship("Admin", back_populates="turfs")
    games = db.relationship("Game", back_populates="turf")
    bookings = db.relationship("Booking", back_populates="turf")    

class Game(db.Model, SerializerMixin):
    __tablename__ = "games"
    
    # Prevent deep nesting of turf details or tournament details inside a game
    serialize_rules = ('-turf.games', '-tournament.games', '-bookings.game')

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    turf_id = db.Column(db.String(36), db.ForeignKey("turfs.id"))
    tournament_id = db.Column(db.String(36), db.ForeignKey("tournaments.id"))
    title = db.Column(db.String(100))
    game_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.Enum('open', 'full', 'cancelled', 'completed', name='game_status_types'), default='open')
    max_players = db.Column(db.Integer, default=10) # How many people can join
    price_per_player = db.Column(db.Numeric(10, 2), default=0.00) # Cost to join
    end_time = db.Column(db.Time) # Optional: when the game ends

    turf = db.relationship("Turf", back_populates="games")
    tournament = db.relationship("Tournament", back_populates="games")
    bookings = db.relationship("Booking", back_populates="game")
    
class Booking(db.Model, SerializerMixin):
    __tablename__ = "bookings"
    
    # Prevents infinite loops during JSON serialization
    serialize_rules = (
        '-client.bookings', 
        '-turf.bookings', 
        '-game.bookings', 
        '-transactions.booking', 
        '-review.booking'
    )

    # Primary Key & Foreign Keys
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    client_id = db.Column(db.String(36), db.ForeignKey("clients.id"), nullable=False)
    turf_id = db.Column(db.String(36), db.ForeignKey("turfs.id"), nullable=False)
    game_id = db.Column(db.String(36), db.ForeignKey("games.id"), nullable=True)
    
    # Types & Statuses
    booking_type = db.Column(
        db.Enum('private_rent', 'game_join', name='booking_type_types'), 
        nullable=False
    )
    status = db.Column(
        db.Enum('pending', 'confirmed', 'cancelled', name='booking_status_types'), 
        default='pending'
    )
    payment_status = db.Column(
        db.Enum('unpaid', 'paid', name='payment_status_types'), 
        default='unpaid'
    )
    
    # Quantities & Financials
    participant_count = db.Column(db.Integer, default=1, nullable=False)
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    
    # Timing
    booking_date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    
    # Audit Timestamps
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(
        db.DateTime, 
        default=lambda: datetime.now(timezone.utc), 
        onupdate=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    client = db.relationship("Client", back_populates="bookings")
    turf = db.relationship("Turf", back_populates="bookings")
    game = db.relationship("Game", back_populates="bookings")
    transactions = db.relationship("Transaction", back_populates="booking", cascade="all, delete-orphan")
    review = db.relationship("Review", back_populates="booking", uselist=False)

    # Constraints
    __table_args__ = (
        # Ensures that if it's a game_join, a game_id MUST be provided.
        # Private rents are allowed to have game_id as NULL.
        db.CheckConstraint(
            "(booking_type = 'game_join' AND game_id IS NOT NULL) OR (booking_type = 'private_rent')",
            name="check_game_id_if_game_join"
        ),
        # Optional: Ensures participant count is never zero or negative
        db.CheckConstraint("participant_count > 0", name="check_positive_participants"),
    )
class Tournament(db.Model, SerializerMixin):
    __tablename__ = "tournaments"

    # Rules: 
    # 1. '-admin.tournaments' -> Stops recursion back to the admin's list of tournaments.
    # 2. '-games.tournament' -> Stops each game from trying to re-serialize this tournament.
    # 3. '-team_links.tournament' -> Stops recursion through the many-to-many join table.
    serialize_rules = ('-admin.tournaments', '-games.tournament', '-team_links.tournament')

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    admin_id = db.Column(db.String(36), db.ForeignKey("admins.id"), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    
    # Using Enum for PG compatibility (e.g., 'upcoming', 'ongoing', 'completed')
    status = db.Column(
        db.Enum('upcoming', 'ongoing', 'completed', 'cancelled', name='tournament_status_types'), 
        default='upcoming'
    )

    # Relationships
    admin = db.relationship("Admin", back_populates="tournaments")
    games = db.relationship("Game", back_populates="tournament")
    team_links = db.relationship("TournamentTeam", back_populates="tournament")    

class Team(db.Model, SerializerMixin):
    __tablename__ = "teams"
    serialize_rules = ('-owner.teams', '-tournament_links.team')

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    name = db.Column(db.String(100), nullable=False)
    client_id = db.Column(db.String(36), db.ForeignKey("clients.id"))

    owner = db.relationship("Client", back_populates="teams")
    tournament_links = db.relationship("TournamentTeam", back_populates="team")    


class TournamentTeam(db.Model, SerializerMixin):
    __tablename__ = "tournament_teams"

    # Rules:
    # 1. '-tournament.team_links' -> When looking at a team's tournaments, 
    #    don't list every other team in that tournament.
    # 2. '-team.tournament_links' -> When looking at a tournament's teams, 
    #    don't list every other tournament those teams are in.
    serialize_rules = ('-tournament.team_links', '-team.tournament_links')

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    tournament_id = db.Column(db.String(36), db.ForeignKey("tournaments.id"), nullable=False)
    team_id = db.Column(db.String(36), db.ForeignKey("teams.id"), nullable=False)

    # Relationships
    tournament = db.relationship("Tournament", back_populates="team_links")
    team = db.relationship("Team", back_populates="tournament_links")

    # PostgreSQL compatible constraint to prevent duplicate entries
    __table_args__ = (
        UniqueConstraint('tournament_id', 'team_id', name='uq_tournament_team'),
    )

class Transaction(db.Model, SerializerMixin):
    __tablename__ = "transactions"

    # Rules:
    # 1. '-booking.transactions' -> Prevents the booking from listing all its 
    #    transactions again when you are viewing a single transaction.
    # 2. '-booking.client' -> (Optional) Keeps the transaction response slim 
    #    by not nesting the full client details through the booking.
    serialize_rules = ('-booking.transactions',)

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    booking_id = db.Column(db.String(36), db.ForeignKey("bookings.id"), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    
    # Using Enum for PG compatibility (e.g., 'pending', 'completed', 'failed', 'refunded')
    status = db.Column(
        db.Enum('pending', 'completed', 'failed', 'refunded', name='transaction_status_types'), 
        default='pending'
    )
    
    timestamp = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationship
    booking = db.relationship("Booking", back_populates="transactions")  

class Review(db.Model, SerializerMixin):
    __tablename__ = "reviews"

    # Rules:
    # 1. '-booking.review' -> Stops the booking from trying to re-serialize this review.
    # 2. '-booking.client' -> Keeps the review object clean by not nesting the user who wrote it twice.
    serialize_rules = ('-booking.review',)

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    
    # unique=True ensures one booking cannot have multiple reviews
    booking_id = db.Column(db.String(36), db.ForeignKey("bookings.id"), unique=True, nullable=False)
    
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationship
    booking = db.relationship("Booking", back_populates="review") 

class Notification(db.Model, SerializerMixin):
    __tablename__ = "notifications"

    # Rules:
    # 1. '-client.notifications' -> Prevents the client object from listing 
    #    ALL their notifications again when viewing a single notification.
    serialize_rules = ('-client.notifications',)

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    
    # Foreign Key to the Client receiving the notification
    client_id = db.Column(db.String(36), db.ForeignKey("clients.id"), nullable=False)
    
    title = db.Column(db.String(150), nullable=False)
    message = db.Column(db.Text, nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationship back to Client
    client = db.relationship("Client", back_populates="notifications")