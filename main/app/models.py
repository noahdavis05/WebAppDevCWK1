from app import db
from datetime import datetime

class Assignment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)  # Assessment title
    module_code = db.Column(db.String(20), nullable=False)  # Module code
    deadline = db.Column(db.DateTime, nullable=False)  # Deadline date
    description = db.Column(db.Text, nullable=True)  # Short description
    is_completed = db.Column(db.Boolean, default=False)  # Completion status
    date_created = db.Column(db.DateTime, default=datetime.utcnow)  # Timestamp for when the assignment was added

    def __repr__(self):
        return f"<Assignment {self.title} - {self.module_code}>"
