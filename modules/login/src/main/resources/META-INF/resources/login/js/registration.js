/**
 * Created by weavert on 2/24/17.
 */
var orgLookupData = {};
var bInitialized = false;

function initRegistration() {

    if (!bInitialized) {

        $('#formStep1').validator().on('submit', doStep2);
        $('#formStep2').validator().on('submit', doStep3);
        $('#formStep3').validator().on('submit', doStep4);
        $('#formStep4').validator().on('submit', doRegistration);
        $('#formStep1').on('reset', onResetForm1);
        $('#formStep2').on('reset', onResetForm2);
        $('#formStep3').on('reset', onResetForm3);
        $('#formStep4').on('reset', onResetForm4);

        //Load the T&C content externally.
        $('#tc_content').load('login/html/terms.html #tc_content');
        $("#phone").mask("(999) 999-9999");

        populateOrgData();
        bInitialized = true;
    }


}

function resetDialogSequence() {
    $('#formStep1')[0].reset();
    $('#formStep2')[0].reset();
    $('#formStep3')[0].reset();
    $('#formStep4')[0].reset();
    $('#step1').removeClass('hidden');
    $('#step2').addClass('hidden');
    $('#step3').addClass('hidden');
    $('#step4').addClass('hidden');
    $('#regConfirmation').addClass('hidden');
    $('#errordialog').addClass('hidden');

}
function onResetForm1(e) {
    //Need to handle redraw of the BS Select dropdowns since only the bound <select> element.
    // is reset.
    setTimeout(function() {
        $('#formStep1 .selectpicker').selectpicker('render');
        $('#btnNext1').prop('disabled', 'disabled');
    },0); //Set Timeout so that this code block doesn't get exec'd before the form reset happens.


}
function onResetForm2(e) {
}
function onResetForm3(e) {
    setTimeout(function() {
        $('#formStep3 .selectpicker').selectpicker('render');
    },0); //Set Timeout so that this code block doesn't get exec'd before the form reset happens.
}
function onResetForm4(e) {
    setTimeout(function() {
        $('#formStep4').validator('update');
    },0); //Set Timeout so that this code block doesn't get exec'd before the form reset happens.
}

function populateOrgData() {
    var orgtypesUrl = "organizationTypes";
    var orgsUrl = "organizations";

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
            populateSelect($('#selectOrgAffiliates'),sortableOrgTypes);
            $('#selectOrgAffiliates').selectpicker('refresh'); //Refresh because we just added a bunch of items

            //Extract the organizations of four specific OrgTypes: 'USAR', 'Federal IMT', 'CDF IMT', and 'Other Local IMT'
            // Put those organizations as options, each having its own dropdown list.
            populateSelect($('#selectUSAR'),getOrgsData(orgLookupData,"USAR").sort(sortobjArrayByName));
            $('#selectUSAR').selectpicker('refresh');
            populateSelect($('#selectFedIMT'),getOrgsData(orgLookupData,"Federal IMT").sort(sortobjArrayByName));
            $('#selectFedIMT').selectpicker('refresh');
            populateSelect($('#selectCDFIMT'),getOrgsData(orgLookupData,"CDF IMT").sort(sortobjArrayByName));
            $('#selectCDFIMT').selectpicker('refresh');
            populateSelect($('#selectLocalIMT'),getOrgsData(orgLookupData,"Other Local IMT").sort(sortobjArrayByName));
            $('#selectLocalIMT').selectpicker('refresh');
            return true;
        })
        .fail(function(result, errortext, error) {
            //TODO: Make this better.
            console.log(errortext);
            console.log(error);
            $('#step1').addClass('hidden');
            doError('Failed to get Organization Data from server.')
            return false;
        })

    //Create a lookup map for easy filtering.
    // Takes in an array of objects.
    // Each object must have an id property.
    // return a lookup object with the ids as properties (keys) to the object.
    function createLookup(arrIdTypes) {
        var lookup = {};

        //turn the id into a property to make this into a map(idTypeid,idType).
        arrIdTypes.forEach(function(idType) {
            lookup[idType.id] = idType;
        })
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
    // console.log('Org Affilated Id: ' + OrgAffiliateId);
    //Get the organizationIds for the selected Affiliate.
    var organizationIds = orgLookupData.organizationTypes[OrgAffiliateId].organizationIds;
    // console.log('OrgType id(s): ' + JSON.stringify(organizationIds) );
    //get the associated orgs.
    //add each of the associated orgs into a sortable array (again)
    var sortableOrgs = [];
    organizationIds.forEach(function(orgid) {
        sortableOrgs.push([orgid,orgLookupData.organizations[orgid]]);
    })
    sortableOrgs.sort(sortobjArrayByName);

    $('#selectOrganizations').empty(); //clear out the select first.
    //populate the options now that they are sorted properly.
    populateSelect($('#selectOrganizations'),sortableOrgs)
    $('#selectOrganizations').selectpicker('refresh'); //Refresh because we just added a bunch of items

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
    })
    if (matches > 0)
    {
        var orgTypeId = matches[0]
        orgdata.organizationTypes[orgTypeId].organizationIds.forEach(function(orgId) {
            orgsData.push([orgId,orgdata.organizations[orgId]]) //Another sortable array of objects.
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
    $('#step2').toggleClass('hidden');
    $('#step1').toggleClass('hidden');
}


function doStep2(event) {
    if (event == null || event.target.id == 'formStep3') {
        $('#step3').toggleClass('hidden')
        $('#step2').toggleClass('hidden');
    }
    else {
        $('#step1').toggleClass('hidden');
        $('#step2').toggleClass('hidden');
        $('#firstname').focus();
    }



    event.preventDefault();


}

function doStep3(event) {

    if (event == null || event.target.id == 'formStep4') {
        //Then we came from step 4. Act accordingly.
        $('#step4').toggleClass('hidden');
        $('#step3').toggleClass('hidden');
    }
    else {
        //We came from step2. Check validation, then decide what to do.
        if (!event.isDefaultPrevented()) {
            //The form is validated.
            $('#step2').toggleClass('hidden');
            $('#step3').toggleClass('hidden');
            event.preventDefault(); //don't let the form post anywhere.
        }
        //Otherwise don't do anything, the user is left on the step2 dialog with a validation error.

    }


}
function doStep4(event) {
    $('#step3').toggleClass('hidden');
    $('#step4').toggleClass('hidden');

    $('#verifyorgname').text($('#selectOrganizations option:selected').text())
    $('#verifyorgtype').text($('#selectOrgAffiliates option:selected').text())
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
        //TODO: Send the data and handle response.
        console.log(JSON.stringify(postData));
        $('#step4').toggleClass('hidden');
        $('#regConfirmation').toggleClass('hidden');
        event.preventDefault(); //don't let the form post anywhere.
    }

}
function createPostData() {
    var data = {};
    data.organizationTypeId = $('#selectOrgAffiliates').val();
    data.organizationId = $('#selectOrganizations').val();
    data.firstname = $('#firstname').val();
    data.lastname = $('#lastname').val();
    data.email = $('#regemail').val();
    data.password = $('#regpassword').val();
    data.phone = $('#phone').val();
    data.imtCdfId = $('#selectCDFIMT').val();
    data.imtFederalId = $('#selectFedIMT').val();
    data.imtUsarId = $('#selectUSAR').val();
    data.imtLocalId = $('#selectLocalIMT').val();
    return data;
}
function doError(message) {
    $('#errormessage').text(message);
    $('#errordialog').removeClass('hidden');
}
