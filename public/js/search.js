$(function(){
    //testing
    $('#search-query').click(function () {
        $('#search-query').css('background-color','white');
    });
    $("#search-query").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: "/users/searchweb",
                type: "POST",
                data: request,  // request is the value of search input
                success: function (data) {
                    // Map response values to field label and value
                    if (data.Brands != "") {
                        response($.map(data.Brands, function (el) {
                            return {
                                label: el.brand_name
                            };
                        }));
                    }
                    if (data.Symptoms != "") {
                        response($.map(data.Symptoms, function (el) {
                            return {
                                label: el.symptoms
                            };
                        }));
                    }
                    if (data.Molecules != "") {
                        response($.map(data.Molecules, function (el) {
                            return {
                                label: el.molecule_name
                            };
                        }));
                    }
                    if (data.Categories != "") {
                        response($.map(data.Categories, function (el) {
                            return {
                                label: el.categories
                            };
                        }));
                    }
                    if (data.Organs != "") {
                        response($.map(data.Organs, function (el) {
                            return {
                                label: el.name
                            };
                        }));
                    }
                    if (data.Diseases != "") {
                        response($.map(data.Diseases, function (el) {
                            return {
                                label: el.disease_name
                            };
                        }));
                    }
                }
            });
        },
        // The minimum number of characters a user must type before a search is performed.
        minLength: 1,
        // set an onFocus event to show the result on input field when result is focused
        focus: function (event, ui) {
            this.value = ui.item.label;

            // Prevent other event from not being execute
            event.preventDefault();
        },
        select: function (event, ui) {
            // Prevent value from being put in the input:
            this.value = ui.item.label;
            // Set the id to the next input hidden field
            if(ui.item){
            $(this).next("input").val(ui.item.value);
            // Prevent other event from not being execute
            event.preventDefault();
            // optionnal: submit the form after field has been filled up
            $('#search-query').submit();
            }

        }
    });
    $('#search-query').bind('autocompleteselect',function(event,ui){
        var datas = {
            search : ui.item.label
        };
        $.ajax({
            url: '/users/searchspecificweb',
            type: 'POST',
            data: JSON.stringify(datas),
            contentType: 'application/json',
            success: function (result) {
                if (result.status == 'success') {
                    if(result.data.Brands != ""){
                        window.location = '/users/ApniCare/information/Drug?brand='+result.data.Brands[0].brand_name;
                    }
                    if(result.data.Diseases != ""){
                        window.location = '/users/ApniCare/information/Diseases?disease='+result.data.Diseases[0].disease_name;
                    }
                    if(result.data.Molecules != ""){
                        window.location = '/users/ApniCare/information/Molecules?molecule='+result.data.Molecules[0].molecule_name;
                    }
                    if(result.data.Symptoms != ""){
                        window.location = '/users/searchsymptons?symptoms=' + JSON.stringify(result.data.Symptoms);
                    }
                    if(result.data.Organs != ""){
                        window.location = '/users/searchorgans?organs='+JSON.stringify(result.data.Organs);
                    }
                    if(result.data.Categories != ""){
                        window.location = '/users/searchcategories?categories='+JSON.stringify(result.data.Categories);
                    }
                }
                else {
                    Materialize.toast(result.message, 1000);
                }
            }
        })
    });

    // $('#search-query').keypress(function(e) {
    //     if(e.which == '13') {
    //         $('#search-query').click();
    //     }
    // });
    // $('#search-query').focusout(function() {
    //         $('#search-query').click();
    // });
    $('#search-query').keypress(function(e) {
        if(e.which == '13') {
            var data = $('input').val();
            var datas = {
                search: data
            };
            $.ajax({
                url: '/users/searchspecificweb',
                type: 'POST',
                data: JSON.stringify(datas),
                contentType: 'application/json',
                success: function (result) {
                    if (result.status == 'success') {
                        if (result.data.Brands != "") {
                            window.location = '/users/ApniCare/information/Drug?brand=' + result.data.Brands[0].brand_name;
                        }
                        if (result.data.Diseases != "") {
                            window.location = '/users/ApniCare/information/Diseases?disease=' + result.data.Diseases[0].disease_name;
                        }
                        if (result.data.Molecules != "") {
                            window.location = '/users/ApniCare/information/Molecules?molecule=' + result.data.Molecules[0].molecule_name;
                        }
                        if (result.data.Symptoms != "") {
                            window.location = '/users/searchsymptons?symptoms=' + JSON.stringify(result.data.Symptoms);
                        }
                        if (result.data.Organs != "") {
                            window.location = '/users/searchorgans?organs=' + JSON.stringify(result.data.Organs);
                        }
                        if (result.data.Categories != "") {
                            window.location = '/users/searchcategories?categories=' + JSON.stringify(result.data.Categories);
                        }
                    }
                    else {
                        Materialize.toast(result.message, 1000);
                    }
                }
            })
        }
    });

    //testing
    // var availableTags = ["ActionScript", "AppleScript", "Asp",
    //     "BASIC", "C", "C++", "Clojure", "COBOL", "ColdFusion", "Erlang",
    //     "Fortran", "Groovy", "Haskell", "Java", "JavaScript", "Lisp",
    //     "Perl", "PHP", "Python", "Ruby", "Scala", "Scheme"
    // ];
    // $("#tags").autocomplete({
    //     source: availableTags
    // });
    //
    //
    //    $("#search").autocomplete({
    //         source: function (request, response) {
    //             $.ajax({
    //                 url: "/search_member",
    //                 type: "GET",
    //                 data: request,  // request is the value of search input
    //                 success: function (data) {
    //                     // Map response values to fiedl label and value
    //                     response($.map(data, function (el) {
    //                         return {
    //                             label: el.fullname,
    //                             value: el._id
    //                         };
    //                     }));
    //                 }
    //             });
    //         },
    //
    //         // The minimum number of characters a user must type before a search is performed.
    //         minLength: 3,
    //
    //         // set an onFocus event to show the result on input field when result is focused
    //         focus: function (event, ui) {
    //             this.value = ui.item.label;
    //             // Prevent other event from not being execute
    //             event.preventDefault();
    //         },
    //         select: function (event, ui) {
    //             // Prevent value from being put in the input:
    //             this.value = ui.item.label;
    //             // Set the id to the next input hidden field
    //             $(this).next("input").val(ui.item.value);
    //             // Prevent other event from not being execute
    //             event.preventDefault();
    //             // optionnal: submit the form after field has been filled up
    //             //$('#quicksearch').submit();
    //         }
    //     });


});