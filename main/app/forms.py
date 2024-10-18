from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, DateField, BooleanField, SubmitField
from wtforms.validators import DataRequired, ValidationError, Length, Optional
from datetime import date
from .models import Assignment  # Adjust based on your actual app/module structure

class AssignmentForm(FlaskForm):
    title = StringField('Assignment Title', validators=[
        DataRequired(), 
        Length(min=3, max=100, message="Title must be between 3 and 100 characters.")
    ])
    module_code = StringField('Module Code', validators=[
        DataRequired(), 
        Length(min=1, max=20, message="Module Code must be between 1 and 20 characters.")
    ])
    deadline = DateField('Deadline (YYYY-MM-DD)', format='%Y-%m-%d', validators=[
        DataRequired()
    ])
    description = TextAreaField('Description', validators=[
        Optional(), 
        Length(max=500, message="Description must be less than 500 characters.")
    ])
    is_completed = BooleanField('Completed?')
    submit = SubmitField('Submit')

    def __init__(self, *args, assignment_id=None, **kwargs):
        super().__init__(*args, **kwargs)
        self.assignment_id = assignment_id

    def validate_title(self, title):
        assignment = Assignment.query.filter_by(title=title.data, module_code=self.module_code.data).first()
        if assignment and assignment.id != self.assignment_id:  # Check if the assignment exists and is not the current one
            raise ValidationError(f"An assignment with the title '{title.data}' and module code '{self.module_code.data}' already exists.")

    def validate_deadline(self, deadline):
        if deadline.data < date.today():
            raise ValidationError("Deadline for a task must be in the future!")
