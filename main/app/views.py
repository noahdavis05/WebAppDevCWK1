from app import app, db
from flask import render_template, flash, url_for, redirect, request
from app.forms import AssignmentForm
from app.models import Assignment
from flask_wtf.csrf import generate_csrf, validate_csrf

@app.route('/')
def index():
    # Query all assignments
    assignments = Assignment.query.all()
    # generate a csrf token for the completion form
    csrf_token = generate_csrf()
    # Pass the assignments to the template
    return render_template("homePage.html", assignments=assignments, csrf_token=csrf_token)

@app.route('/toggle-complete/<int:assignment_id>', methods=['POST'])
def toggle_complete(assignment_id):
    # validate the csrf token
    try:
        validate_csrf(request.form['csrf_token'])
    except Exception as e:
        return "CSRF token is invalid or missing!", 400
    # find the assignment and 404 if no exists
    assignment = Assignment.query.get_or_404(assignment_id)

    # change the completion status
    # the user should be able to change it back from completed
    assignment.is_completed = not assignment.is_completed

    # commit the changes and return back to homepage
    db.session.commit()
    return redirect("/")


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


@app.route("/view-assignment/<int:assignment_id>")
def view_assignment(assignment_id):
    # get the assignment from the database
    assignment = Assignment.query.get(assignment_id)
    # check if this assignment exists
    if assignment is None:
        return render_template("404.html", message="Assignment doesn't exist!"), 404

    # render the assignment template 
    return render_template("view_assignment.html", assignment = assignment)