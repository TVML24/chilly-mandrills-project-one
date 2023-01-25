// spotify developer credentials

var client_id = "a43d54d7a7d344feb4f19b7be7c700c1";
var client_secret = "c018f8890f564297ae26c852bb7ee4cd";

// get references to document elements
var artistInputEl = document.querySelector("#artist-name");
var searchBtn = document.querySelector("#search-button");

// this is a button for testing
// this will be updated to become the search button when the landing page is implemented
var testBtn = document.getElementById("test-button");
testBtn.addEventListener("click", formSubmitHandler);

// generate oauth token
function getToken(searchVariables) {
  var token = "";
  fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + btoa(`${client_id}:${client_secret}`),
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: "grant_type=client_credentials",
  })
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then(function (Results) {
      console.log(Results);
// this line adds the token to the front of the variable that we now pass to the next function
      var token = Results.access_token + " " + searchVariables;
      console.log(token);
      getGenre(token);
    });
}

function formSubmitHandler() {
  // WHEN INPUT FORM IS DONE: 
  // (the below variables were included for testing only)
  // 1: variable artist becomes the input value of the bar where you type the artists name.
  // the below line replaces any space with a hyphen
  // 2: variable location becomes the value given by the dropdown
  var artist = "taylor swift".replace(" ", "-").trim();
  var location = "302".trim();
  // this line combines the two variables, because we can only effectively pass one variable to the next function
  var searchVariables = artist + " " + location;
  // var artist = artistInputEl.value.trim();

  if (searchVariables) {
    getToken(searchVariables);
  }
};

// print artists genre data to console

function getGenre(token) {
  // url will be updated with dynamic element, this is to test that genre is logging to the console in the interim
  // this line splits the big old passed variable into 3 at every space
  var holderArray = token.split(" ");
  console.log(holderArray);
  // these variables are made from the split pieces of the array created by splitting the big old variable 
  var token = holderArray[0];
  var artist = holderArray[1];
  var location = holderArray[2];
  var apiUrl =
    "https://api.spotify.com/v1/search?q=" +
    artist +
    "&type=artist&limit=1";
  fetch(apiUrl, {
    headers: { Authorization: "Bearer " + token },
  })
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then(function (Results) {
      // this grabs the genre from the spotify API
    var genre = Results.artists.items[0].genres;
    // this generates the new URL
    var queryString = "./eventindex.html?events?apikey=7elxdku9GGG5k8j0Xm8KWdANDgecHMV0&locale=*&marketId=" + location + "&countryCode=AU&classificationName=" + genre;
      console.log(queryString);
    // this passes the URL to the next function q: don't know why I couldn't do it in this function, but it didn't like it.
      documentAssign(queryString);
    });
}

// this line loads the eventIndex page with the new dynamically created URL
function documentAssign (queryString) {
  location.assign(queryString);
}

// define function to be executed on 'click' of the form 'search' button
// to be un-commented after adding of landing page
// searchBtn.addEventListener("click", formSubmitHandler);

// formSubmitHandler();