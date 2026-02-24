import uuid
from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData, Enum, UniqueConstraint, String
from sqlalchemy.dialects.postgresql import UUID

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

class Admin(db.Model):
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