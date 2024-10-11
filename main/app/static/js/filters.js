document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");

    const filterStatusSelect = document.getElementById("filter-status");
    const filterModuleSelect = document.getElementById("filter-module");
    const searchInput = document.getElementById("search-title");
    const assignmentCards = document.querySelectorAll(".assignment-card");
    const filterContainer = document.getElementById("filter-container");
    const toggleFiltersButton = document.getElementById("toggle-filters");

    console.log("Filter Status Select:", filterStatusSelect);
    console.log("Filter Module Select:", filterModuleSelect);
    console.log("Search Input:", searchInput);
    console.log("Assignment Cards:", assignmentCards);

    function filterAssignments() {
        const selectedStatusFilter = filterStatusSelect.value;
        const selectedModuleFilter = filterModuleSelect.value;
        const searchQuery = searchInput.value.toLowerCase();

        console.log("Status Filter:", selectedStatusFilter);
        console.log("Module Filter:", selectedModuleFilter);
        console.log("Search Query:", searchQuery);

        assignmentCards.forEach(card => {
            const status = card.getAttribute("data-status");
            const moduleCode = card.getAttribute("data-module-code");
            const title = card.getAttribute("data-title");

            let showCard = true; // Start by assuming we want to show this card

            // Filter by status
            if (selectedStatusFilter !== "all") {
                showCard = (selectedStatusFilter === "completed" && status === "completed") ||
                           (selectedStatusFilter === "incomplete" && status === "incomplete");
            }

            // Filter by module code
            if (showCard && selectedModuleFilter !== "all") {
                showCard = (moduleCode === selectedModuleFilter);
            }

            // Filter by title
            if (showCard && searchQuery) {
                showCard = title.includes(searchQuery);
            }

            card.style.display = showCard ? "block" : "none"; // Show or hide the card
        });
    }

    // Toggle filter visibility
    toggleFiltersButton.addEventListener("click", function () {
        const isVisible = filterContainer.style.display === "block";
        filterContainer.style.display = isVisible ? "none" : "block";
        toggleFiltersButton.textContent = isVisible ? "Apply Filters" : "Hide Filters"; // Change button text
    });

    // Event listeners for all filters
    filterStatusSelect.addEventListener("change", filterAssignments);
    filterModuleSelect.addEventListener("change", filterAssignments);
    searchInput.addEventListener("input", filterAssignments);
});
