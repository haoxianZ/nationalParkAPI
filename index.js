'use strict';

const apiKey = "gh5LtaMRnt6aKmPs1FMCJK3X8gwxhjjuTx3dUxMD"

const searchURL = 'https://developer.nps.gov/api/v1/places';
const addressURL = 'https://developer.nps.gov/api/v1/visitorcenters'

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson, maxResults) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('#results-list').empty();
  // iterate through the articles array, stopping at the max number of results
  for (let i = 0; i < responseJson.data.length & i<maxResults ; i++){
    // for each video object in the articles
    //array, add a list item to the results 
    //list with the article title, source, author,
    //description, and image
    $('#results-list').append(
      `<li id = "location${i}" ><h3><a href="${responseJson.data[i].url}">${responseJson.data[i].url}</a></h3>
      <h4>${responseJson.data[i].title}</h4>
      <h5>${responseJson.data[i].listingDescription}</h4>
      <p>${responseJson.data[i].bodyText}</p>
      </li>`
    )};
  //display the results section  
  $('#results').removeClass('hidden');
};
//address object to html display

function displayAddress (responseJson, maxResults){
     // if there are previous results, remove them
  console.log(responseJson,maxResults);
  const number = parseFloat(maxResults);
  // iterate through the articles array, stopping at the max number of results
  for (let i = 0; i < responseJson.data.length & i<number ; i++){
    //adding address

    $(`#location${i}`).append(
      `
      
      <h5>Address: ${responseJson.data[i].addresses[1].line1} ${responseJson.data[i].addresses[1].postalCode}</h5>
      
      `
    )};
    $('#results').removeClass('hidden');
};
function getNews(query, maxResults=10) {
  const params = {
    stateCode: query,
    limit: maxResults
  };
  const queryString = formatQueryParams(params);
  const url = searchURL + '?' + queryString+ '&api_key=' +apiKey;
  console.log(url);
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson, maxResults))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
};
function getAddress(query, maxResults=10) {
    const params = {
        stateCode: query,
        limit: maxResults
      };
      const queryString = formatQueryParams(params);
      const addURL = addressURL +'?' + queryString+ '&api_key=' +apiKey;
      console.log(addURL);

     fetch(addURL)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayAddress(responseJson, maxResults))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });  
 }
    
 

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getNews(searchTerm, maxResults).then(() => getAddress(searchTerm, maxResults));
    
  });
}

$(watchForm);