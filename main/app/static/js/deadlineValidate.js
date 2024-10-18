// validate_deadline.js

// Get the elements
const deadlineInput = document.getElementById('deadline');
const deadlineError = document.getElementById('deadlineError');
const submitBtn = document.getElementById('submitBtn');

// Function to check if the deadline is valid (not in the past)
function validateDeadline() {
    const deadlineValue = new Date(deadlineInput.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);  // Reset the time to midnight for an accurate comparison

    if (deadlineValue < today) {
        // Invalid date - in the past
        deadlineInput.classList.add('invalid');
        deadlineError.textContent = 'Deadline must be in the future!';
        submitBtn.disabled = true;
    } else {
        // Valid date
        deadlineInput.classList.remove('invalid');
        deadlineError.textContent = '';
        submitBtn.disabled = false;
    }
}

// Add event listeners to check the date on change and input
deadlineInput.addEventListener('input', validateDeadline);
deadlineInput.addEventListener('change', validateDeadline);

// Disable submit button initially if the date input is empty
window.onload = function() {
    if (!deadlineInput.value) {
        submitBtn.disabled = true;
    }
};
