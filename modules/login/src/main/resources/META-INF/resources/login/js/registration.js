var registration = function($) {
    var orgLookupData = {};
    var initialized = false;

    var $formStep1, $formStep2,$formStep3,$formStep4; //Form selector cache.
    var $dialogStep1, $dialogStep2,$dialogStep3,$dialogStep4,$dialogConfirmation,$dialogError; //Dialog selector cache.
    var $selectOrgType, $selectOrg, $selectImtUSAR, $selectImtFed, $selectImtCDF, $selectImtLocal; //Select selector cache.

    var endpointRoot = "";
    var orgtypesService = "organizationTypes";
    var orgsService = "organizations";
    var registrationService = "register";
    var termsUrl = "login/html/terms.html";
    var termsElement = "#tc_content";

    function setEndPointRoot(root) {
        endpointRoot = root;
    }

    function setTermsUrl(url) {
        termsUrl = url;
    }

    function init() {

        if (!initialized) {
            //Selector cache
            $formStep1 = $('#formStep1');
            $formStep2 = $('#formStep2');
            $formStep3 = $('#formStep3');
            $formStep4 = $('#formStep4');

            $dialogStep1 = $('#step1');
            $dialogStep2 = $('#step2');
            $dialogStep3 = $('#step3');
            $dialogStep4 = $('#step4');
            $dialogConfirmation = $('#regConfirmation');
            $dialogError = $('#errordialog');

            $selectOrgType = $('#selectOrgAffiliates');
            $selectOrg = $('#selectOrganizations');

            $selectImtCDF = $('#selectCDFIMT');
            $selectImtFed = $('#selectFedIMT');
            $selectImtLocal = $('#selectLocalIMT');
            $selectImtUSAR = $('#selectUSAR');

            $($formStep1).validator().on('submit', doStep2);

            $($formStep2).validator().on('submit', doStep3);

            $($formStep3).validator().on('submit', doStep4);
            $($formStep4).validator().on('submit', doRegistration);
            $($formStep1).on('reset', onResetForm1);
            $($formStep2).on('reset', onResetForm2);
            $($formStep3).on('reset', onResetForm3);
            $($formStep4).on('reset', onResetForm4);

            //Watch for focusout on the email field so we can convert to lowercase
            $('#regemail').focusout(function() {this.value = this.value.toLowerCase();})

            //Load the T&C content externally.
            $('#tc_content').load(termsUrl + " " + termsElement);
            $("#phone").mask("(999) 999-9999");

            populateOrgData();
            initialized = true;
        }


    }

    function resetDialogSequence() {
        $($formStep1)[0].reset();
        $($formStep2)[0].reset();
        $($formStep3)[0].reset();
        $($formStep4)[0].reset();
        $($dialogStep1).removeClass('hidden');
        $($dialogStep2).addClass('hidden');
        $($dialogStep3).addClass('hidden');
        $($dialogStep4).addClass('hidden');
        $($dialogConfirmation).addClass('hidden');
        $($dialogError).addClass('hidden');

    }
    function onResetForm1() {
        //Need to handle redraw of the BS Select dropdowns since only the bound <select> element.
        // is reset.
        setTimeout(function() {
            $('.selectpicker', $formStep1).selectpicker('render');
            $('#btnNext1').prop('disabled', 'disabled');
        },0); //Set Timeout so that this code block doesn't get exec'd before the form reset happens.


    }
    function onResetForm2() {
    }
    function onResetForm3() {
        setTimeout(function() {
            $('.selectpicker', $formStep3).selectpicker('render');
        },0); //Set Timeout so that this code block doesn't get exec'd before the form reset happens.
    }
    function onResetForm4() {
        setTimeout(function() {
            $($formStep4).validator('update');
        },0); //Set Timeout so that this code block doesn't get exec'd before the form reset happens.
    }

    function populateOrgData() {
        var orgtypesUrl = endpointRoot + orgtypesService;
        var orgsUrl = endpointRoot + orgsService;

        $.when($.get(orgtypesUrl),$.get(orgsUrl))
            .then(function(orgtypesResult, orgsResult) {

                orgLookupData.organizationTypes = createLookup(orgtypesResult[0].organizationTypes); //stuff in global for events to use.
                orgLookupData.organizations = createLookup(orgsResult[0].organizations);

                var sortableOrgTypes = [];
                //Push the object into an array for sorting.
                for (var orgType in orgLookupData.organizationTypes) {
                    sortableOrgTypes.push([orgType, orgLookupData.organizationTypes[orgType]]);
                }

                //sort by name before populating the select options.
                sortableOrgTypes.sort(sortobjArrayByName);
                //populate the options now that they are sorted properly.
                populateSelect($($selectOrgType),sortableOrgTypes);
                $($selectOrgType).selectpicker('refresh'); //Refresh because we just added a bunch of items

                //Extract the organizations of four specific OrgTypes: 'USAR', 'Federal IMT', 'CDF IMT', and 'Other Local IMT'
                // Put those organizations as options, each having its own dropdown list.
                populateSelect($($selectImtUSAR),getOrgsData(orgLookupData,"USAR").sort(sortobjArrayByName));
                $($selectImtUSAR).selectpicker('refresh');
                populateSelect($($selectImtFed),getOrgsData(orgLookupData,"Federal IMT").sort(sortobjArrayByName));
                $($selectImtFed).selectpicker('refresh');
                populateSelect($($selectImtCDF),getOrgsData(orgLookupData,"CDF IMT").sort(sortobjArrayByName));
                $($selectImtCDF).selectpicker('refresh');
                populateSelect($($selectImtLocal),getOrgsData(orgLookupData,"Other Local IMT").sort(sortobjArrayByName));
                $($selectImtLocal).selectpicker('refresh');
                return true;
            })
            .fail(function(result, errortext, error) {
                console.log(errortext);
                console.log(error);
                $($dialogStep1).addClass('hidden');
                doError('Failed to get Organization Data from server.');
                return false;
            });

        //Create a lookup map for easy filtering.
        // Takes in an array of objects.
        // Each object must have an id property.
        // return a lookup object with the ids as properties (keys) to the object.
        function createLookup(arrIdTypes) {
            var lookup = {};

            //turn the id into a property to make this into a map(idTypeid,idType).
            arrIdTypes.forEach(function(idType) {
                lookup[idType.id] = idType;
            });
            return lookup;
        }
    }

    function onOrgAffilliatesChanged() {
        $('#selectOrganizations').removeAttr('disabled');
        $('#btnNext1').attr('disabled', 'disabled');
        filterOrgs($('#selectOrgAffiliates').val());

    }

    function onOrgChanged() {
        console.log($('#selectOrganizations').val());
        $('#btnNext1').prop('disabled', false);
    }
    function filterOrgs(OrgAffiliateId) {
        //Get the organizationIds for the selected Affiliate.
        var organizationIds = orgLookupData.organizationTypes[OrgAffiliateId].organizationIds;
        // console.log('OrgType id(s): ' + JSON.stringify(organizationIds) );
        //get the associated orgs.
        //add each of the associated orgs into a sortable array (again)
        var sortableOrgs = [];
        organizationIds.forEach(function(orgid) {
            sortableOrgs.push([orgid,orgLookupData.organizations[orgid]]);
        });
        sortableOrgs.sort(sortobjArrayByName);

        $($selectOrg).empty(); //clear out the select first.
        //populate the options now that they are sorted properly.
        populateSelect($($selectOrg),sortableOrgs);
        $($selectOrg).selectpicker('refresh'); //Refresh because we just added a bunch of items

    }

    function sortobjArrayByName(a,b) {
        var nameA = a[1].name.toUpperCase(); // ignore upper and lowercase
        var nameB = b[1].name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }

        // names must be equal
        return 0;
    }

    function getOrgsData(orgdata, orgTypeName) {
        var orgsData = []; //Return value;

        var matches = $.grep(Object.keys(orgdata.organizationTypes),function(orgTypeId) {
            return orgdata.organizationTypes[orgTypeId].name == orgTypeName;
        });
        if (matches > 0)
        {
            var orgTypeId = matches[0];
            orgdata.organizationTypes[orgTypeId].organizationIds.forEach(function(orgId) {
                orgsData.push([orgId,orgdata.organizations[orgId]]); //Another sortable array of objects.
            })

        }

        return orgsData;
    }

    function populateSelect(selectElem, selectData) {
        selectData.forEach(function (item) {
            $(selectElem).append('<option value="' + item[0] + '">' + item[1].name + '</option>')
        })

    }

    function checkForClear(selectobj) {
        if (selectobj.selectedIndex === 1) { //Then --clear-- option was selected.
            selectobj.selectedIndex = 0;
        }
    }



    function doStep1() {
        //No need to handle an event here since doStep1 is only called from step2 '<< Previous'
        $($dialogStep2).toggleClass('hidden');
        $($dialogStep1).toggleClass('hidden');
    }


    function doStep2(event) {
        if (event == null || event.target.id == 'formStep3') {
            $($dialogStep3).toggleClass('hidden');
            $($dialogStep2).toggleClass('hidden');
        }
        else {
            $($dialogStep1).toggleClass('hidden');
            $($dialogStep2).toggleClass('hidden');
            $('#firstname').focus();
            event.preventDefault();
        }






    }

    function doStep3(event) {

        if (event == null || event.target.id == 'formStep4') {
            //Then we came from step 4. Act accordingly.
            $($dialogStep4).toggleClass('hidden');
            $($dialogStep3).toggleClass('hidden');
        }
        else {
            //We came from step2. Check validation, then decide what to do.
            if (!event.isDefaultPrevented()) {
                //The form is validated.
                $($dialogStep2).toggleClass('hidden');
                $($dialogStep3).toggleClass('hidden');
                event.preventDefault(); //don't let the form post anywhere.
            }
            //Otherwise don't do anything, the user is left on the step2 dialog with a validation error.

        }


    }
    function doStep4(event) {
        $($dialogStep3).toggleClass('hidden');
        $($dialogStep4).toggleClass('hidden');

        $('#verifyorgname').text($('option:selected', $selectOrg).text());
        $('#verifyorgtype').text($('option:selected', $selectOrgType).text());
        $('#verifyemail').text($('#regemail').val());

        event.preventDefault();
    }
    function tcclick() {
        if ($('#chkAgreeTC').prop('checked') == true) {
            $('#termsandconditions').removeClass('errorborder');
            $('#tchelp').addClass('hidden');
        }
        else {
            $('#termsandconditions').addClass('errorborder');
            $('#tchelp').removeClass('hidden');
        }
    }
    function doRegistration(event) {
        if (event.isDefaultPrevented()) {
            //Since the user must scroll through the T&C's themselves,
            // we can't highlight the checkbox for them. Highlight the T&C div container instead.
            $('#termsandconditions').addClass('errorborder');
            $('#tchelp').removeClass('hidden');
        }
        else {
            var postData = createPostData();
            //Send the data and handle response.
            var registrationUrl = endpointRoot + registrationService;
            console.log(JSON.stringify(postData));

            $.ajax({
                method: "POST",
                url:    registrationUrl,
                dataType:   "json",
                contentType: "application/json",
                data:   JSON.stringify(postData)
            })
                .done(function (data) {
                    console.log("Registration response: " + JSON.stringify(data));
                    $($dialogStep4).toggleClass('hidden');
                    $($dialogConfirmation).toggleClass('hidden');
                })
                .fail(function (result, errortext, error) {
                    $($dialogStep4).toggleClass('hidden');

                    errortext = "The server encountered an error while processing your registration request. Please try your request again. " +
                        "If this error continues, please email <a href=\"mailto:scout@caloes.ca.gov\">scout@caloes.ca.gov</a>";
                    var errorResponse  = result.status + " - " + errortext;
                    var responseJson = result.responseJSON;
                    if (responseJson) {
                        console.log(responseJson);
                        errorResponse = responseJson.message;
                    }
                    errortext += "<p class=\"errorResponse\"> Error: " + errorResponse + "</p>";
                    doError(errortext);
                });

            event.preventDefault(); //don't let the form post anywhere.
        }

    }
    function createPostData() {

        //create an array of teams from IMT selections.
        var teams = [
            $('#selectCDFIMT').val(),
            $('#selectFedIMT').val(),
            $('#selectUSAR').val(),
            $('#selectLocalIMT').val()
        ];

        var data = {};
        data.organizationTypeId = $('#selectOrgAffiliates').val();
        data.organizationId = $('#selectOrganizations').val();
        data.firstName = $('#firstname').val();
        data.lastName = $('#lastname').val();
        data.email = $('#regemail').val();
        data.password = $('#regpassword').val();
        data.phone = $('#phone').val();
        data.teams = teams.filter(function(val) {
            return val != "";
        });
        return data;
    }
    function doError(message) {
        $('#errormessage').html(message);
        $($dialogError).removeClass('hidden');
    }

    return {
        init: init,
        resetDialogSequence: resetDialogSequence,
        onOrgAffilliatesChanged: onOrgAffilliatesChanged,
        onOrgChanged : onOrgChanged,
        doStep1: doStep1,
        doStep2: doStep2,
        doStep3: doStep3,
        doStep4: doStep4,
        doRegistration: doRegistration,
        doError: doError,
        checkForClear: checkForClear,
        setEndPointRoot: setEndPointRoot,
        setTermsUrl : setTermsUrl,
        tcclick:tcclick
    }
}(jQuery);

