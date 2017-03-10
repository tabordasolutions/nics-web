/**
 * Created by weavert on 3/9/17.
 */
function loadAnnouncements() {
    var newWorkspace = document.getElementById("server").value;
    document.getElementById("currentWorkspace").value = newWorkspace;
    if (newWorkspace != " ") {
        document.forms["workspaceAnnouncements"].submit();
    }
}

function setWorkspace() {
    var currentWorkspace = getQueryVariable("currentWorkspace");
    if (currentWorkspace) {
        document.getElementById('server').value = currentWorkspace;
        //document.getElementById("server").selectedIndex =
    }
    else {
        document.getElementById("server").selectedIndex = 0;
    }
}
function validateForm() {
    var x = document.forms["login"]["server"].value;
    if (x == null || x == " ") {
        alert("Please choose a server");
        return false;
    }
}
function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}
