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