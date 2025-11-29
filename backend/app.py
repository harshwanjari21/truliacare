from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime, timedelta
import os

app = Flask(__name__)

# Configure CORS properly
CORS(app, origins=['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173'], 
     allow_headers=['Content-Type', 'Authorization'],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])

# Global error handler
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

@app.errorhandler(400)
def bad_request(error):
    return jsonify({'error': 'Bad request'}), 400

# Database configuration
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(basedir, "trulicare.db")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key-change-in-production'

db = SQLAlchemy(app)

# Models
class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    venue = db.Column(db.String(200), nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    total_seats = db.Column(db.Integer, nullable=False)
    available_seats = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
    thumbnail = db.Column(db.String(500))
    status = db.Column(db.String(50), default='Active')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'description': self.description,
            'venue': self.venue,
            'date': self.date.isoformat() + 'Z',
            'totalSeats': self.total_seats,
            'availableSeats': self.available_seats,
            'price': self.price,
            'thumbnail': self.thumbnail,
            'status': self.status,
            'createdAt': self.created_at.isoformat() + 'Z',
            'tags': ['Event', self.category]
        }

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    role = db.Column(db.String(50), default='user')
    status = db.Column(db.String(50), default='active')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'role': self.role,
            'status': self.status,
            'createdAt': self.created_at.isoformat() + 'Z'
        }

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    tickets = db.Column(db.Integer, nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default='confirmed')
    booking_date = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    event = db.relationship('Event', backref='bookings')
    user = db.relationship('User', backref='bookings')
    
    def to_dict(self):
        return {
            'id': self.id,
            'eventId': self.event_id,
            'userId': self.user_id,
            'eventName': self.event.name,
            'customerName': self.user.name,
            'customerEmail': self.user.email,
            'tickets': self.tickets,
            'totalAmount': self.total_amount,
            'status': self.status,
            'bookingDate': self.booking_date.isoformat() + 'Z',
            'createdAt': self.booking_date.isoformat() + 'Z'
        }

# Routes
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'Server is running'}), 200

@app.route('/api/auth/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        print("Login request received")  # Debug log
        data = request.get_json()
        print(f"Request data: {data}")  # Debug log
        
        if not data:
            print("No data provided")  # Debug log
            return jsonify({'success': False, 'message': 'No data provided'}), 400
            
        email = data.get('email', '')
        password = data.get('password', '')
        print(f"Email: {email}, Password: {password}")  # Debug log
        
        # Simple admin check with hardcoded password 1234
        if email == 'admin@gmail.com' and password == '1234':
            print("Login successful")  # Debug log
            return jsonify({
                'success': True,
                'user': {
                    'id': 1,
                    'name': 'Admin User',
                    'email': email,
                    'role': 'admin'
                },
                'token': 'dummy-jwt-token'
            }), 200
        
        print("Invalid credentials")  # Debug log
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
    except Exception as e:
        print(f"Login error: {e}")  # Debug logging
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Login failed'}), 500

@app.route('/api/placeholder/<int:width>/<int:height>', methods=['GET'])
def get_placeholder_image(width, height):
    """Return a simple SVG placeholder image"""
    svg_content = f'''<svg width="{width}" height="{height}" viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="{width}" height="{height}" fill="#f3f4f6"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="{min(width, height) // 10}" fill="#9ca3af" text-anchor="middle" dy="0.3em">Event Image</text>
    </svg>'''
    
    return svg_content, 200, {'Content-Type': 'image/svg+xml'}

@app.route('/api/categories', methods=['GET'])
def get_categories():
    try:
        # Get distinct categories from events table
        categories_result = db.session.query(Event.category).distinct().all()
        categories = ['All'] + [cat[0] for cat in categories_result if cat[0]]
        
        return jsonify({'categories': categories})
    except Exception as e:
        print(f"Error getting categories: {e}")  # Debug logging
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Failed to fetch categories'}), 500

@app.route('/api/events', methods=['GET'])
def get_events():
    try:
        print("Getting events request received")  # Debug log
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('limit', 12, type=int)
        search = request.args.get('search', '')
        category = request.args.get('category', '')
        
        print(f"Params: page={page}, per_page={per_page}, search={search}, category={category}")  # Debug log
        
        query = Event.query
        
        if search:
            query = query.filter(Event.name.contains(search))
        if category and category != 'all':
            query = query.filter(Event.category == category)
            
        events = query.paginate(page=page, per_page=per_page, error_out=False)
        print(f"Found {len(events.items)} events")  # Debug log
        
        result = {
            'events': [event.to_dict() for event in events.items],
            'total': events.total,
            'pages': events.pages,
            'current_page': page,
            'per_page': per_page
        }
        
        print(f"Returning result: {len(result['events'])} events, total={result['total']}")  # Debug log
        return jsonify(result), 200
    except Exception as e:
        print(f"Error getting events: {e}")  # Debug logging
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Failed to fetch events'}), 500

@app.route('/api/events', methods=['POST'])
def create_event():
    try:
        print("Create event request received")  # Debug log
        data = request.get_json()
        print(f"Event data: {data}")  # Debug log
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        # Validate required fields
        required_fields = ['name', 'category', 'venue', 'date', 'totalSeats', 'price']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        event = Event(
            name=data['name'],
            category=data['category'],
            description=data.get('description', ''),
            venue=data['venue'],
            date=datetime.fromisoformat(data['date'].replace('Z', '+00:00')),
            total_seats=data['totalSeats'],
            available_seats=data['totalSeats'],
            price=data['price'],
            thumbnail=data.get('thumbnail', None)  # Don't set default placeholder here
        )
        
        db.session.add(event)
        db.session.commit()
        
        print(f"Event created successfully with ID: {event.id}")  # Debug log
        return jsonify(event.to_dict()), 201
    except Exception as e:
        print(f"Error creating event: {e}")  # Debug logging
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Failed to create event'}), 500

@app.route('/api/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    event = Event.query.get_or_404(event_id)
    return jsonify(event.to_dict())

@app.route('/api/events/<int:event_id>', methods=['PUT'])
def update_event(event_id):
    try:
        event = Event.query.get_or_404(event_id)
        data = request.get_json()
        
        event.name = data.get('name', event.name)
        event.category = data.get('category', event.category)
        event.description = data.get('description', event.description)
        event.venue = data.get('venue', event.venue)
        event.date = datetime.fromisoformat(data['date'].replace('Z', '+00:00')) if 'date' in data else event.date
        event.total_seats = data.get('totalSeats', event.total_seats)
        event.price = data.get('price', event.price)
        event.thumbnail = data.get('thumbnail', event.thumbnail)
        
        db.session.commit()
        return jsonify(event.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/events/<int:event_id>', methods=['DELETE'])
def delete_event(event_id):
    try:
        event = Event.query.get_or_404(event_id)
        db.session.delete(event)
        db.session.commit()
        return jsonify({'message': 'Event deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/bookings', methods=['GET'])
def get_bookings():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('limit', 50, type=int)
        
        bookings = Booking.query.paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'bookings': [booking.to_dict() for booking in bookings.items],
            'total': bookings.total,
            'pages': bookings.pages,
            'current_page': page,
            'per_page': per_page
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/users', methods=['GET'])
def get_users():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('limit', 50, type=int)
        
        users = User.query.paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'users': [user.to_dict() for user in users.items],
            'total': users.total,
            'pages': users.pages,
            'current_page': page,
            'per_page': per_page
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/dashboard', methods=['GET'])
def get_dashboard_data():
    try:
        total_events = Event.query.count()
        total_bookings = Booking.query.count()
        total_users = User.query.count()
        total_revenue = db.session.query(db.func.sum(Booking.total_amount)).scalar() or 0
        
        # Recent bookings
        recent_bookings = Booking.query.order_by(Booking.booking_date.desc()).limit(10).all()
        
        # Upcoming events
        upcoming_events = Event.query.filter(Event.date > datetime.utcnow()).order_by(Event.date.asc()).limit(5).all()
        
        return jsonify({
            'stats': {
                'totalEvents': total_events,
                'totalBookings': total_bookings,
                'totalUsers': total_users,
                'totalRevenue': float(total_revenue)
            },
            'recentBookings': [booking.to_dict() for booking in recent_bookings],
            'upcomingEvents': [event.to_dict() for event in upcoming_events],
            'recentActivity': []  # This will be populated with real data
        })
    except Exception as e:
        print(f"Error getting dashboard data: {e}")  # Debug logging
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Failed to fetch dashboard data'}), 500

def init_db():
    """Initialize the database tables"""
    db.create_all()
    
    # Create default admin user if it doesn't exist
    if User.query.filter_by(email='admin@gmail.com').first() is None:
        admin_user = User(
            name="Admin User", 
            email="admin@gmail.com", 
            role="admin"
        )
        db.session.add(admin_user)
        db.session.commit()
        print("Default admin user created")

if __name__ == '__main__':
    try:
        with app.app_context():
            init_db()
        print("Database initialized successfully")
        print("Starting Flask server on port 5000...")
        app.run(debug=True, port=5000)
    except Exception as e:
        print(f"Error starting server: {e}")
        import traceback
        traceback.print_exc()