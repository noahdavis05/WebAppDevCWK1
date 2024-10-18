from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, DateField, BooleanField, SubmitField
from wtforms.validators import DataRequired, ValidationError
from datetime import date

class AssignmentForm(FlaskForm):
    title = StringField('Assignment Title', validators=[DataRequired()])
    module_code = StringField('Module Code', validators=[DataRequired()])
    deadline = DateField('Deadline (YYYY-MM-DD)', format='%Y-%m-%d', validators=[DataRequired()])
    description = TextAreaField('Description', validators=[DataRequired()])
    is_completed = BooleanField('Completed?')
    submit = SubmitField('Submit')

    def validate_deadline(self, deadline):
        if deadline.data < date.today():
            raise ValidationError("Deadline for a task must be in the future!")