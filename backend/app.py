import os
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
# Allow CORS for all domains on all routes
CORS(app)

# -------------------------------------------------------------
# Database Configuration
# -------------------------------------------------------------
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:password@localhost/Delivery_Route_Optimizer'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# -------------------------------------------------------------
# Database Models
# -------------------------------------------------------------
class Admin(db.Model):
    __tablename__ = 'admins'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)

class Customer(db.Model):
    __tablename__ = 'customers'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)

class Rider(db.Model):
    __tablename__ = 'riders'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    status = db.Column(db.String(20), default='Pending')

# -------------------------------------------------------------
# Configuration for SMTP
# -------------------------------------------------------------
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = "gt.fsd.1@iittnif.com"
SENDER_PASSWORD = "nzmh oopf jwoc kndi"

# In-memory store for OTPs during Registration/Login
# Structure: { "email@example.com": { "otp": "1234", "action": "login/register", "data": {...} } }
otp_store = {}

def send_email_smtp(to_email, otp_code):
    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = "Your Logistics Pro Verification Code"
        msg['From'] = SENDER_EMAIL
        msg['To'] = to_email

        text = f"Your verification code is: {otp_code}\n\nPlease enter this to securely login."
        html = f"""\
        <html>
          <body>
            <h2>Logistics Pro</h2>
            <p>Your verification code is: <strong>{otp_code}</strong></p>
          </body>
        </html>
        """

        msg.attach(MIMEText(text, 'plain'))
        msg.attach(MIMEText(html, 'html'))

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.ehlo()
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.sendmail(SENDER_EMAIL, to_email, msg.as_string())
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False

# -------------------------------------------------------------
# API Routes
# -------------------------------------------------------------

@app.route('/api/admin-login', methods=['POST'])
def admin_login():
    """Admin login just checks DB for username and password."""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"success": False, "message": "Missing credentials"}), 400

    admin = Admin.query.filter_by(username=username).first()
    if admin and check_password_hash(admin.password_hash, password):
        return jsonify({"success": True, "message": "Admin logged in"})
    
    return jsonify({"success": False, "message": "Invalid username or password"}), 401


@app.route('/api/register', methods=['POST'])
def register():
    """Initiates registration by sending OTP."""
    data = request.get_json()
    role = data.get('role')
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not all([role, username, email, password]):
        return jsonify({"success": False, "message": "Missing fields"}), 400
    
    # Check if already exists in respective table
    if role == 'customer':
        if Customer.query.filter_by(username=username).first() or Customer.query.filter_by(email=email).first():
            return jsonify({"success": False, "message": "Username or Email already exists"}), 400
    elif role == 'rider':
        if Rider.query.filter_by(username=username).first() or Rider.query.filter_by(email=email).first():
            return jsonify({"success": False, "message": "Username or Email already exists"}), 400
    else:
        return jsonify({"success": False, "message": "Invalid role"}), 400

    otp_code = str(random.randint(1000, 9999))
    otp_store[email] = {
        "otp": otp_code,
        "action": "register",
        "data": {"role": role, "username": username, "email": email, "password": password}
    }
    
    print(f"[DEBUG] Registration OTP {otp_code} for {email}")
    send_email_smtp(email, otp_code)
    return jsonify({"success": True, "message": "OTP sent to email"})


@app.route('/api/login', methods=['POST'])
def login():
    """Initiates login by checking credentials and sending OTP."""
    data = request.get_json()
    role = data.get('role')
    username = data.get('username')
    password = data.get('password')

    if not all([role, username, password]):
        return jsonify({"success": False, "message": "Missing fields"}), 400
    
    user = None
    if role == 'customer':
        user = Customer.query.filter_by(username=username).first()
    elif role == 'rider':
        user = Rider.query.filter_by(username=username).first()
    
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"success": False, "message": "Invalid username or password"}), 401

    otp_code = str(random.randint(1000, 9999))
    otp_store[user.email] = {
        "otp": otp_code,
        "action": "login",
        "data": {"role": role, "email": user.email}
    }
    
    print(f"[DEBUG] Login OTP {otp_code} for {user.email}")
    send_email_smtp(user.email, otp_code)
    return jsonify({"success": True, "message": "OTP sent to email", "email": user.email})


@app.route('/api/verify-otp', methods=['POST'])
def verify_otp():
    """Verifies OTP for both Registration and Login."""
    data = request.get_json()
    email = data.get('email')
    entered_otp = data.get('otp')

    if not email or not entered_otp:
        return jsonify({"success": False, "message": "Missing email or OTP"}), 400

    session_data = otp_store.get(email)
    if not session_data or session_data['otp'] != entered_otp:
        return jsonify({"success": False, "message": "Invalid or expired OTP"}), 401

    action = session_data['action']
    
    if action == 'register':
        # Create user in DB
        user_data = session_data['data']
        hashed_pw = generate_password_hash(user_data['password'])
        if user_data['role'] == 'customer':
            new_user = Customer(username=user_data['username'], email=user_data['email'], password_hash=hashed_pw)
        elif user_data['role'] == 'rider':
            new_user = Rider(username=user_data['username'], email=user_data['email'], password_hash=hashed_pw)
        
        db.session.add(new_user)
        db.session.commit()
        del otp_store[email]
        return jsonify({"success": True, "message": "Account created successfully!"})

    elif action == 'login':
        # Just complete login
        del otp_store[email]
        return jsonify({"success": True, "message": "Logged in successfully!"})


def create_initial_admin():
    """Creates a default admin if none exists."""
    if not Admin.query.first():
        hashed_pw = generate_password_hash('password')
        admin = Admin(username='admin', password_hash=hashed_pw)
        db.session.add(admin)
        db.session.commit()
        print("Default admin created: admin / password")

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        create_initial_admin()
        
    app.run(host='0.0.0.0', port=5000, debug=True)
