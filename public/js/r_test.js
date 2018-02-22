$(function () {

    $('.modal').modal({
        dismissible:true,
        opacity: 0.2,
        inDuration: 300,
        outDuration:200,
        startingTop:'4%',
        endingTop: '11%'
    });

    // --------------------- TABS USED IN PROFILE STEP 3 ---------------------------

    $("ul.tabs").tabs('select_tab','tab1');


    // ---------------- COLLAPSIBLE IN DRUG DATA VIEW -------------------------
    $('.collapsible').collapsible({
        accordion: false,
        onOpen: function () {
            $('#read_more').hide();
        },
        onClose : function () {
            $('#read_more').show();
        }
    });

    // ------------------------------ DISEASE DATA PORM= Symptoms list ---------------
    $('.chips').material_chip();
    $('.chips-initial').material_chip('chip_data');
    $('.chips-placeholder').material_chip({
        placeholder: 'Enter symptoms',
        secondaryPlaceholder: 'Add more'
    });

    // $('#text1').val();
    // $('#text1').trigger('autoresize');

    $(':reset');



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


    // ------------------------- CAPITAL FIRST LETTER OF SENTENCES -----------------------//




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
        // $( "p" ).first().html( "<span>" + text + "</span>" );
        $( '#clicked_letter' ).on( "click", function() {
            $( this ).css( "background-color", "grey" );
        });
    });


    $('.dropdown-button').dropdown({
        inDuration: 300,
        outDuration: 500,
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


    //............................... For Diagnosis in Disease form...............//
    $('.repeat1').on('click', function() {
        $('.repeater1').append('<div><input id="subhead1" type="text"  placeholder="Enter a subheading" ' +
            'class="validate r003 browser-default repeat_subhead1" required/><button class="remove">x</button>' +
            '<textarea class="validate text_subhead1 materialize-textarea tobig" id="subhead_text1" required>' +
            '</textarea><label for="subhead1" style="color:black;font-size: 15px;font-weight: 400;">' +
            '</label><label for="subhead_text1",placeholder="Enter text", style="color:black;font-size: 15px;font-weight: 400;"></label></div></div>');
        return false; //prevent form submission
    });
    $('.repeater1').on('click', '.remove', function() {
        $(this).parent().remove();
        return false; //prevent form submission
    });

    // ----------------------------- For Symptoms in Disease Form ----------------------//

    $('.repeat8').on('click', function() {
            $('.repeater8').append('<div><button class="remove right">x</button>' +
                '<input id="subhead8" type="text"  placeholder="Enter Symptom" class="validate r003 repeat_subhead8" required/>' +
                '<label for="subhead1" style="color:black;font-size: 15px;font-weight: 400;">' +
                '</label></div>');
            return false; //prevent form submission
        });
        $('.repeater8').on('click', '.remove', function() {
            $(this).parent().remove();
            return false; //prevent form submission
        });

    // .............................. For ORGANS in Disease Form ....................//
    $('.repeat7').on('click', function() {
        $('.repeater7').append('<div><input id="subhead7" type="text"  placeholder="Enter a subheading" class="browser-default repeat_subhead7" required/><button class="remove">x</button>' +
            '<textarea class="text_subhead7 materialize-textarea tobig" id="subhead_text7" required></textarea><label for="subhead7" style="color:black;font-size: 15px;font-weight: 400;">' +
            '</label><label for="subhead_text7",placeholder="Enter text", style="color:black;font-size: 15px;font-weight: 400;"></label></div></div>');
        return false; //prevent form submission
    });
    $('.repeater7').on('click', '.remove', function() {
        $(this).parent().remove();
        return false; //prevent form submission
    });

    //............................... For contraindications in molecule form ............//
    $('.repeat2').on('click', function() {
        $('.repeater2').append('<div><input id="subhead2" type="text" list="contra" placeholder="Choose subheading" required="required" class="validate browser-default repeat_subhead2" required/><button class="remove">x</button>' +
            '<textarea class="text_subhead2 materialize-textarea validate" placeholder="Enter Text" id="subhead_text2" required></textarea><label for="subhead2" style="color:black;font-size: 15px;font-weight: 400;"></label>' +
            '<label for="subhead_text2" style="color:black;font-size: 15px;font-weight: 400;">' +
            '<datalist id="contra"> <option> In Lactation</option> <option>In Geriatric/Old Person</option><option>Other Contraindications</option>' +
            ' <option> In Pregnancy </option>Lab  <option>Interference</option> <option> In Children </option><option>Storage</option>' +
            '</label></div></div>');
        return false; //prevent form submission
    });
    $('.repeater2').on('click', '.remove', function() {
        $(this).parent().remove();
        return false; //prevent form submission
    });

    //............................... For Dosage in Molecule Form...............//
    $('.repeat3').on('click', function() {
        $('.repeater3').append('<div><input id="subhead3" type="text" list="dosage" placeholder="Choose subheading" required="required" class="validate browser-default repeat_subhead3" required/><button class="remove">x</button>' +
            '<textarea class="validate text_subhead3 materialize-textarea" placeholder="Enter Text" id="subhead_text3" required></textarea><label for="subhead3" style="color:black;font-size: 15px;font-weight: 400;"></label>' +
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
        $('.repeater4').append('<div><input id="subhead4" type="text" placeholder="Enter subheading" class="validate browser-default repeat_subhead4" required/><button class="remove">x</button>' +
            '<textarea class="validate text_subhead4 materialize-textarea" placeholder="Enter Text" id="subhead_text4" required></textarea><label for="subhead4" style="color:black;font-size: 15px;font-weight: 400;"></label>' +
            '<label for="subhead_text4" style="color:black;font-size: 15px;font-weight: 400;">' +
            '</label></div></div>');
        return false; //prevent form submission
    });
    $('.repeater4').on('click', '.remove', function() {
        $(this).parent().remove();
        return false; //prevent form submission
    });

    var $form = $("#myid"),
        $errorMsg = $("<span class='error'>This field is required..!!</span>");

    $("#submit").on("click", function () {
        // If any field is blank, we don't submit the form
        var toReturn = true;
        $("input", $form).each(function () {
            // If our field is blank
            if ($(this).val() == "") {
                // Add an error message
                if (!$(this).data("error")) {
                    $(this).data("error", $errorMsg.clone().insertAfter($(this)));
                }
                toReturn = false;
            }
            // If the field is not blank
            else {
                // Remove the error message
                if ($(this).data("error")) {
                    $(this).data("error").remove();
                    $(this).removeData("error");
                }
            }
        });
        return toReturn;
    });

    //............................... For Other Drug Interactions In Molecule Form ...........//
    $('.repeat5').on('click', function() {
        $('.repeater5').append('<div><input id="subhead5" type="text" placeholder="Enter subheading" class="validate browser-default repeat_subhead5" required/><button class="remove">x</button>' +
            '<textarea class="text_subhead5 materialize-textarea validate" placeholder="Enter Text" id="subhead_text5" required></textarea><label for="subhead5" style="color:black;font-size: 15px;font-weight: 400;"></label>' +
            '<label for="subhead_text5" style="color:black;font-size: 15px;font-weight: 400;">' +
            '</label></div></div>');
        return false; //prevent form submission
    });
    $('.repeater5').on('click', '.remove', function() {
        $(this).parent().remove();
        return false; //prevent form submission
    });

    //............................... For DOSAGE FORM, STRENGTH, PACKAGING, ...............//
    // $('.repeat8').on('click', function() {
    //     $('.repeater8').append('<div><button class="right remove"> x</button>' +
    //         '<div style="padding:0 20px 0 10px;" class="collection"><div class="col s12 m6 l6"><span>Dosage Form</span>' +
    //         '<span class="red-text">&nbsp*</span><input list="dosages" id="dosage_form" placeholder="Choose" style="color:black;font-size: 18px;font-weight: 400;" required="required" class="validate"/>\n' +
    //         '<datalist id="dosages"><option value="Tablet">Tablet</option><option value="Capsule">Capsule</option>\n' +
    //         '<option value="Solution">Solution</option><option value="Gels">Gels</option><option value="Pill">Pill</option>\n' +
    //         '<option value="Powder">Powder</option><option value="Talc">Talc</option><option value="Paste">Paste</option>\n' +
    //         '<option value="Drops">Drops</option><option value="Ointment">Ointment</option><option value="Inhaler">Inhaler</option>\n' +
    //         '<option value="Aerosol">Aerosol</option><option value="Injection">Injection</option><option value="Cream">Cream</option>\n' +
    //         '<option value="Ear Drops">Ear Drops</option><option value="Patch">Patch</option><option value="Dermal Patch">Dermal Patch</option>\n' +
    //         '<option value="Lotion">Lotion</option><option value="Balm">Balm</option><option value="Skin Patch">Skin Patch</option>\n' +
    //         '<option value="Syrup">Syrup</option><option value="Infusion">Infusion</option><option value="Vial">Vial</option>\n' +
    //         '<option value="Suppository">Suppository</option><option value="Gargle">Gargle</option><option value="Kit">Kit</option>\n' +
    //         '<option value="Shampoo">Shampoo</option><option value="Mouth wash">Mouth wash</option><option value="Soft-gel">Soft-gel</option>\n' +
    //         '</datalist></div><div class="col s12 m6 l6"><span>Strength</span><div class="row"><div class="col s12 m12 l12">' +
    //         '<input type="text" id="strength" placeholder="eg.500 mg" style="color:black;font-size: 18px;font-weight: 400;"/>' +
    //         '</div></div></div><div class="col s12 m6 l6"><span>Packaging</span>' +
    //         '<input type="text" id="packaging" style="color:black;font-size: 18px;font-weight: 400;"/>\n' +
    //         '</div><div class="col s12 m6 l6"><span>Price</span><span class="red-text">&nbsp*</span>\n' +
    //         '<div class="row"><div class="col s2 m1 l1"><span>' +
    //         '<i aria-hidden="true" style="padding-top:12px;" class="fa fa-inr left"></i></span></div><div class="col s8 m11 l11">\n' +
    //         '<input type="text" style="color:black; font-size: 18px;font-weight: 400;" required="required" class="validate"/>\n' +
    //         '</div></div></div></div></div></div></div></div>');
    //     return false; //prevent form submission
    // });
    // $('.repeater8').on('click','.remove', function() {
    //     $(this).parent().remove();
    //     return false; //prevent form submission
    // });


    //............................... For Potent Substances in Drug Data Form.............//
    $('.repeat6').on('click', function(){
        $('.repeater6').append('<div><button class="right remove">x</button><div class="collection" style="border-color:transparent;padding-right:18px;">' +
            '<div class="col s12 m6 l6"><input id="subheading6" type="text" placeholder="Enter Name" required="required" class="repeat_subhead6" style="text-transform:capitalize;"></div>' +
            '<div class="col s12 m6 l6"> <input id="subhead_text6" type="text" placeholder="Enter Molecule Strength" required="required" style="text-transform:capitalize;" class="text_subhead6"/>' +
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
    //$('ul.tabs1').tabs();
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

    //$('.next_line').add("<span>-&nbsp</span>").appendTo(document.body);

    // ------------------------ FOR LOGOUT -----------------------//
    // $('.logout').click(function(){
    //
    //     confirm("Are you sure you want to Logout?");
    //     // event.preventDefault();
    //     // event.stopPropagation();
    //     alert('here!');
    //     $.ajax({
    //         url:'/logout',
    //         // type: 'GET',
    //         // content: 'application/json',
    //         success: function (result) {
    //             if (result.status === 'logout') {
    //                 Materialize.toast(result.message, 2000);
    //                 window.location = result.redirect;
    //             }
    //             else {
    //                 Materialize.toast('Could Not Logout. Try Again!', 2000);
    //             }
    //         }
    //     });
    //
    // });



    //- ................... DISEASE DATA FORM SUBMIT ....................
    $('#disease_data_button').click(function () {
        var disease_name = $('#disease_name').val();
        var symptoms = [];
        $('.repeat_subhead8').each(function () {
            symptoms.push($(this).val());
        });
        // $('.chips').on('chip.add', function(e,chip){
        //     symptoms.push($(this).val());
        // });
        var risk_factor = $('#risk_factors').val();
        var cause = $('#causes').val();
        var subhead1 = [];
        $('.repeat_subhead1').each(function () {
            subhead1.push($(this).val()); //output <-- ['a','b','c']
        });
        var subhead2 = [];
        $('.text_subhead1').each(function () {
            subhead2.push($(this).val());
        });
        var subhead71 = [];
        $('.repeat_subhead7').each(function () {
            subhead71.push($(this).val()); //output <-- ['a','b','c']
        });
        var subhead72 = [];
        $('.text_subhead7').each(function () {
            subhead72.push($(this).val());
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
            subhead1: subhead1,
            subhead2: subhead2,
            subhead: subhead71,
            info: subhead72,
            treatment: treatment,
            outlook: outlook,
            prevention: prevention,
            source: source
        };
        event.preventDefault();
        event.stopPropagation();
        if (confirm('Confirm to submit')) {
            $.ajax({
                url: '/health/diseaseData',
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (result) {
                    if(result.status === 'success') {
                        Materialize.toast(result.message,1000);
                        window.location = '/health/health_care_provider?page=disease_data_form';
                    }
                    else{
                        Materialize.toast(result.message,1000);
                        $('#disease_name').focus();
                    }
                }
            });
        }
        else{
            return false;
        }
    });

    $('.btn-drugs').click(function () {
        var brand_name = $('#brand_name').val();
        var company_name = $('#company_name').val();
        var categories = $('#categories').val();
        var strength1 = $("#strength").val();
        var subhead1 = [];
        $('.repeat_subhead6').each(function(){
            subhead1.push($(this).val());
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
        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate();
        var output = d.getFullYear() + '' +
            ((''+month).length<2 ? '0' : '') + month + '' +
            ((''+day).length<2 ? '0' : '') + day;

        var minNumber = 0000;
        var maxNumber = 9999;
        var randomNumber = randomNumberFromRange(minNumber, maxNumber);
        var token = output+""+randomNumber;
        function randomNumberFromRange(min,max)
        {
            return Math.floor(Math.random()*(max-min+1)+min);
        }

        var data = {
            brand_name: brand_name,
            company_name: company_name,
            categories: categories,
            strength1: strength1,
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
            warnings : warnings,
            ticket : token
        };
        event.preventDefault();
        event.stopPropagation();
        if(confirm('Confirm to submit')){
            $.ajax({
                url: '/health/drugData',
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (result) {
                    if(result.status === "success") {
                        Materialize.toast(result.message,1000);
                        window.location = '/health/health_care_provider?page=drug_data_form';
                    }
                    else{
                        Materialize.toast(result.message,1000);
                        $('#brand_name').focus();
                        return false;
                    }
                }
            });
        }
        else{
            return false;
        }
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
        event.preventDefault();
        event.stopPropagation();
        if(confirm('Confirm to submit')) {
            $.ajax({
                url: '/health/moleculeData',
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (result) {
                    if(result.status === 'success') {
                        Materialize.toast(result.message,1000);
                        window.location = '/health/health_care_provider?page=molecule_data_form';
                    }
                    else{
                        Materialize.toast(result.message,1000);
                        $('#molecule_name').focus();
                    }
                }
            });
        }
        else{
            return false;
        }
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
        var about = $('#about').val();
        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate();
        var output = d.getFullYear() + '' +
            ((''+month).length<2 ? '0' : '') + month + '' +
            ((''+day).length<2 ? '0' : '') + day;

        var minNumber = 0000;
        var maxNumber = 9999;
        var randomNumber = randomNumberFromRange(minNumber, maxNumber);
        var token = output+""+randomNumber;
        function randomNumberFromRange(min,max)
        {
            return Math.floor(Math.random()*(max-min+1)+min);
        }
        var data = {
            usefulness: usefulness,
            suggestion: suggestion,
            about : about,
            token : token
        };
        $.ajax({
            url:'/feedback',
            type: 'POST',
            data: JSON.stringify(data),
            contentType:'application/json',
            success: function (result) {
                if(result.message === 'success'){
                    Materialize.toast(result.message,1000);
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
                if(result.message === 'success') {
                    Materialize.toast(result.message,2000);
                }
                else{
                    Materialize.toast(result.message,2000);
                }
            }
        });
    });

    // ............................. DOCTOR PROFILE ...........................//

    // $('#doctor').click(function () {
    //     var profession = 'doctor';
    //     var data= {
    //         profession : profession
    //     };
    //     $.ajax({
    //         url : '/doctor',
    //         type: 'POST',
    //         data : JSON.stringify(data),
    //         contentType:'application/json',
    //         success: function (result) {
    //             if (result.success === 'success') {
    //                 Materialize.toast(result.message, 1000);
    //             }
    //             else {
    //                 Materialize.toast(result.message, 1000);
    //             }
    //         }
    //     });
    // });
    //
    // $('#pharmacist').click(function () {
    //     var profession = 'pharmacist';
    //     var data= {
    //         profession : profession
    //     };
    //     $.ajax({
    //         url : '/pharma',
    //         type: 'POST',
    //         data : JSON.stringify(data),
    //         contentType:'application/json',
    //         success: function (result) {
    //             if (result.success === 'success') {
    //                 Materialize.toast(result.message, 1000);
    //             }
    //             else {
    //                 Materialize.toast(result.message, 1000);
    //             }
    //         }
    //     });
    // });

    // -------------------------- DOCTOR PROFILE SECTION WHERE USER CHOOSES BETWEEN STUDENT AND PROFESSIONAL ----
    //========================================= CHOOSES STUDENT
    $('#doctor_student').click(function () {
        var profession = 'student';
        var data = {
            profession: profession
        };
        $.ajax({
            url : '/health/profession',
            type: 'POST',
            data : JSON.stringify(data),
            contentType:'application/json',
            success: function (result) {
                if (result.success === 'success') {
                    Materialize.toast(result.message,1000);
                }
                else {
                    Materialize.toast(result.message,1000);
                }
            }
        });
    });
    //========================================= CHOOSES PROFESSIONAL
    $('#doctor_professional').click(function () {
        var profession = 'doctor';
        var data = {
            profession: profession
        };
        $.ajax({
            url : '/health/profession',
            type: 'POST',
            data : JSON.stringify(data),
            contentType:'application/json',
            success: function (result) {
                if (result.success === 'success') {
                    Materialize.toast(result.message,1000);
                }
                else {
                    Materialize.toast(result.message,1000);
                }
            }
        });
    });


    // -------------------------- PHARMACIST PROFILE SECTION WHERE USER CHOOSES BETWEEN STUDENT AND PROFESSIONAL ----
    //========================================= CHOOSES STUDENT
    $('#pharma_student').click(function () {
        var profession = 'student';
        var data = {
            profession: profession
        };
        $.ajax({
            url : '/health/pharma_profession',
            type: 'POST',
            data : JSON.stringify(data),
            contentType:'application/json',
            success: function (result) {
                if (result.success === 'success') {
                    Materialize.toast(result.message,1000);
                }
                else {
                    Materialize.toast(result.message,1000);
                }
            }
        });
    });
    //========================================= CHOOSES PROFESSIONAL
    $('#pharma_professional').click(function () {
        var profession = 'pharmacist';
        var data = {
            profession: profession
        };
        $.ajax({
            url : '/health/pharma_profession',
            type: 'POST',
            data : JSON.stringify(data),
            contentType:'application/json',
            success: function (result) {
                if (result.success === 'success') {
                    Materialize.toast(result.message,1000);
                }
                else {
                    Materialize.toast(result.message,1000);
                }
            }
        });
    });

    // $('#form_education_specialization').hide();
    // $('#register_doc').hide();
    // // $("#tab2").click(function () {
    // //     //$('#tab2').focus().active();
    // //     $("#edu_special").show();
    // //     $('#basic_detail').hide();
    // // });
    // //
    // // $("#tab3").click(function () {
    // //     $('#tab3').focus().active();
    // //     $("#register_doc").show();
    // //     $('#basic_detail').hide();
    // // });
    //
    // $('#edu_special').hide();
    // $('#basic_details').click(function () {
    //     var title = $('#title').val();
    //     var name = $('#name').val();
    //     var email = $('#email').val();
    //     var gender = $("input[type='radio'][name='gender']:checked").val();
    //     var city = $('#city').val();
    //     var experience = $('#year_of_experience').val();
    //     var about = $('#about_you').val();
    //     var data = {
    //         title: title,
    //         name: name,
    //         email: email,
    //         gender: gender,
    //         city: city,
    //         experience: experience,
    //         about: about
    //     };
    //     $.ajax({
    //         url: '/basic',
    //         type: 'POST',
    //         data: JSON.stringify(data),
    //         contentType: 'application/json',
    //         success: function (result) {
    //             if (result.success === 'success') {
    //                 Materialize.toast(result.message, 1000);
    //             }
    //             else {
    //                 Materialize.toast(result.message, 1000);
    //             }
    //         }
    //
    //     });
    //     $('#tab2').focus();
    //     $('#basic_detail').hide();
    //     $('#edu_special').show();
    //
    // });
    //
    // $('#basic_details_pharma').click(function () {
    //     var title = $('#title').val();
    //     var name = $('#name').val();
    //     var email = $('#email').val();
    //     var gender = $("input[type='radio'][name='gender']:checked").val();
    //     var city = $('#city').val();
    //     var experience = $('#year_of_experience').val();
    //     var about = $('#about_you').val();
    //     var data = {
    //         title: title,
    //         name: name,
    //         email : email,
    //         gender: gender,
    //         city: city,
    //         experience: experience,
    //         about: about
    //     };
    //     $.ajax({
    //         url: '/pharma_basic',
    //         type: 'POST',
    //         data: JSON.stringify(data),
    //         contentType: 'application/json',
    //         success: function (result) {
    //             if (result.success === 'success') {
    //                 Materialize.toast(result.message, 1000);
    //             }
    //             else {
    //                 Materialize.toast(result.message, 1000);
    //             }
    //         }
    //         //window.location = '/health_care_provider?page=profile_pharmacist';
    //         // $('#profile3').hide();
    //         // $('#main_profile_pharmacist').show();
    //     });
    //     //$('#tab2').focus();
    //     //$('#main_profile_doctor ul.tabs li.tab a').hover(function() {
    //     // $('#tab2').focus();
    //     // $('#basic_detail_pharma').hide();
    //     // $('#edu_special').show();
    // });
    //
    // $('#education').click(function () {
    //     var qualification = $('#qualification').val();
    //     var college = $('#college').val();
    //     var completion_year = $('#completion_year').val();
    //     var batch_from = $('#batch_from').val();
    //     var batch_to = $('#batch_to').val();
    //     var specialization = $('#specialization').val();
    //     var data = {
    //         qualification: qualification,
    //         college: college,
    //         completion: completion_year,
    //         batch_from :batch_from,
    //         batch_to : batch_to,
    //         specialization: specialization
    //     };
    //     $.ajax({
    //         url: '/education',
    //         type: 'POST',
    //         data: JSON.stringify(data),
    //         contentType: 'application/json',
    //         success: function (result) {
    //             if (result.success === 'success') {
    //                 Materialize.toast(result.message, 1000);
    //             }
    //             else {
    //                 Materialize.toast(result.message, 1000);
    //             }
    //         }
    //     });
    //     $('#tab3').focus();
    //     // $('#main_profile_doctor ul.tabs li.tab a').hover(function() {
    //     //     $('#tab3').addClass('active').find('li.tab').show().css({'background-color':'lavender'});
    //     // });
    //
    //     //$('#edu_special').hide();
    //     $('#register_doc').show();
    // });
    //
    // $('#education_pharma').click(function () {
    //     var qualification = $('#qualification').val();
    //     var college = $('#college').val();
    //
    //     var completion_year = $('#completion_year').val();
    //     var batch_from = $('#batch_from').val();
    //     var batch_to = $('#batch_to').val();
    //     var specialization = $('#specialization').val();
    //     var data = {
    //         qualification: qualification,
    //         college: college,
    //         completion: completion_year,
    //         batch_from :batch_from,
    //         batch_to : batch_to,
    //         specialization: specialization
    //     };
    //     $.ajax({
    //         url: '/pharma_education',
    //         type: 'POST',
    //         data: JSON.stringify(data),
    //         contentType: 'application/json',
    //         success: function (result) {
    //             if (result.success === 'success') {
    //                 Materialize.toast(result.message, 1000);
    //             }
    //             else {
    //                 Materialize.toast(result.message, 1000);
    //             }
    //         }
    //     });
    //     $('#edu_special').hide();
    //     $('#register_doc').show();
    // });

    $('#edu_special').hide();
    $('#basic_details').click(function () {
        var title = $('#title').val();
        var name = $('#name').val();
        var gender = $("input[type='radio'][name='gender']:checked").val();
        var city = $('#city').val();
        var experience = $('#year_of_experience').val();
        var about = $('#about_you').val();
        var email = $('#email').val();
        var data = {
            title: title,
            name: name,
            gender: gender,
            city: city,
            experience: experience,
            about: about,
            email : email
        };
        event.preventDefault();
        event.stopPropagation();
        $.ajax({
            url: '/health/basic',
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

    $('#edu_special').hide();
    $('#basic_details_pharma').click(function () {
        var title = $('#title').val();
        var name = $('#name').val();
        var gender = $("input[type='radio'][name='gender']:checked").val();
        var city = $('#city').val();
        var experience = $('#year_of_experience').val();
        var about = $('#about_you').val();
        var email = $('#email').val();
        var data = {
            title: title,
            name: name,
            gender: gender,
            city: city,
            experience: experience,
            about: about,
            email : email
        };
        $.ajax({
            url: '/health/pharma_basic',
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
        event.preventDefault();
        event.stopPropagation();
        $.ajax({
            url: '/health/education',
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
        event.preventDefault();
        event.stopPropagation();
        $.ajax({
            url: '/health/pharma_education',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                if (result.success === 'success') {
                    Materialize.toast(result.message, 1000);
                }
                else {
                    Materialize.toast(result.message, 1000);
                    return false;
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

        var data = {
            council_number: council_number,
            council_name: council_name,
            council_year: council_year
        };
        $.ajax({
            url: '/health/certificate',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                if(result.success === 'success') {
                    Materialize.toast(result.message,1000);
                }
                else{
                    Materialize.toast(result.message,1000);
                }
            }
        });
    });

    $('.upload_image1_pharma').submit(function () {
        var council_number = $('#council_reg_no').val();
        var council_name = $('#council_name').val();
        var council_year = $('#council_year').val();

        var data = {
            council_number: council_number,
            council_name: council_name,
            council_year: council_year
        };
        $.ajax({
            url: '/health/pharma_certificate',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                if(result.success === 'success') {
                    Materialize.toast(result.message,1000);
                }
                else{
                    Materialize.toast(result.message,1000);
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

    // ------------------------------------ Brand , molecule and disease list in form -------------------- //
    $("#brand_name").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: "/health/brandsdata",
                type: "POST",
                data: request,  // request is the value of search input
                success: function (data) {
                    // Map response values to fiedl label and value
                    response($.map(data, function (el) {
                        return {
                            label: el.brand_name
                        };
                    }));
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
            //$('#quicksearch').submit();
        }
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
