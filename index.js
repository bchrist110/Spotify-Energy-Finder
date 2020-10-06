'use strict'

// put your own value below!

const searchURL = 'https://api.spotify.com/v1';

function post() {
  var headers = {
      'Authorization': 'Basic ' + 'ZTYxNjAyZjFiOTI1NGI5NTlhZWZkNDc1OWEwZTQ3MTU6ZGExMjg5OTRhNDk1NGNjYjhjZGJmZjQ2YzNmMTgxOTM= ',
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
  }
  
  var body = new URLSearchParams({
      'code': `eeWiVJ3fz9RVrsC8QUBKWM_xvGaWZYs7kMH0gCfPiByae_z3`,
      'redirect_uri': 'https://api.spotify.com/v1',
      'grant_type': 'client_credentials'
  }).toString();
  
  const myAuthInit = {
      method: "POST",
      headers: headers,
      body: body
  };
  
  const myAuthRequest = new Request("https://accounts.spotify.com/api/token", myAuthInit);
  
  fetch(myAuthRequest)
    .then(response => response.json())
    .then(data => {
      return data
    })
    .catch((error) => {
      console.log("Error:", error);
    });
    
}

function getEnergy(trackID) {
  
  var heads = {
    'Authorization': 'Bearer ' + 'BQBL0CkHuMqdiM7ASdTjuxezHKcVdK-xSm3N7-0gJLDSLsbSW4JJmIUha_kWx4rm2hoeS6wfi24UJR8Q3uE3WkYKfCrgQOobUQ5GsdkauL2aQdAueJijBFEtKkWJ6WAV3j-t6XnnfWo',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
  
  const url2 = searchURL +"/audio-features/" + trackID;

  const myAuthInit2 = {
    method: "GET",
    headers: heads,
};

  const myAuthRequest2 = new Request(url2, myAuthInit2);
  
  fetch(myAuthRequest2)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        console.log(data.energy)
        return data.energy
      })
      .catch((error) => {
          console.log("Error:", error);
      });
}

function getPlaylistTracks() {
  const params1 = {
    market: 'US'
  };

  var heads = {
    'Authorization': 'Bearer ' + 'BQBL0CkHuMqdiM7ASdTjuxezHKcVdK-xSm3N7-0gJLDSLsbSW4JJmIUha_kWx4rm2hoeS6wfi24UJR8Q3uE3WkYKfCrgQOobUQ5GsdkauL2aQdAueJijBFEtKkWJ6WAV3j-t6XnnfWo',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
  const queryString = formatQueryParams(params1)
  const playlistURL = searchURL +"/playlists/37i9dQZF1DXa8NOEUWPn9W/tracks" + '?' + queryString;

  const myAuthInit1 = {
    method: "GET",
    headers: heads,
  };

  const myAuthRequest2 = new Request(playlistURL, myAuthInit1);
  
  fetch(myAuthRequest2)
      .then(response => response.json())
      .then(data => {
        console.log(data)
      })
      .catch((error) => {
          console.log("Error:", error);
      });
}

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  console.log(responseJson);
  $('#results-list').empty();
  for (let i = 0; i < responseJson.tracks.items.length; i++){
    getEnergy(responseJson.tracks.items[i].id)
    $('#results-list').append(
      `<li><h3>${responseJson.tracks.items[i].name}</h3>
      <h4>${responseJson.tracks.items[i].artists[0].name}</h4>
      <p>${responseJson.tracks.items[i].album.name}</p>
      <a href='${responseJson.tracks.items[i].external_urls.spotify}'>${responseJson.tracks.items[i].name}</a>
      </li>`
    )};
};


function search(string, limit=10, typeOfMusic) {
  const params = {
    q: string,
    type: typeOfMusic,
    limit,
  };

  var heads = {
    'Authorization': 'Bearer ' + 'BQBL0CkHuMqdiM7ASdTjuxezHKcVdK-xSm3N7-0gJLDSLsbSW4JJmIUha_kWx4rm2hoeS6wfi24UJR8Q3uE3WkYKfCrgQOobUQ5GsdkauL2aQdAueJijBFEtKkWJ6WAV3j-t6XnnfWo',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
  const queryString = formatQueryParams(params)
  const url = searchURL +"/search" + '?' + queryString;

  const myAuthInit1 = {
    method: "GET",
    headers: heads,
};

  const myAuthRequest1 = new Request(url, myAuthInit1);
  
  fetch(myAuthRequest1)
      .then(response => response.json())
      .then(data => {
        displayResults(data)
        console.log(data)
      })
      .catch((error) => {
          console.log("Error:", error);
      });
}




function watchForm() {
  post()
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    const typeOf = $('#type').val();
    
    search(searchTerm, maxResults, typeOf);
    //getEnergy("6JyuJFedEvPmdWQW0PkbGJ")
    //getPlaylistTracks()
  });
}

$(watchForm);