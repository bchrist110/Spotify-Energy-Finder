'use strict'

// put your own value below!
const token = 'bnFiDu6xVmAQYHDd0cWSaAqHeEk2DRXUHSrvAAPS'; 
const searchURL = 'https://api.spotify.com/v1';



const Url = 'https://accounts.spotify.com/api/token'

function post() {
    const data = {grant_type: 'client_credentials'}
    fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            "Authorization" : "Basic <ZTYxNjAyZjFiOTI1NGI5NTlhZWZkNDc1OWEwZTQ3MTU6ZGExMjg5OTRhNDk1NGNjYjhjZGJmZjQ2YzNmMTgxOTM=>",
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.log('Error:', error);
    });
}

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function getParks(string, limit=10) {
  const params = {
    stateCode: string,
    limit,
    api_key: apiKey
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => console.log(JSON.stringify(responseJson)))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    post()
    //const searchTerm = $('#js-search-term').val();
    //const maxResults = $('#js-max-results').val();
    //getParks(searchTerm, maxResults);
  });
}

$(watchForm);