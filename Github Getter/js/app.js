$(document).ready(function() {

  function searchInventory(search, data) {
    var repoSearch = {};
    var localStore = localStorage.getItem(search);

    if(data.length !== 0){
      repoSearch[search] = data;
      localStorage.setItem(search, JSON.stringify(data));
      toastr.success('Found ' + data.length + ' repos!');
    } else {
      toastr.error('Nothing found');
    }

    console.log(repoSearch,'this is repo search');
    return repoSearch;
  }

  function displayToDom(data) {
    if($('#overlay-container').children().length > 0){
      $('#overlay-container').html('');
    }

    data.forEach(function(elem) {
      $("<div class='results'>" + elem.owner + " " + elem.name + "</div>").appendTo("#overlay-container")
    })

  }

  function findRepo(event) {
    event.preventDefault();
    var query = $('#search').val();
    console.log(query);
    var checkStore = localStorage.getItem(query);

    if(checkStore) {
      toastr.success('Retrieving from local store. ' + checkStore.length + ' repos found!');
      displayToDom(JSON.parse(checkStore));
    } else {
      $.ajax({
        url: 'https://api.github.com/legacy/repos/search/' + query
      })
      .done(function(data) {
        searchInventory(query, data.repositories);
        displayToDom(data.repositories);
      })
      .fail(function(data) {
        console.err(data);
      });
    }

    $('#search').val('');
  }

  $('#find').on('click', findRepo);

});