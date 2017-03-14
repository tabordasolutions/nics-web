/**
 * Created by weavert on 3/9/17.
 */
var loginpage = function($, w, moment) {

    var pageData = {};

    function setPageDate(data) {
        pageData = data;
    }
    function switchWorkspace(selectobj) {
        // document.getElementById("currentWorkspace").value = newWorkspace;
        if ($(selectobj.target).val() != " ") {
            $('#currentWorkspace').val($(selectobj.target).val());
            document.forms["frmWorkspace"].submit();
        }
    }

    function setWorkspace() {
        //set the list of workspaces.
        pageData.workspaces.forEach(function (item) {
            $('#server').append('<option value="' + item.id + '">' + item.name + '</option>')
        })
        var currentWorkspace = getQueryVariable("currentWorkspace");
        if (currentWorkspace) {
            document.getElementById('server').value = currentWorkspace;
        }
        else {
            document.getElementById("server").selectedIndex = 0;
        }
        $('#server').change(switchWorkspace);
    }

    function setAnnouncements() {

        pageData.announcements.sort(function(a, b) {
            return a.createdate - b.createdate;
        }).reverse();
        pageData.announcements.forEach(function(item) {
            $('#announcements').append('<ul><b>' + moment(item.createdate).format('M-D-YYYY h:mm a') + '</b> '
                + item.message + '</ul>');
        })
    }

    function getQueryVariable(variable)
    {
        var query = w.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
        }
        return(false);
    }

    return {
        setPageData : setPageDate,
        switchWorkspace : switchWorkspace,
        setWorkspace : setWorkspace,
        setAnnouncements : setAnnouncements
    }

}(jQuery, window, moment)

