var cardBox = document.getElementById("card-box");


// The comment below shows how you can get the ticketmaster API to return only events from Australia (countryCode=AU), NSW (locale=*&marketId=302), rock music (classificationName = rock)
// https://app.ticketmaster.com/discovery/v2/events?apikey=7elxdku9GGG5k8j0Xm8KWdANDgecHMV0&locale=*&marketId=302&countryCode=AU&classificationName=rock

//this is the base url for the tickiteck API and the APIkey we are using
var queryURL = "https://app.ticketmaster.com/discovery/v2/events?apikey=7elxdku9GGG5k8j0Xm8KWdANDgecHMV0"

// this function has the genre and location passed to it from the function that interacts with the spotify API AND a html <select> element for the location
// the select <element> should have a value for each option that holds the marketID for that location
// e.g. <select> <option value="302">NSW</option>

// when index html uses the path passed to it by a function to location.assign()
// a function takes that path and split()s it where necessary to create the JSON request.
// e.g. C:/Users/exmaple/bootcamp/test/search-results.html/events?apikey=7elxdku9GGG5k8j0Xm8KWdANDgecHMV0&locale=*&marketId=302&countryCode=AU&classificationName=rock

function grabParams() {
// .search only grabs the text after the .html part of the url
// so this variable contains the who string we need to search the ticketmasterAPI
    // var params = document.location.search.split("?");
    //(this is an example URL -> the real URL would be built by another function that grabbed the genre from spotify and a dropdown select for location)
    var params = "C:/Users/exmaple/bootcamp/test/search-results.html/events?apikey=7elxdku9GGG5k8j0Xm8KWdANDgecHMV0&locale=*&marketId=302&countryCode=AU&classificationName=rock";
// .pop() returns the last element of an array (which we made by splitting document.location)
    var selectedTerm = params.split('?').pop();
    console.log(selectedTerm);
// this recombines the url into something we can make the request with
    var searchTerm = "https://app.ticketmaster.com/discovery/v2/events?" + selectedTerm;
// this ends the function if searchTerm is not truthy
    if (!searchTerm) {
        return;
    }
        searchAPI(searchTerm);

}

function searchAPI(searchTerm) {
    fetch(searchTerm)

        .then(function (response) {
            if (!response.ok) {
                throw response.json();
            }
            return response.json();
        })
        .then(function (locResults) {
            // Selected each card(eventBox)
            // var eventBox = document.querySelectorAll('.header');
            // // Looped over these cards and assigned an event name to each one
            // for (var i = 0; i < eventBox.length; i++) {
            //     // var eventName = locResults._embedded.events[i].name
            //     eventBox[i].textContent = locResults._embedded.events[i].name;

            // }
            // // selected each Cards information section.
            // var eventInfo = document.querySelectorAll('.description');
            // // Looped over these information sections and assigned related details.
            // for (var i = 0; i < eventInfo.length; i++) {
            //     // var eventName = locResults._embedded.events[i].info
            //     eventInfo[i].textContent = locResults._embedded.events[i].info;

            // }
           
            
            console.log(locResults);
            // if there are no results found it will log no results in the console and on the page
            // results here refers to the data that fulfilled the promise .then was waiting for, here the return of response.json().
            if (!locResults._embedded.events.length) {
                console.log("No Results Found!");
            } else {
                console.log("events==>",locResults._embedded.events)
                for (var i = 0; i < locResults._embedded.events.length; i++) {
                    printResults(locResults._embedded.events[i]);
                }
            }
        })
        // above there was a throw exception, here is the catch
        // should an error be encountered (and the promise unable to be fuilfilled) the code will resume from this block
        .catch(function (error) {
            console.error(error);
        });



    function printResults(resultObj) {
        var eventCard = document.createElement("div");
            eventCard.classList.add("card");
        var imageDiv = document.createElement("div");
            imageDiv.classList.add("image");
        var cardImage = document.createElement("img");
            cardImage.src = resultObj.images[0].url;
            cardImage.alt = resultObj.name;
        var cardContent= document.createElement("div");
            cardContent.className += "content";
        var cardHeader = document.createElement("div");
            cardHeader.className += "header";
            cardHeader.textContent = resultObj.name;
        var metaDiv = document.createElement("div");
            metaDiv.className += "meta";
            metaLink = document.createElement("a");
        var descriptionDiv = document.createElement("div");
            descriptionDiv.className += "description";
            descriptionDiv.textContent = resultObj.info;
        var excontentDiv = document.createElement("div");
            excontentDiv.className += "extra content";
        var spanOne = document.createElement("span");
            spanOne.className += "right floated";
        var eventPrice;
        if (!resultObj.priceRanges) {   
            eventPrice = "No Pricing Available";
        } else if (resultObj.priceRanges[0].min === 0) {
            eventPrice = "$" + resultObj.priceRanges[0].max;
        } else {
            eventPrice = "$" + resultObj.priceRanges[0].min;
        }
            spanOne.textContent = resultObj._embedded.venues[0].name;
        var spanTwo = document.createElement("span");
            spanTwo.textContent = eventPrice;
        var infoBtn = document.createElement('div');
            infoBtn.classList.add("ui", "bottom", "attached", "button"); 
            infoBtn.innerHTML = '<i class="angle down icon"></i>More Information';  
            //Appends dynamically created elements 
            imageDiv.append(cardImage);
            cardContent.append(cardHeader);
            metaDiv.append(metaLink);
            cardContent.append(metaDiv);
            cardContent.append(descriptionDiv);
            excontentDiv.append(spanOne);
            excontentDiv.append(spanTwo);
            eventCard.append(imageDiv);
            eventCard.append(cardContent);
            eventCard.append(excontentDiv);
            cardBox.append(eventCard);
            eventCard.append(infoBtn);

        console.log(resultObj);

    }
    // ONE ISSUE: the information available in these objects is sometimes missing or undefined.
    // the final function will have to be written so that it does not return undefined results and instead gives placeholder text

    // this returns the start date of the event - or the first show if there are more than one
    // console.log(resultObj.dates.start.localDate);
    // // this returns the start time of the show
    // console.log(resultObj.dates.start.localTime);
    // this returns the name of the venue the event is being held
    // console.log(resultObj._embedded.venues[0].name);
    // this returns the name of the event
    // console.log(resultObj.name);
    // this returns basic info about the event
    // console.log(resultObj.info);
    // these return pricing for tickets. The min value seems to be standing and max seems to be seated.
    // console.log(resultObj.priceRanges[0].min);
    // console.log(resultObj.priceRanges[0].max);

}

function searchEvents(){
  // search required to know what parameters the api needs.
  // location and artist doesnt match the api.
}

grabParams();

function toggleVisInfo(){
    var information = document.querySelectorAll('.description');
    information.forEach(function(info){
        if (info.style.display === "block") {
        info.style.display = "none";
    }else{
        info.style.display = "block";
    }
})
   
}
addEventListener('click', toggleVisInfo);

  


