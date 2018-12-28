// Grab the articles as a json
$.getJSON("/articles", function(data) {


    for (var i = 0; i < data.length; i++) {
      // Pull data from database
      $("#articles").append("<p class='titlefont' >" + data[i].title + "</p> <p>" + data[i].link + "</p>" + "<img src=" + data[i].picture +" height='100px' width='120px'>" + "<p class='summary'>" + data[i].summary + "<br> <button data-id='" + data[i]._id + "' type='button' class='btn btn-success' id='createNote'> Note </button>");
    }

 
  });
  
  
$(document).on("click", "#createNote", function() {
  // Empty the notes from the note section
  $("#notes").empty();

  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
 

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })


// .then will add the note to the page
    .then(function(data) {

        console.log(data);
      $("#notes").append("<h2 class='titlefont'>" + data.title + "</h2> <input class='titlefont' id='notetitle' name='title'> <textarea id='notebody' name='body'> </textarea> <button data-id='" + data._id + "' id='notesaved' type='button' class='btn btn-success'> Save Note </button>");


      // Bring existing notes
      if (data.note) {
        $("#notetitle").val(data.note.title);
        $("#notebody").val(data.note.body);

      }

    });

});

 

// saving note that was just created

$(document).on("click", "#notesaved", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Replacing already existing notes with what was just entered
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#notetitle").val(),
      body: $("#notebody").val()

    }

  })

    .then(function(data) {

        console.log("JAHAHAHAHAH", data)
      console.log(data);
     // Empty the notes section
      $("#notes").empty();

    });

 

  // Also, remove the values entered in the input and textarea for note entry
  $("#notetitle").val("");
  $("#notebody").val("");

});

 