$(function () {

    $('#letsScrape').on("click", function(event) {
    
    event.preventDefault();

    $('.newArticleBody').empty();

    $.ajax("/api/all", {

        type: "GET"

    }).then(function (response) {

        let oldLength = response;

        console.log(oldLength);

        $.ajax("/api/scrape", {

            type: "POST"

        }).then(function (response) {

            $.ajax("/api/reduce", {

                type: "DELETE"

            }).then(function (response) {

                var newText = $("<div>");

                var newLength = response.length;

                console.log(newLength);

                var numberChanged = parseInt(newLength) - parseInt(oldLength);

                if (numberChanged == 0) {

                    newText.text("Scraper is up to date")

                    $('.newArticleBody').append(newText)

                    $('#newArticle').modal('show');

                }

                else {

                    newText.text(numberChanged + " new articles scraped!")

                    $('.newArticleBody').append(newText)

                    $('#newArticle').modal('show');

                }

            })

        })

    })

});

$("#scarpeDone").on("click", function (event) {

    event.preventDefault();

    $.ajax("/", {

        type: "GET"

    }).then(function () {

        location.reload();

    })

});

$('.saveArticle').on("click", function (event) {

    event.preventDefault();

    $('.savedBody').empty();

    let articleId = $(this).data("id");

    $.ajax("/api/save/article/" + articleId, {

        type: "PUT"

    }).then(function () {

        $('#savedModal').modal('show');

    })

});

$('#modalClose').on('click', function (event) {

    event.preventDefault();

    $.ajax("/", {

        type: "GET"

    }).then(function () {

        location.reload();

    })

});
    
    })