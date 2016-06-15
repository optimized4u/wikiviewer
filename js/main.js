$(document).ready(function() {
  // Autocomplete
  $("#search-box").autocomplete({
    source: function(request, response) {
      $.ajax({
        url: "https://en.wikipedia.org/w/api.php",
        dataType: "jsonp",
        data: {
          'action': "opensearch",
          'format': "json",
          'search': request.term
        },
        success: function(data) {
          response(data[1]);
        }
      });
    }
  });

  // Get search topic  
  $("#search-form").submit(function(event) {
    event.preventDefault();
    var searchTopic = $("input#search-box").val();
    console.log("Searching topic: " + searchTopic);
    $("#results").empty().addClass("well text-center");
    $("#results").html("<i class='fa fa-circle-o-notch fa-spin fa-3x fa-fw'></i><span class='sr-only'>Loading...</span>");
    getResults(searchTopic);
  });
  // Query Wikipedia
  function getResults(topic) {
    $.getJSON("https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&utf8=1&formatversion=2&srsearch=" + topic + "&srinfo=suggestion&srprop=snippet&callback=?", function(data, status, xhr) {
      console.log(JSON.stringify(data));
      var linkPrefix = "https://en.wikipedia.org/wiki/";
      var linkSuffix = "";
      $("#results").removeClass("text-center").empty();
      for (var i = 0; i < 10; i++) {
        //construct link to article
        linkSuffix = data.query.search[i].title.replace(/\s/g, "_");
        console.log(linkPrefix + linkSuffix);
        // construct list
        $("#results").append("<a href=" + linkPrefix + linkSuffix + " class='list-group-item' target='_blank'>");
        $("#results a:last").append("<h4 class='list-group-item-heading'>" + data.query.search[i].title + "</h4>");
        $("#results a:last").append("<p class='list-group-item-text'>" + data.query.search[i].snippet + "</p>");
        $("#results").append("</a>");
      }
    });
  }
});