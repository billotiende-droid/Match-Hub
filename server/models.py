import uuid
from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData, Enum, UniqueConstraint, String
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

class Turf(db.Model, SerializerMixin):
    __tablename__ = "turfs"
    
    # Don't re-serialize the admin or the lists of games/bookings in a simple list view
    serialize_rules = ('-admin', '-games.turf', '-bookings.turf')

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    admin_id = db.Column(db.String(36), db.ForeignKey("admins.id"))
    name = db.Column(db.String(100), nullable=False)
    price_per_hour = db.Column(db.Float, nullable=False)

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

    turf = db.relationship("Turf", back_populates="games")
    tournament = db.relationship("Tournament", back_populates="games")
    bookings = db.relationship("Booking", back_populates="game")

class Booking(db.Model, SerializerMixin):
    __tablename__ = "bookings"
    
    # Most important: Stop infinite loops between Client <-> Booking <-> Turf
    serialize_rules = ('-client.bookings', '-turf.bookings', '-game.bookings', '-transactions.booking')

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    client_id = db.Column(db.String(36), db.ForeignKey("clients.id"))
    turf_id = db.Column(db.String(36), db.ForeignKey("turfs.id"))
    game_id = db.Column(db.String(36), db.ForeignKey("games.id"))
    status = db.Column(db.Enum('pending', 'confirmed', 'cancelled', name='booking_status_types'), default='pending')

    client = db.relationship("Client", back_populates="bookings")
    turf = db.relationship("Turf", back_populates="bookings")
    game = db.relationship("Game", back_populates="bookings")
    transactions = db.relationship("Transaction", back_populates="booking")

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