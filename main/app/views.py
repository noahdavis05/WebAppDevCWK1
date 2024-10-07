from app import app, db
from flask import render_template, flash, url_for, redirect
from app.forms import AssignmentForm
from app.models import Assignment

@app.route('/')
def index():
    # Query all assignments
    assignments = Assignment.query.all()
    # Pass the assignments to the template
    return render_template("homePage.html", assignments=assignments)

@app.route('/add-assignment', methods=['GET','Post'])
def add_assignment():
    form = AssignmentForm()
    if form.validate_on_submit():
        # Create an assignment instance with the form data
        assignment = Assignment(
            title=form.title.data,
            module_code=form.module_code.data,
            deadline=form.deadline.data,
            description=form.description.data,
            is_completed=form.is_completed.data
        )
        # Add to the database
        db.session.add(assignment)
        db.session.commit()
        flash('Assignment has been added!', 'success')
        return redirect(url_for('index'))  # Redirect to the homepage or another route
    return render_template('add_assignment.html', form=form)