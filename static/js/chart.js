let presidentChart;
let vicePresidentChart;

function fetchPresidentData() {
    console.log("Let's go - President Data");
    fetch('/get-poll-data/president/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Work with the JSON data here
            console.log(data);
            handleChartData(data, 'myChart-president');
        })
        .catch(error => {
            console.error('There was a problem fetching the data:', error);
        });
}

function fetchVicePresidentData() {
    console.log("Let's go - Vice President Data");
    fetch('/get-poll-data/vice-president/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Work with the JSON data here
            console.log(data);
            handleChartData(data, 'myChart-vice-president');
        })
        .catch(error => {
            console.error('There was a problem fetching the data:', error);
        });
}

function handleChartData(pollData, chartId) {
    var candidateNames = [];
    var candidateVotes = [];
    const isNull = (n) => n === null ? 0 : n;
    pollData.forEach(function (item) {
        candidateNames.push(item.candidate.name);
        candidateVotes.push(isNull(item.vote));
    });
    console.log(candidateNames);
    console.log(candidateVotes);

    const data = {
        labels: candidateNames,
        datasets: [{
            label: 'Votes',
            data: candidateVotes,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 100, 0.2)',
                'rgba(255, 206, 86, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 100, 1)',
                'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
        }]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };

    if (chartId === 'myChart-president') {
        if (!presidentChart) {
            presidentChart = new Chart(document.getElementById(chartId), config);
        } else {
            presidentChart.data = data;
            presidentChart.update();
        }
    } else if (chartId === 'myChart-vice-president') {
        if (!vicePresidentChart) {
            vicePresidentChart = new Chart(document.getElementById(chartId), config);
        } else {
            vicePresidentChart.data = data;
            vicePresidentChart.update();
        }
    }
}

setInterval(fetchPresidentData, 36000);
setInterval(fetchVicePresidentData, 36000);
fetchPresidentData()
fetchVicePresidentData()