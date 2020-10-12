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
  
  return fetch(myAuthRequest)
    .then(response => response.json())
    .then(data => {
      return data.access_token
    })
    .catch((error) => {
      alert("Error:", error);
    });
    
}

function getEnergy(trackID, accToken) {
  
  var heads = {
    'Authorization': 'Bearer ' + accToken,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
  
  const url2 = searchURL +"/audio-features?ids=" + trackID;

  const myAuthInit2 = {
    method: "GET",
    headers: heads,
};

  const myAuthRequest2 = new Request(url2, myAuthInit2);
  
  return fetch(myAuthRequest2)
      .then(response => response.json())
      .then(data => {
        console.log(data.audio_features)
        return data.audio_features
      })
      .catch((error) => {
          console.log("Error:", error);
      });
}

function getPlaylistTracks(accToken) {
  const params1 = {
    market: 'US'
  };

  var heads = {
    'Authorization': 'Bearer ' + accToken,
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

const webURL = "https://open.spotify.com/embed/track/"

function energyRating(energy) {
  if (energy < 0.5) {
    return "Low"
  }
  if (0.5 < energy < 0.6) {
    return "Mid-low"
  }
  if (0.6 < energy < 0.7) {
    return "Medium"
  }
  if (0.7 < energy < 0.8) {
    return "Mid-high"
  }
  if (0.8 < energy < 0.9) {
    return "High"
  }
  else {
    return "Super High"
  }
}

function displayResults(responseJson, accToken) {
  console.log(responseJson);
  var trackIds = []
  $('#results-list').empty();
  $('#results-list').append(
      `<li class="group">
      <h3 class = "item item-double">Songs:</h3>
      <h3 class = "item">Spotify Energy Levels</h3>
      </li>`
  )
  for (let i = 0; i < responseJson.tracks.items.length; i++){
    trackIds.push(responseJson.tracks.items[i].id)
    console.log(trackIds)
    $('#results-list').append(
      `<li class="group" >
      <iframe class="item item-double" src= "${webURL}${responseJson.tracks.items[i].id}" width="100%" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
      <h3 id='${responseJson.tracks.items[i].id}' class="item energy"></h3>
      </li>`
    )
  };
  var energies = getEnergy(trackIds.join('%2C'), accToken)
  energies.then(NRG => {
    for (let i=0;i<NRG.length;i++) {
      //$('#' + NRG[i].id).text((Math.round(10*NRG[i].energy)))
      $('#' + NRG[i].id).text((energyRating(NRG[i].energy)))
    }
  })
};


function search(string, limit=10, typeOfMusic, accToken) {
  const params = {
    q: string,
    type: typeOfMusic,
    limit,
  };

  var heads = {
    'Authorization': 'Bearer ' + accToken,
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
        displayResults(data, accToken)
        console.log(data)
      })
      .catch((error) => {
          console.log("Error:", error);
      });
}




function watchForm() {
  var authTokenPromise = post()
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    const typeOf = "track"
    
    authTokenPromise.then(accToken => search(searchTerm, maxResults, typeOf, accToken));
    
    //getPlaylistTracks()
  });
}

$(watchForm);