function toggleLoader(action) {
    const social = document.getElementById("social");
    const preloder = document.getElementById("preloder");
    if (action === "start") {
        social.style.display = "none";
        preloder.style.display = "block";
    }
    else if (action === "stop") {
        social.style.display = "block";
        preloder.style.display = "none";
    }
}
function getPollData(pollSlug) {
    console.log(pollSlug);
    toggleLoader("start");
    const isNull = (n) => (n === undefined || null ? 'president' : n);
    const checkedPollSlug = isNull(pollSlug);

    fetch(`/get-poll-data/${checkedPollSlug}/`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            toggleLoader("stop");
            handlePollData(data);
            updateActivePosition(checkedPollSlug);
            const isReversible = (slug) => slug.includes('-') ? reverseSlug(slug) : slug.charAt(0).toUpperCase() + slug.slice(1);
            const reversedSlug = isReversible(checkedPollSlug);
            const current_position = document.getElementById('current_position');
            current_position.innerText = reversedSlug;
            const votingForm = document.getElementById('vote');
            votingForm.action = `/vote/${checkedPollSlug}`;
            votingForm.method = 'POST';
        })
        .catch(error => {
            console.error('There was a problem fetching the data:', error);
            alert('An error occurred while fetching poll data');
        });
}

const handlePollData = (pollDataList) => {
    console.log(pollDataList);
    // Select the card container
    const cardContainer = document.getElementById("card-container");
    cardContainer.innerHTML = "";
    // Loop through the card data and create the cards
    for (let pollData of pollDataList) {
        const { candidate, position } = pollData;

        // Create a div element to hold the card
        const card = document.createElement("div");
        card.classList.add("mb-4", "bg-white", "border", "border-gray-200", "rounded-lg", "shadow", "dark:bg-gray-800", "dark:border-gray-700");

        // Create an img element for the card image
        const cardImage = document.createElement("img");
        cardImage.classList.add("rounded-t-lg", "w-full", "h-72");
        cardImage.setAttribute("src", candidate.image);
        cardImage.setAttribute("alt", candidate.name);


        // Create a div element for the card content
        const cardContent = document.createElement("div");
        cardContent.classList.add("p-5");

        // Create an h5 element for the card title
        const cardTitle = document.createElement("h5");
        cardTitle.classList.add("mb-2", "text-2xl", "font-bold", "tracking-tight", "text-gray-900", "dark:text-white");
        cardTitle.textContent = candidate.name;

        // Create a p element for the card description
        const cardDescription = document.createElement("p");
        cardDescription.classList.add("mb-3", "font-normal", "text-gray-700", "dark:text-gray-400");
        cardDescription.textContent = position.title;

        // Create an input element for the card button
        const cardButton = document.createElement("input");
        cardButton.classList.add("h-8", "w-8");
        cardButton.setAttribute("type", "radio");
        cardButton.setAttribute("name", position.slug);
        cardButton.setAttribute("value", candidate.uuid);
        cardButton.setAttribute("id", position.title);
        // cardButton.setAttribute("onclick", "disableOtherRadio()");

        // Create a label element for the card button
        const cardButtonLabel = document.createElement("label");
        cardButtonLabel.classList.add("radio");
        cardButtonLabel.setAttribute("for", "president");

        // Append the card image, title, description, button and button label to the card content div
        cardContent.appendChild(cardTitle);
        cardContent.appendChild(cardDescription);
        cardContent.appendChild(cardButton);
        cardContent.appendChild(cardButtonLabel);

        // Append the card image and content to the card div
        card.appendChild(cardImage);
        card.appendChild(cardContent);

        // Append the card to the card container
        cardContainer.appendChild(card);
    }
}
const updateActivePosition = (pollSlug) => {
    const positionLinks = document.querySelectorAll('#sidebar a');
    positionLinks.forEach(link => {
        if (link.getAttribute('href') === `#${pollSlug}`) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
};
const form = document.getElementById("vote");
form.addEventListener("submit", vote);
function vote(event) {
    event.preventDefault();
    var formAction = event.target.action;
    const parts = formAction.split("/");
    const lastPart = parts[parts.length - 1];
    try {
        var candidateValue = document.querySelector(`input[name="${lastPart}"]:checked`).value;
        fetch("vote/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "X-CSRFToken": getCookie("csrftoken"),
            },
            body: JSON.stringify({
                position: lastPart,
                candidate: candidateValue
            }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const nextPosition = data.next_position;
                const message = data.message;
                alert(message);
                getPositions();
                if (nextPosition !== null) { getPollData(nextPosition); }
                else { getPollData(); }

            })
            .catch(error => {
                console.error(error);
                alert("An error occurred while processing the vote");
            });
    } catch (error) {
        console.error(error);
        alert("An error occurred while processing the vote");
    }
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
getPollData();

