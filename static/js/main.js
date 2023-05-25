// Function to fetch positions data from the server
const getPositions = async () => {
    try {
        // Send a GET request to '/get-positions/' endpoint
        const response = await fetch('/get-positions/');

        // Check if the response is successful
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Handle the positions data
        handlePositions(data);

        // If the current location is '/monitor/', handle monitor position data
        if (location.pathname === '/monitor/') {
            handleMonitorPosition(data);
        }
    } catch (error) {
        console.error('There was a problem fetching the data:', error);
    }
};

// Function to reverse the given slug
function reverseSlug(slug) {
    // Split the slug by '-' and capitalize the first letter of each word
    const reversedSlug = slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    return `${reversedSlug}`;
}

// Function to check if the given slug is active
// Get the slug from the URL hash
// Return 'active' if the slug matches the URL slug, otherwise return an empty string
function checkIfActive(slug) {
    const urlSlug = location.hash.slice(1);
    return slug === urlSlug ? 'active' : '';
}

// Function to format a single position
// Check if the position is active
// Function to determine if the position has been voted
function formatPosition(singlePosition, votedPositions) {
    const activeClass = checkIfActive(singlePosition.slug);
    const isActive = (slug) => votedPositions.includes(slug.slug) ? "Voted" : "Not Voted";
    // Check if the position has been voted
    const checkPosition = isActive(singlePosition);
    // Generate the formatted position HTML
    return `<a class="${activeClass}" onclick="getPollData('${singlePosition.slug}');" href="#${singlePosition.slug}">${singlePosition.title} (${checkPosition})</a>`;
}

// Function to handle the positions data
const handlePositions = (data) => {
    // Get the position list container element
    const positionListContainer = document.getElementById('sidebar');

    // Extract positions and voted positions from the data
    let positions = data.positions;
    let votedPositions = data.voted_positions;


    if (positions.length > 0) {
        // Format each position and join them into a single string
        const formattedPositions = positions
            .map((singlePosition) => formatPosition(singlePosition, votedPositions))
            .join('');

        // Update the position list container with the formatted positions HTML
        positionListContainer.innerHTML = formattedPositions;
    } else {
        // Display a message when no positions are available
        positionListContainer.innerHTML = '<h5>Oops! No position has been added</h5>';
    }

    // Add links for 'Monitor' and 'Logout' at the end of the position list container
    positionListContainer.innerHTML += `<a class="bg-dark" href="users/logout/">Logout</a>`;
};

// Function to toggle the sidebar visibility
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("active");
}

// Call getPositions() if the current location is not '/users/sign-in/'
if (location.pathname === '/users/sign-in/') { }
else if (location.pathname === '/monitor/') { }
else { getPositions(); }
