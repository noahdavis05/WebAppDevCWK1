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
    modules = set(assignment.module_code for assignment in assignments)
    return render_template("homePage.html", assignments=assignments, csrf_token=csrf_token, modules=modules)

@app.route('/toggle-complete/<int:assignment_id>', methods=['POST'])
def toggle_complete(assignment_id):
    # validate the csrf token
    try:
        validate_csrf(request.form['csrf_token'])
    except Exception as e:
        # change this to take the user to render a view which will tell them to go back home and try again as there was an error.
        return "CSRF token is invalid or missing!", 400
    # find the assignment and 404 if no exists
    assignment = Assignment.query.get_or_404(assignment_id)

    # change the completion status
    # the user should be able to change it back from completed
    assignment.is_completed = not assignment.is_completed

    # commit the changes and return back to homepage
    db.session.commit()
    return redirect("/")

@app.route('/delete-assignment/<int:assignment_id>', methods=['POST'])
def delete_assignment(assignment_id):
    # Query the assignment by its ID
    assignment = Assignment.query.get_or_404(assignment_id)
    
    # Delete the assignment from the database
    db.session.delete(assignment)
    db.session.commit()
    
    # Redirect to the homepage after deletion
    return redirect(url_for('index'))


@app.route('/add-assignment', methods=['GET', 'POST'])
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
        return redirect(url_for('index'))  # Redirect to the homepage or another route
    else:
        if form.errors:
            flash(form.errors['title'][0])

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


@app.route("/edit-assignment/<int:assignment_id>", methods=['GET', 'POST'])
def edit_assignment(assignment_id):
    # Get the assignment from the database
    assignment = Assignment.query.get(assignment_id)
    
    # Check if this assignment exists
    if assignment is None:
        return render_template("404.html", message="Assignment doesn't exist!"), 404
    
    # Create an instance of the form with the current assignment data and ID
    form = AssignmentForm(obj=assignment, assignment_id=assignment_id)
    
    # Check if the form is validated and update the row in the database
    if form.validate_on_submit():
        # Update assignment fields with the form data
        assignment.title = form.title.data
        assignment.module_code = form.module_code.data
        assignment.deadline = form.deadline.data
        assignment.description = form.description.data
        assignment.is_completed = form.is_completed.data
        
        # Commit the changes to the database
        db.session.commit()
        return redirect(url_for('index'))  # Redirect to the homepage or another route
    
    # Flash validation errors if any
    if form.errors:
        for error in form.errors.values():
            flash(error[0], 'danger')  # Flash the first error for each field

    return render_template("edit_assignment.html", form=form, assignment=assignment)
