// spotify developer credentials

var client_id = "a43d54d7a7d344feb4f19b7be7c700c1";
var client_secret = "c018f8890f564297ae26c852bb7ee4cd";

// get references to document elements
var artistInputEl = document.getElementById("artist-name");
var searchBtn = document.getElementById("search-button");
var locationinputEl = document.getElementById("location-dropdown");
var searchHistory = document.getElementById("search-history");


// this adds the event listener to the search button
searchBtn.addEventListener("click", formSubmitHandler);

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
// this line adds the token to the front of the variable that we now pass to the next function
      var token = Results.access_token + " " + searchVariables;
      getGenre(token);
    });
}

function formSubmitHandler() {
  
  // the below line replaces any space with a hyphen
  var artist = artistInputEl.value.split(" ").join("-").trim();
  var location = locationinputEl.options[locationinputEl.selectedIndex].value;
  // this line combines the two variables, because we can only effectively pass one variable to the next function
  var searchVariables = artist + " " + location;
  // var artist = artistInputEl.value.trim();

  if (searchVariables) {
    getToken(searchVariables);
  }

  // this line runs the function to save searches to local storage
  saveSearch();
};

// print artists genre data to console

function getGenre(token) {
  // url will be updated with dynamic element, this is to test that genre is logging to the console in the interim
  // this line splits the big old passed variable into 3 at every space
  var holderArray = token.split(" ");
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
    // this passes the URL to the next function q: don't know why I couldn't do it in this function, but it didn't like it.
      documentAssign(queryString);
    });
}

// this line loads the eventIndex page with the new dynamically created URL
function documentAssign (queryString) {
  location.assign(queryString);
}


// this function saves search results to local storage

function saveSearch() {
  var search = {
    artist: artistInputEl.value.split(" ").join("-").trim(),
    location: locationinputEl.value,
    state: locationinputEl.options[locationinputEl.selectedIndex].text,
  }

  if (search !== "") {
    var savedSearches =
      JSON.parse(window.localStorage.getItem("savedSearches")) || [];
    //putting the data from the object into local storage
    savedSearches.push(search);
    window.localStorage.setItem("savedSearches", JSON.stringify(savedSearches));
  }
}

// this function adds 'previously searched' buttons to the homepage if data exists in local storage

function populateSearches () {
  searchHistory.innerHTML = '';
  var savedSearches = JSON.parse(window.localStorage.getItem("savedSearches")) || [];

  if (searchHistory != null) {
  var titleElement = document.createElement("p");
  titleElement.textContent = 'Previously Searched';
  searchHistory.appendChild(titleElement);
}
  
  // looping through the searches array and creating a new list item for each of the saved searches
  for (let i = 0; i < savedSearches.length; i++) {
    var liElement = document.createElement("button");
    liElement.classList.add("ui", "basic", "blue", "button");
    var selectedLocation = "";
    if (savedSearches[i].state === "Select Location") {
      selectedLocation = "Australia-Wide";
    } else {
      selectedLocation = savedSearches[i].state;
    }
    liElement.textContent = savedSearches[i].artist.split("-").join(" ") + " in " + selectedLocation;
    searchHistory.appendChild(liElement);
  // this adds an event listener to each dynamically generated button tied to an object in local storage
  // on click it passes the necessary information back into the getToken function
    liElement.addEventListener("click", function () {
      var searchVariables = savedSearches[i].artist + " " + savedSearches[i].location;
      getToken(searchVariables);
    })
  }
  }

  populateSearches();


