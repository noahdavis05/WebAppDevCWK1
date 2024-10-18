window.onload = function () {
    const form = document.querySelector("form");
    const titleInput = document.getElementById("title");
    const moduleCodeInput = document.getElementById("module_code");
    const descriptionInput = document.getElementById("description");
    const completedCheckbox = document.getElementById("is_completed");
    const submitButton = document.querySelector("button[type='submit']");
    
    const titleError = document.getElementById("titleError");
    const moduleCodeError = document.getElementById("moduleCodeError");
    const descriptionError = document.getElementById("descriptionError");
    const completedError = document.getElementById("completedError");

    function validateTitle() {
        const titleValue = titleInput.value.trim();
        if (titleValue.length < 3 || titleValue.length > 100) {
            titleError.textContent = "Title must be between 3 and 100 characters.";
            titleInput.classList.add("is-invalid");
            return false;
        } else {
            titleError.textContent = "";
            titleInput.classList.remove("is-invalid");
            titleInput.classList.add("is-valid");
            return true;
        }
    }

    function validateModuleCode() {
        const moduleCodeValue = moduleCodeInput.value.trim();
        if (moduleCodeValue.length < 1 || moduleCodeValue.length > 20) {
            moduleCodeError.textContent = "Module code must be between 1 and 20 characters.";
            moduleCodeInput.classList.add("is-invalid");
            return false;
        } else {
            moduleCodeError.textContent = "";
            moduleCodeInput.classList.remove("is-invalid");
            moduleCodeInput.classList.add("is-valid");
            return true;
        }
    }

    function validateDescription() {
        const descriptionValue = descriptionInput.value.trim();
        if (descriptionValue.length > 500) {
            descriptionError.textContent = "Description cannot exceed 500 characters.";
            descriptionInput.classList.add("is-invalid");
            return false;
        } else {
            descriptionError.textContent = "";
            descriptionInput.classList.remove("is-invalid");
            descriptionInput.classList.add("is-valid");
            return true;
        }
    }

    function validateCompleted() {
        // This just checks if it's a valid checkbox (checked or unchecked).
        if (completedCheckbox.checked || !completedCheckbox.checked) {
            completedError.textContent = "";  // No error for valid state
            return true;
        } else {
            completedError.textContent = "Invalid value for completed status.";  // Hypothetical scenario
            return false;
        }
    }

    function validateForm() {
        const isTitleValid = validateTitle();
        const isModuleCodeValid = validateModuleCode();
        const isDescriptionValid = validateDescription();
        const isCompletedValid = validateCompleted();

        if (isTitleValid && isModuleCodeValid && isDescriptionValid && isCompletedValid) {
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
    }

    // Validate inputs on input change
    titleInput.addEventListener("input", validateForm);
    moduleCodeInput.addEventListener("input", validateForm);
    descriptionInput.addEventListener("input", validateForm);
    completedCheckbox.addEventListener("change", validateForm);

    // Initial validation check on page load
    validateForm();
};
