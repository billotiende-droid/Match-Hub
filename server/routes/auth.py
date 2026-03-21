import os
from flask import request
from flask_restful import Resource
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timezone, timedelta

from models import db, Admin, Client


SECRET_KEY = os.environ.get("SECRET_KEY", "matchhub-secret-key-change-in-production")
TOKEN_EXPIRY_HOURS = 24


def generate_token(user_id: str, role: str) -> str:
    """Generate a JWT token for the user."""
    payload = {
        "user_id": user_id,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(hours=TOKEN_EXPIRY_HOURS),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


def serialize_user(user) -> dict:
    """Serialize user object based on type."""
    if isinstance(user, Admin):
        return {
            "id": user.id,
            "name": user.full_name,
            "email": user.email,
            "phone": user.phone,
            "role": "admin",
            "user_type": "admin",
            "admin_role": user.role,
            "is_active": user.is_active,
        }
    elif isinstance(user, Client):
        return {
            "id": user.id,
            "name": user.full_name,
            "email": user.email,
            "phone": user.phone,
            "role": "player",
            "user_type": "client",
            "skill_level": user.skill_level,
            "is_verified": user.is_verified,
        }
    return {}


class SignupResource(Resource):
    def post(self):
        data = request.get_json()
        
        if not data:
            return {"error": "No data provided"}, 400
        
        role = data.get("role", "player")
        full_name = data.get("full_name", "").strip()
        email = data.get("email", "").strip().lower()
        phone = data.get("phone", "").strip()
        password = data.get("password", "")
        
        # Validation
        if not full_name:
            return {"error": "Full name is required"}, 400
        if not email:
            return {"error": "Email is required"}, 400
        if not phone:
            return {"error": "Phone number is required"}, 400
        if not password:
            return {"error": "Password is required"}, 400
        if len(password) < 6:
            return {"error": "Password must be at least 6 characters"}, 400
        
        # Check if user already exists
        if role == "admin" or role == "turf_owner":
            existing_admin = Admin.query.filter(
                (Admin.email == email) | (Admin.phone == phone)
            ).first()
            if existing_admin:
                return {"error": "User with this email or phone already exists"}, 400
            
            # Create new admin
            admin_role = "owner" if role == "turf_owner" else "staff"
            new_user = Admin(
                full_name=full_name,
                email=email,
                phone=phone,
                password_hash=generate_password_hash(password),
                role=admin_role,
                is_active=True,
            )
            db.session.add(new_user)
            db.session.commit()
            
            token = generate_token(new_user.id, "admin")
            return {
                "message": "Account created successfully",
                "user": serialize_user(new_user),
                "token": token,
            }, 201
        else:
            # Player (client)
            existing_client = Client.query.filter(
                (Client.email == email) | (Client.phone == phone)
            ).first()
            if existing_client:
                return {"error": "User with this email or phone already exists"}, 400
            
            # Create new client
            new_user = Client(
                full_name=full_name,
                email=email,
                phone=phone,
                password_hash=generate_password_hash(password),
                skill_level="beginner",
                is_verified=False,
            )
            db.session.add(new_user)
            db.session.commit()
            
            token = generate_token(new_user.id, "client")
            return {
                "message": "Account created successfully",
                "user": serialize_user(new_user),
                "token": token,
            }, 201


class LoginResource(Resource):
    def post(self):
        data = request.get_json()
        
        if not data:
            return {"error": "No data provided"}, 400
        
        role = data.get("role", "player")
        email = data.get("email", "").strip().lower()
        phone = data.get("phone", "").strip()
        password = data.get("password", "")
        
        # Validation
        if not email and not phone:
            return {"error": "Email or phone number is required"}, 400
        if not password:
            return {"error": "Password is required"}, 400
        
        # Find user
        if role == "admin" or role == "turf_owner":
            user = None
            if email:
                user = Admin.query.filter_by(email=email).first()
            elif phone:
                user = Admin.query.filter_by(phone=phone).first()
            
            if not user:
                return {"error": "Invalid credentials"}, 401
            if not check_password_hash(user.password_hash, password):
                return {"error": "Invalid credentials"}, 401
            if not user.is_active:
                return {"error": "Account is disabled"}, 401
            
            token = generate_token(user.id, "admin")
            return {
                "message": "Login successful",
                "user": serialize_user(user),
                "token": token,
            }, 200
        else:
            # Player (client)
            user = None
            if email:
                user = Client.query.filter_by(email=email).first()
            elif phone:
                user = Client.query.filter_by(phone=phone).first()
            
            if not user:
                return {"error": "Invalid credentials"}, 401
            if not check_password_hash(user.password_hash, password):
                return {"error": "Invalid credentials"}, 401
            
            token = generate_token(user.id, "client")
            return {
                "message": "Login successful",
                "user": serialize_user(user),
                "token": token,
            }, 200
