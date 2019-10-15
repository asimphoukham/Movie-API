//Group members: Arisabeth Simphoukham
//               Daniel Hana

const apiKey = "https://www.omdbapi.com/?i=tt3896198&apikey=3dd2a5b1&t=";
let movieName;
let txtSearch = document.getElementById('txtSearch');
let btnSearch = document.getElementById('btnSearch');
let ratings = document.getElementById('ratings');


//This function adds an event listener to the enter key
//If the user presses the enter key it activates the search button
txtSearch.addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        //13 is the number for the "ENTER" key.
        btnSearch.click();
    }
});


//Event listener for the search icon
btnSearch.addEventListener('click', function () {
    movieName = txtSearch.value;
    console.log(movieName);
    txtSearch.value = "";
    ratings.innerHTML = "";
    if (movieName != "") {
        loadJSON();
    }
})

function loadJSON() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', apiKey + movieName, true);
    xhr.responseType = 'text';
    xhr.onload = function () {
        if (xhr.status === 200) {
            mInfo = JSON.parse(xhr.responseText);

            /*The "Response" value checks if the movie is in the API,
            if it is, then "Response" equals "True"*/
            if (mInfo.Response === "True") {
                let card = document.createElement('div');
                card.className = "card fadeIn mx-auto";
                card.style = "width: 22rem";
                ratings.append(card);

                let pic = document.createElement('img');
                pic.className = "img-fluid fadeIn card-img-top";
                card.append(pic);

                let cardBody = document.createElement('div');
                cardBody.className = "card-body";
                card.append(cardBody);

                //Checks if theres a poster of the movie
                if (mInfo.Poster === "N/A") {
                    pic.src = "image/noImage.png"
                } else {
                    pic.src = mInfo.Poster;
                }

                /*This loop checks what ratings sites have reviewed the 
                movie, it makes a new div for every site if finds*/
                for (let i = 0; i < mInfo.Ratings.length; i++) {
                    let myText = document.createElement('div');
                    myText.className = "card-text"
                    myText.textContent = mInfo.Ratings[i].Source;
                    myText.textContent += ": " + mInfo.Ratings[i].Value;

                    cardBody.append(myText);

                    //Checks the rotten tomatoes score
                    if (mInfo.Ratings[i].Source === "Rotten Tomatoes") {
                        let score = parseFloat(mInfo.Ratings[i].Value);

                        let icon = document.createElement('img');
                        icon.className = "img-fluid ml-1";
                        icon.width = "20";
                        icon.height = "20";

                        switch (true) {
                            case (score < 60):
                                icon.src = "image/rotten.png"
                                myText.append(icon);
                                break;
                            case (score > 60 && score < 80):
                                icon.src = "image/good.png"
                                myText.append(icon);
                                break;
                            case (score >= 80):
                                icon.src = "image/fresh.png"
                                myText.append(icon);
                                break;
                        }
                    }
                }

                //IMDB Rating
                let myText = document.createElement('div');
                myText.className = "card-text"
                myText.textContent += "IMDB Rating: " + mInfo.imdbRating;
                cardBody.append(myText);
            } else {
                alert("Error: could not find movie.");
            }
        }
        else {
            alert("Sorry, there was some sort of error.");
        }
    }
    xhr.send();
}