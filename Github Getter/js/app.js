$(document).ready(function() {
  function displayRecent() {
    var localStore = JSON.parse(localStorage.getItem('cache')) || {};

    if($('#history').children().length > 0){
      $('#history').html('');
    }

    if(localStore) {
      for(var key in localStore){
        $("<div class='recent-result'>" + key + "</div>").appendTo("#history")
      }
    }

    $('.recent-result').on('click', function() {
      var clickedValue = $(this).html();

      displayRepo(localStore[clickedValue]);
    })
  }

  function cacheSearch(search, data) {
    var localStore = JSON.parse(localStorage.getItem('cache')) || {};

    if(data.repositories.length !== 0){
      localStore[search] = data;
      localStorage.setItem('cache', JSON.stringify(localStore));
      displayRecent();
      toastr.success('Found ' + data.repositories.length + ' repos!');
    } else {
      toastr.error('Nothing found');
    }

  }

  function displayRepo(data) {
    if($('#overlay-container').children().length > 0){
      $('#overlay-container').html('');
    }

    data.repositories.forEach(function(elem) {
      var owner = elem.owner;
      var name = elem.name;
      var language = elem.language;
      var followers = elem.followers;
      var url = elem.url;
      var description = elem.description;

      if(language === '') {
        language = 'no language';
      }

      if(description === '') {
        description = 'no description';
      }

      $("<div class='repo-result'>" + owner + "  -  " + name + "<div class='repo-info'>" + language + " - " + followers + " - " + url + "<div class='repo-description'>" + description + "</div></div></div>").appendTo("#overlay-container");
    })

  }

  function findRepo(event) {
    event.preventDefault();
    var query = $('#search').val();
    var checkStore = JSON.parse(localStorage.getItem('cache'));

    if(checkStore && checkStore[query]) {
      toastr.success('Retrieving from local store.');
      displayRepo(checkStore[query]);
    } else {
      $.ajax({
        url: 'https://api.github.com/legacy/repos/search/' + query
      })
      .done(function(data) {
        cacheSearch(query, data);
        displayRepo(data);
        displayRecent();
      })
      .fail(function(data) {
        console.err(data);
      });
    }

    $('#search').val('');
  }

  $('#find').on('click', findRepo);
  displayRecent();
});