const getPresidentData = () => {
    fetch('/get-poll-data/president/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {

            handlePresidentData(data);
        })
        .catch(error => {
            console.error('There was a problem fetching the data:', error);
        });
}
const handlePresidentData = (presidentData) => {
    // Select the card container
    const cardContainer = document.getElementById("card-container");

    // Loop through the card data and create the cards
    for (let cardData of presidentData) {
        // Create a div element to hold the card
        const card = document.createElement("div");
        card.classList.add("mb-4", "bg-white", "border", "border-gray-200", "rounded-lg", "shadow", "dark:bg-gray-800", "dark:border-gray-700");

        // Create an img element for the card image
        const cardImage = document.createElement("img");
        cardImage.classList.add("rounded-t-lg", "w-full", "h-72");
        cardImage.setAttribute("src", cardData.candidate.image);
        cardImage.setAttribute("alt", cardData.candidate.name);


        // Create a div element for the card content
        const cardContent = document.createElement("div");
        cardContent.classList.add("p-5");

        // Create an h5 element for the card title
        const cardTitle = document.createElement("h5");
        cardTitle.classList.add("mb-2", "text-2xl", "font-bold", "tracking-tight", "text-gray-900", "dark:text-white");
        cardTitle.textContent = cardData.candidate.name;

        // Create a p element for the card description
        const cardDescription = document.createElement("p");
        cardDescription.classList.add("mb-3", "font-normal", "text-gray-700", "dark:text-gray-400");
        cardDescription.textContent = cardData.position.title;

        // Create an input element for the card button
        const cardButton = document.createElement("input");
        cardButton.classList.add("h-8", "w-8");
        cardButton.setAttribute("type", "radio");
        cardButton.setAttribute("name", "president");
        cardButton.setAttribute("value", cardData.candidate.uuid);
        cardButton.setAttribute("id", cardData.position.title);
        cardButton.setAttribute("onclick", "disableOtherRadio()");

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


getPresidentData()
const getVPresidentData = () => {
    fetch('/get-poll-data/vice-president/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {

            handleVPresidentData(data);
        })
        .catch(error => {
            console.error('There was a problem fetching the data:', error);
        });
}
const handleVPresidentData = (vPresidentData) => {
    // Select the card container
    const VpContainer = document.getElementById("Vp-container");

    // Loop through the card data and create the cards
    for (let cardData of vPresidentData) {
        // Create a div element to hold the card
        const card = document.createElement("div");
        card.classList.add("mb-4", "bg-white", "border", "border-gray-200", "rounded-lg", "shadow", "dark:bg-gray-800", "dark:border-gray-700");
        // Create an img element for the card image
        const cardImage = document.createElement("img");
        cardImage.classList.add("rounded-t-lg", "w-full", "h-72");
        cardImage.setAttribute("src", cardData.candidate.image);
        cardImage.setAttribute("alt", cardData.candidate.name);

        // Create a div element for the card content
        const cardContent = document.createElement("div");
        cardContent.classList.add("p-5");

        // Create an h5 element for the card title
        const cardTitle = document.createElement("h5");
        cardTitle.classList.add("mb-2", "text-2xl", "font-bold", "tracking-tight", "text-gray-900", "dark:text-white");
        cardTitle.textContent = cardData.candidate.name;

        // Create a p element for the card description
        const cardDescription = document.createElement("p");
        cardDescription.classList.add("mb-3", "font-normal", "text-gray-700", "dark:text-gray-400");
        cardDescription.textContent = cardData.position.title;

        // Create an input element for the card button
        const cardButton = document.createElement("input");
        cardButton.classList.add("h-8", "w-8");
        cardButton.setAttribute("type", "radio");
        cardButton.setAttribute("name", "vpresident");
        cardButton.setAttribute("id", cardData.candidate.id);
        cardButton.setAttribute("value", cardData.candidate.uuid);
        cardButton.setAttribute("onclick", "disableOtherRadio()");

        // Create a label element for the card button
        const cardButtonLabel = document.createElement("label");
        cardButtonLabel.classList.add("radio");
        cardButtonLabel.setAttribute("for", "vpresident");

        // Append the card image, title, description, button and button label to the card content div
        cardContent.appendChild(cardTitle);
        cardContent.appendChild(cardDescription);
        cardContent.appendChild(cardButton);
        cardContent.appendChild(cardButtonLabel);

        // Append the card image and content to the card div
        card.appendChild(cardImage);
        card.appendChild(cardContent);

        // Append the card to the card container
        VpContainer.appendChild(card);
    }
    console.log("Just ran")
}
getVPresidentData();



const form = document.getElementById("voting-form");
form.addEventListener("submit", submitForm);

function submitForm(event) {
    event.preventDefault();

    const presidentValue = document.querySelector('input[name="president"]:checked').value;
    const vpresidentValue = document.querySelector('input[name="vpresident"]:checked').value;

    fetch("vote/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify({
            president: presidentValue,
            vpresident: vpresidentValue,
        }),
    })
        .then(response => response.json())
        .then(data => {
            const message = data.message;
            alert(message);
        })
        .catch(error => console.error(error));
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

