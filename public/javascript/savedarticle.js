$(function () {

    $('.deleteArticle').on("click", function (event) {
        event.preventDefault();
        $('.deleteBody').empty();
        var articleId = $(this).data("id");

        $.ajax("/api/delete/article/" + articleId, {
            type: "PUT"

        }).then(function () {
            $('#deleteModal').modal('show');
        })
    });

    $('.deleteModButton').on('click', function (event) {
        event.preventDefault();
        $.ajax("/saved", {
            type: "GET"

        }).then(function () {
            location.reload();

        })

    });

    $('.addNotes').on("click", function (event) {

        event.preventDefault();
        var articleId = $(this).data("id");
        $('.noteBody').empty();
        $('.noteAlert').remove();
        $.ajax("/api/notes/" + articleId, {
            type: "GET"

        }).then(function (result) {
            $('.noteBody').append("<h2>" + result.title + "</h2> <ul id='allNotes'>");
            var newForm = $('<form>');
            var newFTitle = $('<div class="form-group"> <label for="newNoteTitle"> Title: </label>')
            newFTitle.append("<input id='newNoteTitle' name='title' > </div>");
            var newFText = $('<div class="form-group"> <label for="newNoteBody"> Notes: </label>');
            newFText.append("<textarea id='newNoteBody' name='body'> </textarea> </div>");

            // let newButton = $("<button data-id='" + result._id + "' class='saveNoteButton'>Save Note</button>");

            $('.saveNote').attr("data-id", result._id)

            newForm.append(newFTitle);
            newForm.append(newFText);

            // newForm.append(newButton);

            //HERE

            $('.noteBody').append(newForm)

            for (let i = 0; i < result.note.length; i++) {

                var newlyCreated = $('<div class=card>');
                newlyCreated.addClass("newNoteCard")
                let newCardHeader = $('<div class=card-header>' + result.note[i].title + '</div>');
                let newCardBody = $('<div class=card-body>');
                newCardBody.addClass("noteCardBody")
                newCardBody.text(result.note[i].body)
                newlyCreated .append(newCardHeader);
                newlyCreated .append(newCardBody);
                newlyCreated .append("<button class=deleteNoteButton data-id=" + i + ">Delete</button>");

                $('.noteTitle').append(newlyCreated);

            }

        }).then(

            $('#newNote').modal('show')

        )

    });

    $('.saveNote').on("click", function (event) {

        let articleId = $(this).attr("data-id");
        $.ajax("/api/create/notes/" + articleId, {
            type: "POST",
            data: {

                title: $("#newNoteTitle").val(),
                body: $("#newNoteBody").val()
            }

        }).then(function (result) {

            console.log(result);
            let noteAdded = $('<p>');
            noteAdded.addClass('noteAlert');

            noteAdded.text("Note successfully added")

            $('.alertDiv').append(noteAdded);
            $("#newNoteTitle").val("");
            $("#newNoteBody").val("");

        })

    });

    $('.deleteNoteButton').on("click", function (event) {

        event.preventDefault();
        console.log("clicked");

    });

});