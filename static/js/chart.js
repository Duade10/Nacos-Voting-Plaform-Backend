const getPollPositions = async () => {
    try {
        const response = await fetch('/get-positions/');
        if (!response.ok) { throw new Error('Network response was not ok'); }
        const data = await response.json();
        handleMonitorPosition(data);
    } catch (error) {
        console.error('There was a problem fetching the data:', error);
    }
};
function handleMonitorPosition(positionsData) {
    let positions = positionsData.positions;
    const monitorPositionListContainer = document.getElementById("chart-container");
    if (positions.length > 0) {
        // Format each position and join them into a single string
        const formattedPositions = positions
            .map((singlePositions) => formatCanvasContainer(singlePositions.slug))
            .join('');
        // Update the position list container with the formatted positions HTML
        monitorPositionListContainer.innerHTML = formattedPositions;
        positions.forEach(positions => {
            fetchVotingData(positions.slug)
        });
    } else {
        // Display a message when no positions are available
        monitorPositionListContainer.innerHTML = '<h5>Oops! No position has been added</h5>';
    }

}

function formatCanvasContainer(position_slug) {
    return `<h3 class="text-lg font-bold mb-4">${reverseSlug(position_slug)}</h3>
            <canvas id="myChart-${position_slug}" width="100" height="20"></canvas>
            <hr/>
            `
}

function fetchVotingData(position_slug) {
    fetch(`/get-poll-data/${position_slug}/`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Work with the JSON data here
            handleChartData(data, position_slug);
        })
        .catch(error => {
            console.error('There was a problem fetching the data:', error);
        });
}

function handleChartData(votingData, position_slug) {
    // Get the canvas element

    var candidatesNameList = [];
    var candidatesVoteList = [];

    votingData.forEach(votingData => {
        var candidateName = votingData.candidate.name;
        var candidateVote = votingData.vote;
        candidatesNameList.push(candidateName);
        candidatesVoteList.push(candidateVote);
    });
    var ctx = document.getElementById(`myChart-${position_slug}`).getContext('2d');
    //Create the chart
    var myChart = new Chart(ctx, {
        type: 'bar', // Change the type of chart here (e.g., bar, line, pie, etc.)
        data: {
            labels: candidatesNameList,
            datasets: [{
                label: '# of Votes',
                data: candidatesVoteList,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


setInterval(getPollPositions, 30000);
getPollPositions();
