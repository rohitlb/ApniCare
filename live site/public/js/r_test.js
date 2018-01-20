$(function () {

    $('.modal').modal({
        dismissible:true,
        opacity: 0.2,
        inDuration: 300,
        outDuration:200,
        startingTop:'4%',
        endingTop: '11%'
    });

    $('#text1').val();
    $('#text1').trigger('autoresize');

    $(':reset');

    // $( "#progressbar" ).progressbar(function(){
    //     value: 35
    // });
    //............................./////////// Bullets in text area /////////////////////////////
    // $(".text_areas1").focus(function() {
    //     if(document.getElementById('symptoms').value === ''){
    //         document.getElementById('symptoms').value +='• '+'\n';
    //     }
    // });
    // $(".text_areas1").keyup(function(event){
    //     var keycode = (event.keyCode ? event.keyCode : event.which);
    //     if(keycode == '13'){
    //         document.getElementById('symptoms').value +='• ';
    //     }
    //     var txtval = document.getElementById('symptoms').value;
    //     if(txtval.substr(txtval.length - 1) == '\n'){
    //         document.getElementById('symptoms').value = txtval.substring(0,txtval.length - 1);
    //     }
    // });
    //
    // $(".text_areas2").focus(function() {
    //     if(document.getElementById('risk_factors').value === ''){
    //         document.getElementById('risk_factors').value +='• '+'\n';
    //     }
    // });
    // $(".text_areas2").keyup(function(event){
    //     var keycode = (event.keyCode ? event.keyCode : event.which);
    //     if(keycode == '13'){
    //         document.getElementById('risk_factors').value +='• ';
    //     }
    //     var txtval = document.getElementById('risk_factors').value;
    //     if(txtval.substr(txtval.length - 1) == '\n'){
    //         document.getElementById('risk_factors').value = txtval.substring(0,txtval.length - 1);
    //     }
    // });
    //
    // $(".text_areas3").focus(function() {
    //     if(document.getElementById('causes').value === ''){
    //         document.getElementById('causes').value +='• '+'\n';
    //     }
    // });
    // $(".text_areas3").keyup(function(event){
    //     var keycode = (event.keyCode ? event.keyCode : event.which);
    //     if(keycode == '13'){
    //         document.getElementById('causes').value +='• ';
    //     }
    //     var txtval = document.getElementById('causes').value;
    //     if(txtval.substr(txtval.length - 1) == '\n'){
    //         document.getElementById('causes').value = txtval.substring(0,txtval.length - 1);
    //     }
    // });
    //
    // $(".text_areas4").focus(function() {
    //     if(document.getElementById('subhead_text').value === ''){
    //         document.getElementById('subhead_text').value +='• '+'\n';
    //     }
    // });
    // $(".text_areas4").keyup(function(event){
    //     var keycode = (event.keyCode ? event.keyCode : event.which);
    //     if(keycode == '13'){
    //         document.getElementById('subhead_text').value +='• ';
    //     }
    //     var txtval = document.getElementById('subhead_text').value;
    //     if(txtval.substr(txtval.length - 1) == '\n'){
    //         document.getElementById('subhead_text').value = txtval.substring(0,txtval.length - 1);
    //     }
    // });
    //
    // $(".text_areas5").focus(function() {
    //     if(document.getElementById('treatment').value === ''){
    //         document.getElementById('treatment').value +='• '+'\n';
    //     }
    // });
    // $(".text_areas5").keyup(function(event){
    //     var keycode = (event.keyCode ? event.keyCode : event.which);
    //     if(keycode == '13'){
    //         document.getElementById('treatment').value +='• ';
    //     }
    //     var txtval = document.getElementById('treatment').value;
    //     if(txtval.substr(txtval.length - 1) == '\n'){
    //         document.getElementById('treatment').value = txtval.substring(0,txtval.length - 1);
    //     }
    // });
    //
    // $(".text_areas6").focus(function() {
    //     if(document.getElementById('outlook').value === ''){
    //         document.getElementById('outlook').value +='• '+'\n';
    //     }
    // });
    // $(".text_areas6").keyup(function(event){
    //     var keycode = (event.keyCode ? event.keyCode : event.which);
    //     if(keycode == '13'){
    //         document.getElementById('outlook').value +='• ';
    //     }
    //     var txtval = document.getElementById('outlook').value;
    //     if(txtval.substr(txtval.length - 1) == '\n'){
    //         document.getElementById('outlook').value = txtval.substring(0,txtval.length - 1);
    //     }
    // });
    //
    // $(".text_areas7").focus(function() {
    //     if(document.getElementById('prevention').value === ''){
    //         document.getElementById('prevention').value +='• '+'\n';
    //     }
    // });
    // $(".text_areas7").keyup(function(event){
    //     var keycode = (event.keyCode ? event.keyCode : event.which);
    //     if(keycode == '13'){
    //         document.getElementById('prevention').value +='• ';
    //     }
    //     var txtval = document.getElementById('prevention').value;
    //     if(txtval.substr(txtval.length - 1) == '\n'){
    //         document.getElementById('prevention').value = txtval.substring(0,txtval.length - 1);
    //     }
    // });
    //
    // $(".text_areas8").focus(function() {
    //     if(document.getElementById('source').value === ''){
    //         document.getElementById('source').value +='• '+'\n';
    //     }
    // });
    // $(".text_areas8").keyup(function(event){
    //     var keycode = (event.keyCode ? event.keyCode : event.which);
    //     if(keycode == '13'){
    //         document.getElementById('source').value +='• ';
    //     }
    //     var txtval = document.getElementById('source').value;
    //     if(txtval.substr(txtval.length - 1) == '\n'){
    //         document.getElementById('source').value = txtval.substring(0,txtval.length - 1);
    //     }
    // });
    //
    // $(".text_areas9").focus(function() {
    //     if(document.getElementById('causes').value === ''){
    //         document.getElementById('causes').value +='• '+'\n';
    //     }
    // });
    // $(".text_areas9").keyup(function(event){
    //     var keycode = (event.keyCode ? event.keyCode : event.which);
    //     if(keycode == '13'){
    //         document.getElementById('causes').value +='• ';
    //     }
    //     var txtval = document.getElementById('causes').value;
    //     if(txtval.substr(txtval.length - 1) == '\n'){
    //         document.getElementById('causes').value = txtval.substring(0,txtval.length - 1);
    //     }
    // });
    //
    // $(".text_areas10").focus(function() {
    //     if(document.getElementById('causes').value === ''){
    //         document.getElementById('causes').value +='• '+'\n';
    //     }
    // });
    // $(".text_areas10").keyup(function(event){
    //     var keycode = (event.keyCode ? event.keyCode : event.which);
    //     if(keycode == '13'){
    //         document.getElementById('causes').value +='• ';
    //     }
    //     var txtval = document.getElementById('causes').value;
    //     if(txtval.substr(txtval.length - 1) == '\n'){
    //         document.getElementById('causes').value = txtval.substring(0,txtval.length - 1);
    //     }
    // });
    //
    // $(".text_areas11").focus(function() {
    //     if(document.getElementById('causes').value === ''){
    //         document.getElementById('causes').value +='• '+'\n';
    //     }
    // });
    // $(".text_areas11").keyup(function(event){
    //     var keycode = (event.keyCode ? event.keyCode : event.which);
    //     if(keycode == '13'){
    //         document.getElementById('causes').value +='• ';
    //     }
    //     var txtval = document.getElementById('causes').value;
    //     if(txtval.substr(txtval.length - 1) == '\n'){
    //         document.getElementById('causes').value = txtval.substring(0,txtval.length - 1);
    //     }
    // });
    //
    // $(".text_areas12").focus(function() {
    //     if(document.getElementById('causes').value === ''){
    //         document.getElementById('causes').value +='• '+'\n';
    //     }
    // });
    // $(".text_areas12").keyup(function(event){
    //     var keycode = (event.keyCode ? event.keyCode : event.which);
    //     if(keycode == '13'){
    //         document.getElementById('causes').value +='• ';
    //     }
    //     var txtval = document.getElementById('causes').value;
    //     if(txtval.substr(txtval.length - 1) == '\n'){
    //         document.getElementById('causes').value = txtval.substring(0,txtval.length - 1);
    //     }
    // });
    //
    // $(".text_areas13").focus(function() {
    //     if(document.getElementById('causes').value === ''){
    //         document.getElementById('causes').value +='• '+'\n';
    //     }
    // });
    // $(".text_areas13").keyup(function(event){
    //     var keycode = (event.keyCode ? event.keyCode : event.which);
    //     if(keycode == '13'){
    //         document.getElementById('causes').value +='• ';
    //     }
    //     var txtval = document.getElementById('causes').value;
    //     if(txtval.substr(txtval.length - 1) == '\n'){
    //         document.getElementById('causes').value = txtval.substring(0,txtval.length - 1);
    //     }
    // });

    $( "#progressbar" ).progressbar({
        disabled: true,
        value: 35,
        max: 98,
        min: 20,
        classes: {
            "ui-progressbar": "highlight"
        }
    });

    //- .......... PROFILE OF DOCTOR AND PHARMACIST IF STUDENT ....................
    // $('.card-s').select(function () {
    //     // $('#tab1').active();
    //     // $('#city').hide();
    //     // $('#year_of_experience').hide();
    //     // $('#about_you').hide();
    //     // $('#qualification').hide();
    //     // $('#tab3').hide();
    //     // $('#register_doc').hide();
    // });

    //$('#profile2').hide();
    //$('#profile3').hide();
    $('#doctor_card').click(function () {
        $('#profile1').hide();
        $('#profile2').show();
    });
    $('#pharmacist_card').click(function () {
        $('#profile1').hide();
        $('#profile3').show();
    });
    // $('#pharmacist_card').click(function () {
    //     $('#profile1').hide();
    //     $('#profile3').show();
    // });



    //- ..................... ALPHABETICAL DISPLAY OF DRUG AND DISEASE AND MOLECULE DATA..............

    $(".drug_alphabets a").on("click", function() {
        var type = $(this).attr("type");
        if (type) {
            if (type == 'all') {
                $(".brands h5").show();//show all

            } else if (type == 'other') {
                $(".brands h5").hide();//hide all
                $(".brands h5").each(function() {
                    var brandName = $(this).attr("name");
                    if (!brandName.toLowerCase()[0].match(/[a-z]/i))//if name not starts with letter
                        $(this).show();
                });
            }
            return;
        }
        var clickedLetter = $(this).text();
        $(".brands h5").each(function () {
            var brandName = $(this).attr("name");
            if (brandName.toLowerCase()[0] == clickedLetter.toLowerCase()) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });

    // $('#drug_dataa').click(function () {
    //    $('#drug_list').hide();
    // });
    // $( "li", "#test" ).sort(function( a, b ) {
    //     return $( a ).text() > $( b ).text();
    // }).appendTo( "#test" );
    // // TO ADD NEW TEXT FIELD IN MOLECULE DATA FORM
    // $('#new_text').hide();
    // $('#diagnosis_sub').hide();
    // $('#new_info').hide();
    // $('#close').hide();
    // $('#list_input').hide();
    // $('#add_button').click(function () {
    //     $('#new_text').show();
    //     $('#diagnosis_sub').show();
    //     $('#new_info').show();
    //     $('#close').show();
    //     $('#list_input').show();
    //     $('#close').click(function () {
    //         $('#new_text').hide();
    //         $('#new_info').hide();
    //         $('#list_input').hide();
    //         $('#close').hide();
    //     });
    // });
    // TO CLOSE THE ABOVE OPENED TEXT FIELD IN MOLECULE DATA FORM
    // $('#cl').click(function () {
    //     $('#new_field').hide();
    // });

    $('.dropdown-button').dropdown({
        inDuration: 300,
        outDuration: 225,
        constrainWidth: false, // Does not change width of dropdown to that of the activator
        hover: true, // Activate on hover
        gutter: 0, // Spacing from edge
        belowOrigin: true, // Displays dropdown below the button
        alignment: 'right', // Displays dropdown with edge aligned to the left of button
        stopPropagation: false // Stops event propagation
    });

    // PROFILE NAV-BAR TOOLTIPS: PROFILE AND NOTIFICATIONS
    $('.tooltipped').tooltip({
        delay: 50,
        fontSize: '0.5rem'
    });

    //- .................FOR DISEASE DATA FORM HIDING TEXT AREAS....................

    // $('#subhead2').hide();
    // $('#subhead_text').hide();
    // $('#add_button').click(function ()  {
    //     $('#subhead2').show();
    //     $('#subhead_text').show();
    // });

    // $(".repeat").click(function (e) {
    //     e.preventDefault();
    //     var $self = $(this);
    //     $self.before($self.prev('.repeated').clone());
    //     //$self.remove();
    // });

    //............................... For Diagnosis in Disease form...............//
    $('.repeat1').on('click', function() {
        $('.repeater1').append('<div><input id="subhead1" type="text"  placeholder="Enter a subheading" class="browser-default repeat_subhead1" required/><button class="remove">x</button>' +
            '<textarea class="text_subhead1 materialize-textarea tobig" id="subhead_text1" required></textarea><label for="subhead1" style="color:black;font-size: 15px;font-weight: 400;">' +
            '</label><label for="subhead_text1",placeholder="Enter text", style="color:black;font-size: 15px;font-weight: 400;"></label></div></div>');
        return false; //prevent form submission
    });
    $('.repeater1').on('click', '.remove', function() {
        $(this).parent().remove();
        return false; //prevent form submission
    });

    //............................... For contraindications in molecule form ............//
    $('.repeat2').on('click', function() {
        $('.repeater2').append('<div><input id="subhead2" type="text" list="contra" placeholder="Choose subheading" class="browser-default repeat_subhead2" required/><button class="remove">x</button>' +
            '<textarea class="text_subhead2 materialize-textarea" placeholder="Enter Text" id="subhead_text2" required></textarea><label for="subhead2" style="color:black;font-size: 15px;font-weight: 400;"></label>' +
            '<label for="subhead_text2" style="color:black;font-size: 15px;font-weight: 400;">' +
            '<datalist id="contra"> <option> In Lactation</option> <option>In Geriatric/Old Person</option><option>Other Contraindications</option>' +
            ' <option> In Pregnancy </option>Lab Interference <option></option> <option> In Children </option><option>Storage</option>' +
            '</label></div></div>');
        return false; //prevent form submission
    });
    $('.repeater2').on('click', '.remove', function() {
        $(this).parent().remove();
        return false; //prevent form submission
    });

    //............................... For Dosage in Molecule Form...............//
    $('.repeat3').on('click', function() {
        $('.repeater3').append('<div><input id="subhead3" type="text" list="dosage" placeholder="Choose subheading" class="browser-default repeat_subhead3" required/><button class="remove">x</button>' +
            '<textarea class="text_subhead3 materialize-textarea" placeholder="Enter Text" id="subhead_text3" required></textarea><label for="subhead3" style="color:black;font-size: 15px;font-weight: 400;"></label>' +
            '<label for="subhead_text3" style="color:black;font-size: 15px;font-weight: 400;">' +
            '<datalist id="dosage"> <option> Oral</option> <option>Intravenous</option><option>Liver Disorder</option>' +
            ' <option> Hepatic </option> <option>COPD</option>' +
            '</label></div></div>');
        return false; //prevent form submission
    });
    $('.repeater3').on('click', '.remove', function() {
        $(this).parent().remove();
        return false; //prevent form submission
    });

    //............................... For Other Interactions in Molecule Form .........//
    $('.repeat4').on('click', function() {
        $('.repeater4').append('<div><input id="subhead4" type="text" placeholder="Enter subheading" class="browser-default repeat_subhead4" required/><button class="remove">x</button>' +
            '<textarea class="text_subhead4 materialize-textarea" placeholder="Enter Text" id="subhead_text4" required></textarea><label for="subhead4" style="color:black;font-size: 15px;font-weight: 400;"></label>' +
            '<label for="subhead_text4" style="color:black;font-size: 15px;font-weight: 400;">' +
            '</label></div></div>');
        return false; //prevent form submission
    });
    $('.repeater4').on('click', '.remove', function() {
        $(this).parent().remove();
        return false; //prevent form submission
    });

    //............................... For Other Drug Interactions In Molecule Form ...........//
    $('.repeat5').on('click', function() {
        $('.repeater5').append('<div><input id="subhead5" type="text" placeholder="Enter subheading" class="browser-default repeat_subhead5" required/><button class="remove">x</button>' +
            '<textarea class="text_subhead5 materialize-textarea" placeholder="Enter Text" id="subhead_text5" required></textarea><label for="subhead5" style="color:black;font-size: 15px;font-weight: 400;"></label>' +
            '<label for="subhead_text5" style="color:black;font-size: 15px;font-weight: 400;">' +
            '</label></div></div>');
        return false; //prevent form submission
    });
    $('.repeater5').on('click', '.remove', function() {
        $(this).parent().remove();
        return false; //prevent form submission
    });

    //............................... For
    // $('.repeat1').on('click', function() {
    //     $('.repeater').append('<div><input id="subhead2" type="text" list="contra" placeholder="Choose subheading" class="browser-default repeat_subhead" required/><button class="remove">x</button>' +
    //         '<textarea class="text_subhead" id="subhead_text" required></textarea><label for="subhead2" style="color:black;font-size: 15px;font-weight: 400;"></label>' +
    //         '<label for="subhead2" style="color:black;font-size: 15px;font-weight: 400;">' +
    //         '<datalist id="contra"> <option> In Lactation</option> <option>In Geriatric/Old Person</option><option>Other Contraindications</option>' +
    //         ' <option> In Pregnancy </option>Lab Interference <option></option> <option> In Children </option><option>Storage</option>' +
    //         '</label></div></div>');
    //     return false; //prevent form submission
    // });
    //
    // $('.repeat1').on('click', function() {
    //     $('.repeater').append('<div><input id="subhead2" type="text" list="contra" placeholder="Choose subheading" class="browser-default repeat_subhead" required/><button class="remove">x</button>' +
    //         '<textarea class="text_subhead" id="subhead_text" required></textarea><label for="subhead2" style="color:black;font-size: 15px;font-weight: 400;"></label>' +
    //         '<label for="subhead2" style="color:black;font-size: 15px;font-weight: 400;">' +
    //         '<datalist id="contra"> <option> In Lactation</option> <option>In Geriatric/Old Person</option><option>Other Contraindications</option>' +
    //         ' <option> In Pregnancy </option>Lab Interference <option></option> <option> In Children </option><option>Storage</option>' +
    //         '</label></div></div>');
    //     return false; //prevent form submission
    // });
    //
    // $('.repeat1').on('click', function() {
    //     $('.repeater').append('<div><input id="subhead2" type="text" list="contra" placeholder="Choose subheading" class="browser-default repeat_subhead" required/><button class="remove">x</button>' +
    //         '<textarea class="text_subhead" id="subhead_text" required></textarea><label for="subhead2" style="color:black;font-size: 15px;font-weight: 400;"></label>' +
    //         '<label for="subhead2" style="color:black;font-size: 15px;font-weight: 400;">' +
    //         '<datalist id="contra"> <option> In Lactation</option> <option>In Geriatric/Old Person</option><option>Other Contraindications</option>' +
    //         ' <option> In Pregnancy </option>Lab Interference <option></option> <option> In Children </option><option>Storage</option>' +
    //         '</label></div></div>');
    //     return false; //prevent form submission
    // });

    //............................... For Potent Substances in Drug Data Form.............//
    $('.repeat6').on('click', function() {
        $('.repeater6').append('<div><button class="right remove">x</button><div class="collection" style="border-color:transparent;"><div class="col s12 m6 l6">' +
            '<input id="subheading6" type="text" placeholder="Enter Name" required="required" class="repeat_subhead6"/></div>' +
            '<div class="col s12 m6 l6"> <input id="subhead_text6" type="text" placeholder="Enter Molecule Strength" required="required" class="text_subhead6"/>' +
            '</div> </div> </div>');
        return false; //prevent form submission
    });
    $('.repeater6').on('click','.remove', function() {
        $(this).parent().remove();
        return false; //prevent form submission
    });
    $('#drug_form2').hide();
    $('#enter_more_data').click(function () {
        $('#enter_more_data').hide();
        $('#drugs1').hide();
        $('#reset_button').hide();
        $('#drug_form2').show();
    });


    // $(".repeat").on('click', function (e) {
    //     $('.repeater').clone().insertAfter(".repeater");
    // });
    //$('.materialize-textarea').hide();
    //$('input#disease_name').hide();
    // $('.val17').show();
    // $('.val17').click(function () {
    //     $('.val17').toggle();
    //     $('#prevention').toggle();
    //     $('#prevention').trigger('autoresize');
    // });
    // $('.val16').show();
    // $('.val16').click(function () {
    //     $('.val16').hide();
    //     $('#outlook').toggle();
    // });
    // $('.val15').show();
    // $('.val15').click(function () {
    //     $('.val15').hide();
    //     $('#treatment').toggle();
    // });
    // $('.val14').show();
    // $('.val14').click(function () {
    //     $('.val14').hide();
    //     $('#diagnosis').toggle();
    // });
    // $('.val13').show();
    // $('.val13').click(function () {
    //     $('.val13').hide();
    //     $('#causes').toggle();
    // });
    // $('.val12').show();
    // $('.val12').click(function () {
    //     $('.val12').hide();
    //     $('#risk_factors').toggle();
    // });
    // $('.val11').show();
    // $('.val11').click(function () {
    //     $('.val11').hide();
    //     $('#symptoms').toggle();
    // });
    // $('.val11').click(function () {
    //     $('.val1').hide();
    //     $('input#disease_name').toggle();
    // });

    $('ul.tabs1').tabs('select_tab','#tab3');

    //$('.tabs1').hide();
    //$('#drug_data_form1').hide();
    $('#extra').hide();
    $('#home_card').click(function () {
        $('#home').hide();
        $('#extra').show();
    });

    //- ........................DRUG DATA FORM SUBMIT ....................
    // $('#brand_name').change(function () {
    //     var brand_name = $('#brand').val();
    //     $.ajax({
    //
    //     });
    //     $('datalist#brand_list').each(function () {
    //         brand_name += $(this).text();
    //     });
    // });
    // $textarea.val($textarea.val().replace(/\n/g,"\n\u2022").replace(/\r/g,"\r\u2022"));


    //- ................... DISEASE DATA FORM SUBMIT ....................
    $('#disease_data_button').click(function () {
        var disease_name = $('#disease_name').val();
        var symptoms = $('#symptoms').val();
        var risk_factor = $('#risk_factors').val();
        var cause = $('#causes').val();
        var subhead1 = [];
        $('.repeat_subhead1').each(function(){
            subhead1.push($(this).val()); //output <-- ['a','b','c']
        });
        var subhead2 = [];
        $('.text_subhead1').each(function () {
            subhead2.push($(this).val());
        });
        var treatment = $('#treatment').val();
        var outlook = $('#outlook').val();
        var prevention = $('#prevention').val();
        var source = $('#source').val();

        var data = {
            disease_name: disease_name,
            symptoms: symptoms,
            risk_factor: risk_factor,
            cause: cause,
            subhead1 : subhead1,
            subhead2 : subhead2,
            treatment: treatment,
            outlook: outlook,
            prevention: prevention,
            source: source
        };

        $.ajax({
            url: '/diseases',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                if (result.success === 'success') {
                    Materialize.toast(result.message, 1000);
                    window.location = '/health_care_provider?page=disease_data';
                }
                else {
                    Materialize.toast(result.message, 1000);
                }
            }
        });
    });

    $('.btn-drugs').click(function () {
        var brand_name = $('#brand_name').val();
        var company_name = $('#company_name').val();
        var categories = $('#categories').val();
        var strength1 = $("#strength").val();
        var strength2 = $("#strengths").val();
        var subhead1 = [];
        $('.repeat_subhead6').each(function(){
            subhead1.push($(this).val()); //output <-- ['a','b','c']
        });
        var subhead2 = [];
        $('.text_subhead6').each(function () {
            subhead2.push($(this).val());
        });
        //var potent_substance = $('#potent_substance').val();
        var dosage_form = $('#dosage_form').val();
        var packaging = $('#packaging').val();
        var price = $('#price').val();
        var prescription = $('#prescription').val();
        var dose_taken = $('#dose_taken').val();
        var dose_timing = $('#dose_timing').val();
        var types = $('#type').val();
        var primarily_used_for = $('#primarily_used_for').val();
        var warnings = $('#warnings').val();

        var data = {
            brand_name: brand_name,
            company_name: company_name,
            categories: categories,
            strength1: strength1,
            strength2: strength2,
            subhead111: subhead1,
            subhead222: subhead2,
            dosage_form: dosage_form,
            packaging: packaging,
            price: price,
            prescription: prescription,
            dose_taken : dose_taken,
            dose_timing :dose_timing,
            types : types,
            primarily_used_for : primarily_used_for,
            warnings : warnings
        };

        $.ajax({
            url: '/medicine',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                if (result.success === 'success') {
                    Materialize.toast(result.message, 1000);
                    window.location = '/health_care_provider?page=drug_data_form';
                }
                else {
                    Materialize.toast(result.message, 1000);
                }
            }
        });
    });

    $('#molecule_data_form').click(function () {
        var molecule_name = $('#molecule_name').val();
        var drug_categories = $('#drug_category').val();
        var absorption = $('#absorption').val();
        var distribution = $('#distribution').val();
        var metabolism = $('#metabolism').val();
        var excretion = $('#excretion').val();
        var description = $('#short_description').val();
        var side_effect = $('#side_effect').val();
        var precaution = $('#precaution').val();
        var food = $('#food_taken').val();
        var source = $('#source').val();

        //other drug interactions
        var subhead51 = [];
        $('.repeat_subhead5').each(function(){
            subhead51.push($(this).val()); //output <-- ['a','b','c']
            console.log("test subhead51" +subhead51);
        });
        var subhead52 = [];
        $('.text_subhead5').each(function () {
            subhead52.push($(this).val());
        });
        //var drug_interaction = $('#other_drug_interaction').val();
        //var food_interaction = $('#other_interactions').val();
        //var oral = $('#oral').val();
        //var intravenous = $('#intravenous').val();

        // other interactions
        var subhead41 = [];
        $('.repeat_subhead4').each(function(){
            subhead41.push($(this).val()); //output <-- ['a','b','c']
        });
        var subhead42 = [];
        $('.text_subhead4').each(function () {
            subhead42.push($(this).val());
        });

        // ........dosage field in molecule form............
        var subhead31 = [];
        $('.repeat_subhead3').each(function(){
            subhead31.push($(this).val()); //output <-- ['a','b','c']
        });
        var subhead32 = [];
        $('.text_subhead3').each(function () {
            subhead32.push($(this).val());
        });

        // List of contraindications
        var subhead21 = [];
        $('.repeat_subhead2').each(function(){
            subhead21.push($(this).val()); //output <-- ['a','b','c']
        });
        var subhead22 = [];
        $('.text_subhead2').each(function () {
            subhead22.push($(this).val());
        });

        var data = {
            molecule_name: molecule_name,
            drug_categories: drug_categories,
            absorption: absorption,
            distribution: distribution,
            metabolism: metabolism,
            excretion: excretion,
            description: description,
            side_effect: side_effect,
            precaution: precaution,
            subhead5: subhead51,
            info5: subhead52,
            food : food,
            subhead4: subhead41,
            info4: subhead42,
            subhead3: subhead31,
            info3: subhead32,
            subhead2_dosage: subhead21,
            info2: subhead22,
            source :source
        };

        $.ajax({
            url: '/molecules',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                if (result.success === 'success') {
                    Materialize.toast(result.message, 1000);
                    window.location = '/health_care_provider?page=molecule_data_form';
                }
                else {
                    Materialize.toast(result.message, 1000);
                }
            }
        });
    });

    // var slider = document.getElementById('test-slider');
    // noUISlider.create(slider, {
    //    start : [10],
    //    step: 2,
    //    connect: true,
    //    range: {
    //        'min' : [0],
    //        'profile' : [20],
    //        'drug': [40],
    //        'molecule': [60],
    //        'disease': [80],
    //        'max' : [100]
    //    }
    // });
    // ................FOR PROFILE OF DOCTOR ...................
    // $('#create_profile1').click(function () {
    //     var name = $('#name').val();
    //     var specialization = $('#specialization').val();
    //     var city = $('#city').val();
    //
    //     var data = {
    //         name: name,
    //         specialization: specialization,
    //         city: city
    //     };
    //     $.ajax({
    //         url: '/doctor_details',
    //         type: 'POST',
    //         data: JSON.stringify(data),
    //         contentType: 'application/json',
    //         success: function (result) {
    //             if (result.success === 'success') {
    //                 Materialize.toast(result.message, 1000);
    //                 window.render = '/health_care_provider?page=profile_doctor';
    //                 alert("msg");
    //             }
    //             else {
    //                 Materialize.toast(result.message, 1000);
    //             }
    //         }
    //     });
    //     //window.location = '/health_care_provider?page=profile_doctor';
    //     // $('#profile2').hide();
    //     // $('#main_profile_doctor').show();
    // });

    // ............................. FEEDBACK AND NEED HELP ...................//

    $('#submit_feedback').click(function () {
        var usefulness = $("input[type='radio'][name='radio1_feedback']:checked").val();
        var suggestion = $('#suggestion').val();
        var data = {
            usefulness: usefulness,
            suggestion: suggestion
        };
        $.ajax({
            url:'/feedback',
            type: 'POST',
            data: JSON.stringify(data),
            contentType:'application/json',
            success: function (result) {
                if(result.message === 'success'){
                    Materialize.toast(result.message, 1000);
                }
                else{
                    Materialize.toast(result.message,1000);
                }
            }
        });
    });

    $('#submit_help').click(function () {
        //var number = $('#number').val();
        var subject = $('#query').val();
        var contact_message = $('#message').val();
        var data = {
            subject : subject,
            contact_message : contact_message
        };
        $.ajax({
            url : '/needhelp',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                if (result.message === 'success') {
                    Materialize.toast(result.message, 1000);
                    // $('#queries').hide();
                    // alert("We will Contact You soon! :)");
                    //window.location = '/health_care_provider?page=need_help';
                }
                else {
                    Materialize.toast(result.message, 1000);
                }
            }
        });
    });

    // ............................. DOCTOR PROFILE ...........................//
    $('#doctor').click(function () {
        var profession = 'doctor';
        var data= {
            profession : profession
        };
        $.ajax({
            url : '/doctor',
            type: 'POST',
            data : JSON.stringify(data),
            contentType:'application/json',
            success: function (result) {
                if (result.success === 'success') {
                    Materialize.toast(result.message, 1000);
                }
                else {
                    Materialize.toast(result.message, 1000);
                }
            }
        });
    });

    $('#pharmacist').click(function () {
        var profession = 'pharmacist';
        var data= {
            profession : profession
        };
        $.ajax({
            url : '/pharma',
            type: 'POST',
            data : JSON.stringify(data),
            contentType:'application/json',
            success: function (result) {
                if (result.success === 'success') {
                    Materialize.toast(result.message, 1000);
                }
                else {
                    Materialize.toast(result.message, 1000);
                }
            }
        });
    });

    $('#doctor_student').click(function () {
        var profession = 'student';
        var data = {
            profession: profession
        };
        $.ajax({
            url : '/profession',
            type: 'POST',
            data : JSON.stringify(data),
            contentType:'application/json',
            success: function (result) {
                if (result.success === 'success') {
                    Materialize.toast(result.message, 1000);
                }
                else {
                    Materialize.toast(result.message, 1000);
                }
            }
        });
    });

    $('#doctor_professional').click(function () {
        var profession = 'doctor';
        var data = {
            profession: profession
        };
        $.ajax({
            url : '/profession',
            type: 'POST',
            data : JSON.stringify(data),
            contentType:'application/json',
            success: function (result) {
                if (result.success === 'success') {
                    Materialize.toast(result.message, 1000);
                }
                else {
                    Materialize.toast(result.message, 1000);
                }
            }
        });
    });

    $('#pharma_student').click(function () {
        var profession = 'student';
        var data = {
            profession: profession
        };
        $.ajax({
            url : '/pharma_profession',
            type: 'POST',
            data : JSON.stringify(data),
            contentType:'application/json',
            success: function (result) {
                if (result.success === 'success') {
                    Materialize.toast(result.message, 1000);
                }
                else {
                    Materialize.toast(result.message, 1000);
                }
            }
        });
    });

    $('#pharma_professional').click(function () {
        var profession = 'pharmacist';
        var data = {
            profession: profession
        };
        $.ajax({
            url : '/pharma_profession',
            type: 'POST',
            data : JSON.stringify(data),
            contentType:'application/json',
            success: function (result) {
                if (result.success === 'success') {
                    Materialize.toast(result.message, 1000);
                }
                else {
                    Materialize.toast(result.message, 1000);
                }
            }
        });
    });

    //- .............BASIC DETAILS SUBMIT FORM .............................//

    $('#edu_special').hide();
    //$('#register_doc').hide();
    $('#basic_details').click(function () {
        var title = $('#title').val();
        var name = $('#name').val();
        var email = $('#email').val();
        var gender = $("input[type='radio'][name='gender']:checked").val();
        var city = $('#city').val();
        var experience = $('#year_of_experience').val();
        var about = $('#about_you').val();
        var data = {
            title: title,
            name: name,
            email: email,
            gender: gender,
            city: city,
            experience: experience,
            about: about
        };
        $.ajax({
            url: '/basic',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                if (result.success === 'success') {
                    Materialize.toast(result.message, 1000);
                }
                else {
                    Materialize.toast(result.message, 1000);
                }
            }
            //window.location = '/health_care_provider?page=profile_pharmacist';
            // $('#profile3').hide();
            // $('#main_profile_pharmacist').show();
        });
        //$('#tab2').focus();
        //$('#main_profile_doctor ul.tabs li.tab a').hover(function() {
        $('#tab2').focus();
        $('#basic_detail').hide();
        $('#edu_special').show();
    });

    $('#basic_details_pharma').click(function () {
        var title = $('#title').val();
        var name = $('#name').val();
        var email = $('#email').val();
        var gender = $("input[type='radio'][name='gender']:checked").val();
        var city = $('#city').val();
        var experience = $('#year_of_experience').val();
        var about = $('#about_you').val();
        var data = {
            title: title,
            name: name,
            email : email,
            gender: gender,
            city: city,
            experience: experience,
            about: about
        };
        $.ajax({
            url: '/pharma_basic',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                if (result.success === 'success') {
                    Materialize.toast(result.message, 1000);
                }
                else {
                    Materialize.toast(result.message, 1000);
                }
            }
            //window.location = '/health_care_provider?page=profile_pharmacist';
            // $('#profile3').hide();
            // $('#main_profile_pharmacist').show();
        });
        //$('#tab2').focus();
        //$('#main_profile_doctor ul.tabs li.tab a').hover(function() {
        $('#tab2').focus();
        $('#basic_detail_pharma').hide();
        //$('#edu_special').show();
    });

    $('#education').click(function () {
        var qualification = $('#qualification').val();
        var college = $('#college').val();

        var completion_year = $('#completion_year').val();
        var batch_from = $('#batch_from').val();
        var batch_to = $('#batch_to').val();
        var specialization = $('#specialization').val();
        var data = {
            qualification: qualification,
            college: college,
            completion: completion_year,
            batch_from :batch_from,
            batch_to : batch_to,
            specialization: specialization
        };
        $.ajax({
            url: '/education',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                if (result.success === 'success') {
                    Materialize.toast(result.message, 1000);
                }
                else {
                    Materialize.toast(result.message, 1000);
                }
            }
        });
        $('#tab3').focus();
        // $('#main_profile_doctor ul.tabs li.tab a').hover(function() {
        //     $('#tab3').addClass('active').find('li.tab').show().css({'background-color':'lavender'});
        // });

        //$('#edu_special').hide();
        $('#register_doc').show();
    });

    $('#education_pharma').click(function () {
        var qualification = $('#qualification').val();
        var college = $('#college').val();

        var completion_year = $('#completion_year').val();
        var batch_from = $('#batch_from').val();
        var batch_to = $('#batch_to').val();
        var specialization = $('#specialization').val();
        var data = {
            qualification: qualification,
            college: college,
            completion: completion_year,
            batch_from :batch_from,
            batch_to : batch_to,
            specialization: specialization
        };
        $.ajax({
            url: '/pharma_education',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                if (result.success === 'success') {
                    Materialize.toast(result.message, 1000);
                }
                else {
                    Materialize.toast(result.message, 1000);
                }
            }
        });
        $('#tab3').focus();
        // $('#main_profile_doctor ul.tabs li.tab a').hover(function() {
        //     $('#tab3').addClass('active').find('li.tab').show().css({'background-color':'lavender'});
        // });

        $('#edu_special').hide();
        $('#register_doc').show();
    });

    $('.upload_image1').submit(function () {
        var council_number = $('#council_reg_no').val();
        var council_name = $('#council_name').val();
        var council_year = $('#council_year').val();
        // alert(council_number);
        // alert(council_name);
        // alert(council_year);
        var data = {
            council_number: council_number,
            council_name: council_name,
            council_year: council_year
        }
        $.ajax({
            url: '/certificate',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                if (result.success === 'success') {
                    Materialize.toast(result.message, 1000);
                }
                else {
                    Materialize.toast(result.message, 1000);
                }
            }
        });
    });

    $('.upload_image1_pharma').submit(function () {
        var council_number = $('#council_reg_no').val();
        var council_name = $('#council_name').val();
        var council_year = $('#council_year').val();
        // alert(council_number);
        // alert(council_name);
        // alert(council_year);
        var data = {
            council_number: council_number,
            council_name: council_name,
            council_year: council_year
        };
        $.ajax({
            url: '/pharma_certificate',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                if (result.success === 'success') {
                    Materialize.toast(result.message, 1000);
                }
                else {
                    Materialize.toast(result.message, 1000);
                }
            }
        });
    });

    // $('.upload_image').submit(function (e) {
    //     e.preventDefault();
    //     $.ajax({
    //         url: '/certificate',
    //         type: 'POST',
    //         contentType : 'application/json',
    //         success: function (result) {
    //             if(result.success === 'success')
    //             {
    //                 Materialize.toast(result.message,1000);
    //             }
    //             else
    //             {
    //                 Materialize.toast(result.message,1000);
    //             }
    //         }
    //     });
    //
    // });


    // ................FOR PROFILE OF PHARMACISTS ...................


    //$('select').material_select();

    // TABS USED IN PROFILE STEP 3
    //$('ul.tabs').tabs('select_tab', '#tab3');
    // $('.file_upload').change(function(input) {
    //     if(input.files && input.files[0])
    //     {
    //         var reader = new FileReader();
    //         $('#{reader}').load(function (e) {
    //             $('#image_for_docs1').attr('src',e.target.result);
    //             $('#image_for_docs2').attr('src',e.target.result);
    //         });
    //         $('#{reader}').readAsDataURL(input.files[0]);
    //     }
    // });

    $('.datepicker').pickadate({

        selectYears: 50,
        today: 'Today',
        clear: 'Clear',
        close: 'Ok',
        closeOnSelect: false
    });

    $('.button-collapse').sideNav({
        menuWidth: 265,
        edge: 'left',
        closeOnClick: true,
        draggable: true,
        opacity: 0,
        onOpen: function openNav() {
            $('#side_navbar').click(function () {
                width = "250px";
            });

            $('#navBar').click(function () {
                marginLeft = "250px";
            });
            //$('#menubar').hide();
        },
        onClose: function closeNav() {
            $('#side_navbar').click(function () {
                width = "0px";
            });

            $('#navBar').click(function () {
                marginLeft = '0px';
            });
        }
    });

    //- ..............Disease data form..... name of disease to be changed on entry..................
    // $('#disease_name').change(function () {
    //     var disease_name = $('#disease_name').val();
    //     $().load()
    // });

    // ...................FORM VALIDATION.......................
    // $('form[name="drug_form1"]').validate({
    //     //Materialize.toast('this is a test', 2000);
    //
    //         brand_name : "required",
    //         company_name : "required",
    //         categories : "required",
    //         strength : "required",
    //         potent_substances : "required",
    //         dosage_form : "required",
    //         packaging : "required",
    //         price : "required",
    //
    //
    //     messages : {
    //         brand_name : "Required!",
    //         company_name : "Required!",
    //         categories : "Required!",
    //         strength : "Required!",
    //         potent_substances : "Required!",
    //         dosage_form : "Required!",
    //         packaging : "Required!",
    //         price : "Required!"
    //     },
    //     submitHandler: function(form) {
    //         form.submit();
    //     }
    // });

    $('#file').change(function () {
        filePreview(this);
    });
});


function filePreview(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#uploadImage + img').remove();
            $('#uploadForm').after('<img src="'+e.target.result+'" width="150" height="150"/>');
        };

        reader.readAsDataURL(input.files[0]);
    }
}

// function readURL(input) {
//     if (input.files && input.files[0]) {
//         var reader = new FileReader();
//
//         reader.onload = function (e) {
//             $('#image_for_docs1').attr('src', e.target.result);
//             $('#image_for_docs2').attr('src', e.target.result);
//         };
//
//         reader.readAsDataURL(input.files[0]);
//     }
// }

// function validateForm() {
//     var brand_name = document.forms["drug_form1"]["brand_name"].value;
//     if (x == "") {
//         alert("Name must be filled out");
//         return false;
//     }
// }
// function validateForm() {
//     Materialize.toast('this is a test', 2000);
//
//     $('#drugs1').click(function () {
//             var brand_name = document.forms["drug_form1"]["brand_name"].value;
//             var categories = document.forms["drug_form1"]["brand_name"].value;
//             var company_name = document.forms["drug_form1"]["brand_name"].value;
//             var strength = document.forms["drug_form1"]["brand_name"].value;
//             var potent_substances = document.forms["drug_form1"]["brand_name"].value;
//             var dosage_form = document.forms["drug_form1"]["brand_name"].value;
//             var packaging = document.forms["drug_form1"]["brand_name"].value;
//             var price = document.forms["drug_form1"]["brand_name"].value;
//
//             if (brand_name == '' || categories == '' || company_name == '' || strength == '' || potent_substances == '' || dosage_form == '' || packaging == '' || price == '') {
//                 alert("All Fields must be filled out");
//                 return false;
//             }
//             return true;
//         }
//     );
// }
//         var prescription = $('#prescription').val;
//         var dose_taken = $('#dose_taken').val;
//         var dose_timing = $('#dose_timing').val;
//         var warnings = $('#warnings').val;
//         var primarily_used_for = $('#primarily_used_for').val;
//         var molecule_name = $('#molecule_name').val;
//         var drug_category = $('#drug_category').val;
//         var short_description = $('#short_description').val;
//         var absorption = $('#absorption').val;
//         var distribution = $('#distribution').val;
//         var metabolism = $('#metabolism').val;
//         var excretion = $('#excretion').val;
//         var side_effects = $('#side_effects').val;
//         var special_precautions = $('#special_precautions').val;
//         var other_drug_interactions = $('#other_drug_interactions').val;
//         var food_interaction = $('#food_interaction').val;
//         var oral_dosage = $('#oral_dosage').val;
//         var intravenous_dosage = $('#intravenous_dosage').val;
//         var food_before_after = $('#food_before_after').val;
//         var in_pregnancy = $('#in_pregnancy').val;
//         var in_lactation = $('#in_lactation').val;
//         var in_children = $('#in_children').val;
//         var storage = $('#storage').val;
//         var in_geriatric = $('#in_geriatric').val;
//         var other_contraindications = $('#other_contraindications').val;
//         var lab_interference = $('#lab_interference').val;
//         //var company_name = $('#').val;
//
//
//         alert("Name must be filled out");
//         return false;
//     });
//     return true;
// }

// function openNav() {
//     document.getElementById("mySidenav").style.width = "230px";
//     document.getElementById("main").style.marginLeft = "230px";
// }
// function closeNav() {
//     document.getElementById("mySidenav").style.width = "0";
//     document.getElementById("main").style.marginLeft= "0";
// }
