// spotify developer credentials

var client_id = 'a43d54d7a7d344feb4f19b7be7c700c1';
var client_secret = 'c018f8890f564297ae26c852bb7ee4cd';

// generate oauth token
    function getToken() {
        fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + btoa(`${client_id}:${client_secret}`),
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: 'grant_type=client_credentials'
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.access_token);
            return data.access_token;
        });
        getGenre();
    }

    // print artists genre data to console

    function getGenre() {
        // url will be updated with dynamic element, this is to test that genre is logging to the console in the interim
        apiUrl = 'https://api.spotify.com/v1/search?q=' + 'taylor%20swift' + '&type=artist&limit=1';
        fetch(apiUrl, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + data.access_token},
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.artists.items[0].genres);
        });
    }

    getToken();

    