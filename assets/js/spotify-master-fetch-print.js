// spotify developer credentials

var client_id = "a43d54d7a7d344feb4f19b7be7c700c1";
var client_secret = "c018f8890f564297ae26c852bb7ee4cd";

// get references to document elements
var artistInputEl = document.querySelector("#artist-name");
var searchBtn = document.querySelector("#search-button");

// generate oauth token
function getToken() {
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
      var token = Results.access_token;
      getGenre(token);
    });
}

// dynamically update spotify api call based on artist input in search bar
var formSubmitHandler = function (event) {
  event.preventDefault();

  var artist = artistInputEl.value.trim();

  // note, need to input a '-' in between words

  if (artist) {
    console.log(artist);
    getGenre(token);
  }
};

// print artists genre data to console

function getGenre(token) {
  // url will be updated with dynamic element, this is to test that genre is logging to the console in the interim
  apiUrl =
    "https://api.spotify.com/v1/search?q=" +
    "taylor%20swift" +
    "&type=artist&limit=1";
  console.log(token);
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
      console.log(Results.artists.items[0].genres);
    });
}

getToken();

// define function to be executed on 'click' of the form 'search' button
searchBtn.addEventListener("click", formSubmitHandler);