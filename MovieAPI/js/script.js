// Group members: Arisabeth Simphoukham, Daniel Hana

const apiKey = "https://www.omdbapi.com/?apikey=3dd2a5b1&t=";
let movieName;
const movieSearch = document.getElementById('movieSearch');
const searchBtn = document.getElementById('searchBtn');
const ratings = document.getElementById('ratings');
const placeholderCard = document.getElementById("placeholderCard");

// Show placeholder card by default
showPlaceholderCard();

// This function adds an event listener to the enter key
// If the user presses the enter key it activates the search button
movieSearch.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.key === "Enter") {
        searchBtn.click();
    }
});

// Event listener for the search icon
searchBtn.addEventListener('click', function () {
    movieName = movieSearch.value.trim(); // Trim whitespace
    console.log(movieName);
    movieSearch.value = "";
    ratings.innerHTML = "";
    if (movieName !== "") {
        loadJSON();
        hidePlaceholderCard(); // Hide placeholder card when user searches for a movie
    } else {
        showPlaceholderCard(); // Show placeholder card if search field is empty
    }
});

function loadJSON() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', apiKey + movieName, true);
    xhr.responseType = 'text';
    xhr.onload = function () {
        if (xhr.status === 200) {
            let mInfo = JSON.parse(xhr.responseText);

            // The "Response" value checks if the movie is in the API,
            // if it is, then "Response" equals "True"
            if (mInfo.Response === "True") {
                let card = document.createElement('div');
                card.className = "card fadeIn mx-auto";
                card.style = "width: 36rem";
                ratings.append(card);

                let pic = document.createElement('img');
                pic.className = "img-fluid fadeIn card-img-top";
                card.append(pic);

                let cardBody = document.createElement('div');
                cardBody.className = "card-body";
                card.append(cardBody);

                // Checks if there's a poster of the movie
                if (mInfo.Poster === "N/A") {
                    pic.src = "image/noImage.png";
                } else {
                    pic.src = mInfo.Poster;
                }

                // Loop checks what ratings sites have reviewed the 
                // movie, it makes a new div for every site it finds
                for (let i = 0; i < mInfo.Ratings.length; i++) {
                    let myText = document.createElement('div');
                    myText.className = "card-text";
                    myText.textContent = mInfo.Ratings[i].Source;
                    myText.textContent += ": " + mInfo.Ratings[i].Value;

                    cardBody.append(myText);

                    // Checks the Rotten Tomatoes score
                    if (mInfo.Ratings[i].Source === "Rotten Tomatoes") {
                        let score = parseFloat(mInfo.Ratings[i].Value);

                        let icon = document.createElement('img');
                        icon.className = "img-fluid ml-1";
                        icon.width = "20";
                        icon.height = "20";

                        switch (true) {
                            case (score < 60):
                                icon.src = "image/rotten.png";
                                myText.append(icon);
                                break;
                            case (score >= 60 && score < 80):
                                icon.src = "image/good.png";
                                myText.append(icon);
                                break;
                            case (score >= 80):
                                icon.src = "image/fresh.png";
                                myText.append(icon);
                                break;
                        }
                    }
                }

                // IMDB Rating 
                let myText = document.createElement('div');
                myText.className = "card-text";
                myText.textContent = "IMDB Rating: " + mInfo.imdbRating;
                cardBody.append(myText);
            } else {
                showErrorToast('Movie not found. Please try another title.');
                showPlaceholderCard(); // Show placeholder card when no search results
            }
        } else {
            showErrorToast('Sorry, there was some sort of error. Please try again.');
            showPlaceholderCard(); // Show placeholder card when there is an error
        }
    };
    xhr.send();
}

function showErrorToast(message) {
    const toastElement = document.getElementById('errorToast');
    const toastBody = toastElement.querySelector('.toast-body');
    toastBody.textContent = message;
    const toast = new bootstrap.Toast(toastElement, {
        delay: 5000 // 5 seconds
    });
    toast.show();
}

function showPlaceholderCard() {
    placeholderCard.style.display = "block";
}

function hidePlaceholderCard() {
    placeholderCard.style.display = "none";
}

