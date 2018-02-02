$(function(){
    //testing
    $("#search-query").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: "/searchweb",
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
            $(this).next("input").val(ui.item.value);
            // Prevent other event from not being execute
            event.preventDefault();
            // optionnal: submit the form after field has been filled up
            $('#search-query').keypress(function(e){
                if(e.which == '13') {
                    var datas = {
                        search : ui.item.label
                    };
                    $.ajax({
                        url: '/searchspecificweb',
                        type: 'POST',
                        data: JSON.stringify(datas),
                        contentType: 'application/json',
                        success: function (result) {
                            if (result.status == 'success') {
                                if(result.data.Brands != ""){
                                    window.location = '/ApniCare/information/Drug?brand='+result.data.Brands[0].brand_name;
                                }
                                if(result.data.Diseases != ""){
                                    window.location = '/ApniCare/information/Diseases?disease='+result.data.Diseases[0].disease_name;
                                }
                                if(result.data.Molecules != ""){
                                    window.location = '/ApniCare/information/Molecules?molecule='+result.data.Molecules[0].molecule_name;
                                }
                                if(result.data.Symptoms != ""){
                                    window.location = '/searchsymptons?symptoms=' + JSON.stringify(result.data.Symptoms);
                                }
                                if(result.data.Organs != ""){
                                    window.location = '/searchorgans?organs='+JSON.stringify(result.data.Organs);
                                }
                                if(result.data.Categories != ""){
                                    window.location = '/searchcategories?categories='+JSON.stringify(result.data.Categories);
                                }
                            }
                            else {
                                Materialize.toast(result.message, 1000);
                            }
                        }
                    })
                }
            });
        }
    });

});