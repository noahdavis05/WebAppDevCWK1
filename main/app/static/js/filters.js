document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");

    const filterStatusSelect = document.getElementById("filter-status");
    const filterModuleSelect = document.getElementById("filter-module");
    const searchInput = document.getElementById("search-title");
    const assignmentCards = document.querySelectorAll(".assignment-card");
    
    // Get filter and order containers and buttons
    const filterContainer = document.getElementById("filter-container");
    const orderContainer = document.getElementById("order-container");
    const toggleFiltersButton = document.getElementById("toggle-filters");
    const orderByButton = document.getElementById("order-by");
    
    // Radio buttons for ordering
    const orderSoonest = document.getElementById("orderSoonest");
    const orderLatest = document.getElementById("orderLatest");

    // Default sorting on page load
    sortAssignments("soonest");

    // Function to save filters to local storage
    function saveFilters() {
        const selectedStatusFilter = filterStatusSelect.value;
        const selectedModuleFilter = filterModuleSelect.value;
        const searchQuery = searchInput.value.toLowerCase();

        // Save to local storage
        localStorage.setItem('filterStatus', selectedStatusFilter);
        localStorage.setItem('filterModule', selectedModuleFilter);
        localStorage.setItem('searchTitle', searchQuery);
    }

    // Function to load filters from local storage
    function loadFilters() {
        const savedStatusFilter = localStorage.getItem('filterStatus');
        const savedModuleFilter = localStorage.getItem('filterModule');
        const savedSearchQuery = localStorage.getItem('searchTitle');

        // Apply the loaded values if they exist
        if (savedStatusFilter) {
            filterStatusSelect.value = savedStatusFilter;
        }
        if (savedModuleFilter) {
            filterModuleSelect.value = savedModuleFilter;
        }
        if (savedSearchQuery) {
            searchInput.value = savedSearchQuery;
        }

        // Call filterAssignments to reflect loaded filters
        filterAssignments();
    }

    function filterAssignments() {
        const selectedStatusFilter = filterStatusSelect.value;
        const selectedModuleFilter = filterModuleSelect.value;
        const searchQuery = searchInput.value.toLowerCase();
   
        let visibleCardCount = 0; // Track how many cards are visible
   
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
   
            // Show or hide the card based on the filters
            card.style.display = showCard ? "block" : "none";
   
            // Count visible cards
            if (showCard) {
                visibleCardCount++;
            }
        });
   
        // Show or hide the "No tasks" message based on the visible card count
        const noTasksMessage = document.getElementById("no-tasks-message");
        if (visibleCardCount === 0) {
            noTasksMessage.style.display = "block";
        } else {
            noTasksMessage.style.display = "none";
        }
    }

    // Function to convert 'dd-mm-yyyy' format to a Date object
    function parseDate(dateString) {
        const [day, month, year] = dateString.split("-");
        return new Date(`${year}-${month}-${day}`);  // Format as 'yyyy-mm-dd'
    }

    // Sort assignments based on the due date
    function sortAssignments(order) {
        // Get the cards and convert to an array
        const assignmentList = Array.from(document.querySelectorAll(".assignment-card"));
    
        if (order === "soonest") {
            // Sort by deadline
            assignmentList.sort((card1, card2) => {
                const date1 = parseDate(card1.querySelector(".dateP").dataset.deadline);
                const date2 = parseDate(card2.querySelector(".dateP").dataset.deadline);
                return date1 - date2; // Ascending order
            });
        } else if (order === "latest") {
            // Sort by deadline (latest first)
            assignmentList.sort((card1, card2) => {
                const date1 = parseDate(card1.querySelector(".dateP").dataset.deadline);
                const date2 = parseDate(card2.querySelector(".dateP").dataset.deadline);
                return date2 - date1; // Descending order
            });
        }
    
        // Get the parent container of these cards
        const parentContainer = document.querySelector('.row');
    
        // Remove all existing cards
        document.querySelectorAll('.assignment-card').forEach(card => card.remove());
    
        // Append the sorted cards back into the container
        assignmentList.forEach(card => {
            parentContainer.appendChild(card);
        });
    
        console.log(assignmentList); // For debugging purposes
    }

    // Toggle filter visibility
    toggleFiltersButton.addEventListener("click", function () {
        const isFilterVisible = filterContainer.style.display === "block";
        filterContainer.style.display = isFilterVisible ? "none" : "block";
        orderContainer.style.display = "none";  // Hide the order container when filters are shown
        orderByButton.textContent = "Order"; // Reset Order By button text
        toggleFiltersButton.textContent = isFilterVisible ? "Filter" : "Hide"; // Change button text
    });

    // Toggle order visibility
    orderByButton.addEventListener("click", function () {
        const isOrderVisible = orderContainer.style.display === "block";
        orderContainer.style.display = isOrderVisible ? "none" : "block";
        filterContainer.style.display = "none";  // Hide the filter container when order is shown
        toggleFiltersButton.textContent = "Filter"; // Reset Filters button text
        orderByButton.textContent = isOrderVisible ? "Order" : "Hide"; // Change button text
    });

    // Handle radio button change event to trigger sorting
    document.querySelectorAll('input[name="orderOptions"]').forEach(radio => {
        radio.addEventListener("change", function () {
            if (this.value === "soonest") {
                sortAssignments("soonest");
            } else if (this.value === "latest") {
                sortAssignments("latest");
            }
        });
    });

    // Event listeners for all filters
    filterStatusSelect.addEventListener("change", function () {
        filterAssignments();
        saveFilters(); // Save the selected filter
    });

    filterModuleSelect.addEventListener("change", function () {
        filterAssignments();
        saveFilters(); // Save the selected filter
    });

    searchInput.addEventListener("input", function () {
        filterAssignments();
        saveFilters(); // Save the search input
    });

    // Load filters from local storage on page load
    loadFilters();


});
