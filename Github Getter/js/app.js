/*
    # Endpoint URL #

    https://api.github.com/legacy/repos/search/{query}

    Note: Github imposes a rate limit of 60 request per minute. Documentation can be found at http://developer.github.com/v3/.

    # Example Response JSON #

    {
      "meta": {...},
      "data": {
        "repositories": [
          {
            "type": string,
            "watchers": number,
            "followers": number,
            "username": string,
            "owner": string,
            "created": string,
            "created_at": string,
            "pushed_at": string,
            "description": string,
            "forks": number,
            "pushed": string,
            "fork": boolean,
            "size": number,
            "name": string,
            "private": boolean,
            "language": number
          },
          {...},
          {...}
        ]
      }
    }
*/

$(document).ready(function() {

  function searchInventory(search, data) {
    var repoSearch = {};
    var localStore = localStorage.getItem('repoSearch');

    if (localStore) {
      if (localStore[search]) {
        repoSearch = JSON.parse(localStore[search]);
      }
    } else {
      repoSearch[search] = data;
      localStorage.setItem(search, JSON.stringify(data));
    }
    console.log(repoSearch,'this is repo search');
    return repoSearch;
  }

  function displayToDom(data) {
    data.forEach(function(elem) {
      $("<div>" + elem.owner + " " + elem.name + "</div>").appendTo("#overlay-container")
    })

  }

  function findRepo() {
    var query = $('#search').val();
    var checkStore = localStorage.getItem(query);

    if(checkStore) {
      displayToDom(JSON.parse(checkStore));
    } else {
      $.ajax({
        url: 'https://api.github.com/legacy/repos/search/' + query
      })
      .done(function(data) {
        searchInventory(query, data.repositories);
        displayToDom(query, data.repositories);
      })
      .fail(function(data) {
        console.err(data);
      });
    }

    $('#search').val('');
  }

  $('#find').on('click', findRepo);


});