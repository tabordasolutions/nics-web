<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="json" uri="http://www.atg.com/taglibs/json" %>
<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>Welcome to SCOUT</title>
        <link rel="apple-touch-icon" sizes="57x57" href="https://www.scout.ca.gov/static/uploads/favicons/apple-touch-icon-57x57.png">
        <link rel="apple-touch-icon" sizes="60x60" href="https://www.scout.ca.gov/static/uploads/favicons/apple-touch-icon-60x60.png">
        <link rel="apple-touch-icon" sizes="72x72" href="https://www.scout.ca.gov/static/uploads/favicons/apple-touch-icon-72x72.png">
        <link rel="apple-touch-icon" sizes="76x76" href="https://www.scout.ca.gov/static/uploads/favicons/apple-touch-icon-76x76.png">
        <link rel="apple-touch-icon" sizes="114x114" href="https://www.scout.ca.gov/static/uploads/favicons/apple-touch-icon-114x114.png">
        <link rel="apple-touch-icon" sizes="120x120" href="https://www.scout.ca.gov/static/uploads/favicons/apple-touch-icon-120x120.png">
        <link rel="apple-touch-icon" sizes="144x144" href="https://www.scout.ca.gov/static/uploads/favicons/apple-touch-icon-144x144.png">
        <link rel="apple-touch-icon" sizes="152x152" href="https://www.scout.ca.gov/static/uploads/favicons/apple-touch-icon-152x152.png">
        <link rel="apple-touch-icon" sizes="180x180" href="https://www.scout.ca.gov/static/uploads/favicons/apple-touch-icon-180x180.png">
        <link rel="icon" type="image/png" href="https://www.scout.ca.gov/static/uploads/favicons/favicon-32x32.png" sizes="32x32">
        <link rel="icon" type="image/png" href="https://www.scout.ca.gov/static/uploads/favicons/android-chrome-192x192.png" sizes="192x192">
        <link rel="icon" type="image/png" href="https://www.scout.ca.gov/static/uploads/favicons/favicon-96x96.png" sizes="96x96">
        <link rel="icon" type="image/png" href="https://www.scout.ca.gov/static/uploads/favicons/favicon-16x16.png" sizes="16x16">
        <link rel="manifest" href="https://www.scout.ca.gov/static/uploads/favicons/manifest.json">
        <link rel="mask-icon" href="https://www.scout.ca.gov/static/uploads/favicons/safari-pinned-tab.svg" color="#5bbad5">
        <meta name="msapplication-TileColor" content="#da532c">
        <meta name="msapplication-TileImage" content="https://www.scout.ca.gov/static/uploads/favicons/mstile-144x144.png">
        <meta name="theme-color" content="#ffffff">
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="login/css/bootstrap.css">
        <link rel="stylesheet" href="login/css/bootstrap-select.min.css">
        <link rel="stylesheet" href="login/css/register.css">

        <script src="login/js/jquery-3.1.1.min.js"></script>
        <script src="login/js/bootstrap.js"></script>
        <script src="login/js/bootstrap-select.min.js"></script>
        <script src="login/js/validator.min.js"></script>
        <script src="login/js/jquery.maskedinput.min.js"></script>
        <script src="login/js/moment.min.js"></script>
        <script src="login/js/registration.js"></script>
        <script src="login/js/login.js"></script>
    </head>
    <body>

    <div class="container">
        <form id="frmWorkspace" action="login" method="get">
            <input type="hidden" id="currentWorkspace" name="currentWorkspace" />
        </form>

        <form id="login" action="login" method="post">
            <div>
                <div style="display: table;margin: 0 auto">
                    <div class="text-center"><img src="login/images/scout_logo.png" height="290px" /></div>
                    <div class="form-group form-inline text-center col-xs-12 hidden">
                        <label for="method">Login Method:</label>
                        <select id="method" name="method" class="form-control">
                            <option value="">OpenAM</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="server">Workspace:</label>
                        <select id="server" class="form-control" name="workspace" style="width:auto;display: inline-block" required>

                        </select>
                    </div>
                    <div class="form-group ">
                        <label for="email" class="sr-only">Email:</label>
                        <div class="input-group" style="width:100%">
                            <span class="input-group-addon glyphicon glyphicon-envelope" style="top: 0"></span>
                            <input type="email" id="email" name="email" autofocus="autofocus" class="form-control" placeholder="Email" required/>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="password" class="sr-only">Password:</label>
                        <div class="input-group" style="width: 100%">
                            <span class="input-group-addon glyphicon glyphicon-lock" style="top: 0"></span>
                            <input type="password" id="password" name="password" placeholder="Password" class="form-control" required/>
                        </div>
                    </div>
                    <div class="form-group text-center">
                        <button type="submit" class="btn btn-success" style="width:150px">Login</button>
                    </div>
                    <div class="form-group col-sm-12 text-center">
                        <button id="btnRegister" type="button" class="btn btn-sm btn-primary" style="width:150px" data-toggle="modal" data-backdrop="static" data-target="#modalRegistration">Register</button>
                    </div>
                    <div class="form-group col-sm-12 text-center">
                        <a href="./forgotpassword"><button id="btnForgotPwd" type="button" style="width:150px" class="btn btn-sm btn-warning">Forgotten Password?</button></a>
                    </div>
                    <div class="clearfix"></div>
                    <div class= "panel panel-default" >
                        <div class="panel-heading text-center">
                            <h3>Announcements</h3>
                        </div>
                        <div class="panel-body">
                            <ul id="announcements">

                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        </form>



        <div id="modalRegistration" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="modalRegistrationLabel">
            <div class="modal-dialog" role="document">
                <div id="step1" class="modal-content">
                    <form id="formStep1" role="form">
                        <div class="modal-header text-center">
                            <h3>Registration Step 1 of 4</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vel laoreet nisi, ac egestas dui. Nullam libero nibh, sodales cursus dictum id, mollis vitae augue.
                                Fusce quis erat rutrum, posuere odio eu, convallis erat. Ut venenatis est risus, sed lobortis massa consectetur nec. Suspendisse vehicula risus vel dapibus bibendum.</p>

                        </div>
                        <div class="modal-body">


                            <div style="display: table;margin: auto;width: 80%">
                                <div class="form-group">
                                    <label for="selectOrgAffiliates" class="sr-only">Choose an Organization Type</label>
                                    <select id="selectOrgAffiliates" class="selectpicker form-control show-menu-arrow" title="Choose an Organization Type" onchange="onOrgAffilliatesChanged()"></select>
                                </div>
                                <div class="text-center"><p><span class="glyphicon glyphicon-arrow-down" aria-hidden="true" style="color: #337ab7"></span>then...</p></div>
                                <div class="form-group">
                                    <label for="selectOrganizations" class="sr-only">Choose an Organization</label>
                                    <select id="selectOrganizations" class="selectpicker form-control show-menu-arrow" title="Choose an Organization" onchange="onOrgChanged()" disabled></select>
                                </div>
                            </div>

                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                            <button  id="btnNext1" type="submit" class="btn btn-success" disabled>Next >></button>
                        </div>
                    </form>
                </div><!-- /.modal-content -->
                <div id="step2" class="modal-content hidden">
                    <form id="formStep2" role="form">
                        <div class="modal-header text-center">
                            <h3>Registration Step 2 of 4</h3>
                            <p>Please fill in the required account information.</p>

                        </div>
                        <div class="modal-body">
                            <div style="display: table;margin: auto;width: 90%">


                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <div class="input-group" style="width:100%">
                                            <span class="input-group-addon glyphicon glyphicon-user" style="top: 0"></span>
                                            <label for="firstname" class="sr-only">First Name</label>
                                            <input type="text" id="firstname" class="form-control requiredtext"
                                                   placeholder="First Name" required>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <div class="input-group" style="width:100%">
                                            <span class="input-group-addon glyphicon glyphicon-user" style="top: 0"></span>
                                            <input type="text" id="lastname"
                                                   class="form-control requiredtext"
                                                   placeholder="Enter Last Name" required></div>
                                    </div>
                                </div>
                                <div class="col-xs-12">
                                    <div class="form-group">
                                        <div class="input-group" style="width:100%">
                                            <span class="input-group-addon glyphicon glyphicon-envelope" style="top: 0"></span>
                                            <input type="email" id="regemail"
                                                   class="form-control requiredtext"
                                                   placeholder="Work email"
                                                   data-error="Invalid Email Address"
                                                   pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$" required>

                                        </div>
                                        <div class="help-block with-errors"></div>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <!-- New pattern: pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%_!-])[a-zA-Z0-9@#$%_!-]{8,20}$" -->
                                    <!-- Pattern Used in em-api: pattern="((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%!_-]).{8,20})" -->
                                    <div class="form-group">
                                        <div class="input-group" style="width:100%">
                                            <span class="input-group-addon glyphicon glyphicon-lock" style="top: 0"></span>
                                            <input type="password" id="regpassword"
                                                   class="form-control requiredtext"
                                                   placeholder="Password"
                                                   maxlength="20"
                                                   pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%_!-])[a-zA-Z0-9@#$%_!-]{8,20}$"
                                                   required>
                                        </div>
                                        <div class="help-block">8-20 characters with at least one digit,
                                            one upper case letter, one lower case letter and one special symbol @#$%-_!</div>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <div class="input-group" style="width:100%">
                                            <span class="input-group-addon glyphicon glyphicon-lock" style="top: 0"></span>
                                            <input type="password" id="confirmpregassword"
                                                   class="form-control requiredtext"
                                                   placeholder="Confirm Password"
                                                   data-match="#regpassword"
                                                   maxlength="20"
                                                   data-match-error="Passwords don't match." required>

                                        </div>
                                        <div class="help-block with-errors"></div>
                                    </div>
                                </div>

                            </div>

                        </div>
                        <div class="modal-footer">

                            <button id="btnPrev2" type="button" class="btn btn-primary" onclick="doStep1()"><< Previous</button>
                            <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                            <button id="btnNext2" type="submit" class="btn btn-success">Next >>
                            </button>
                        </div>
                    </form>
                </div><!-- /.modal-content -->
                <div id="step3" class="modal-content hidden">
                    <form id="formStep3" role="form">
                        <div class="modal-header text-center">
                            <h3>Registration Step 3 of 4</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vel laoreet nisi, ac egestas dui. Nullam libero nibh, sodales cursus dictum id, mollis vitae augue.
                                Fusce quis erat rutrum, posuere odio eu, convallis erat. Ut venenatis est risus, sed lobortis massa consectetur nec. Suspendisse vehicula risus vel dapibus bibendum.</p>
                        </div>
                        <div class="modal-body">
                            <div class="text-center" style="display: table;margin: auto">
                                <div style="display: table;margin: auto;width: 60%">
                                    <div class="form-group">
                                        <div class="input-group" style="width:100%">
                                            <span class="input-group-addon glyphicon glyphicon-phone" style="top: 0"></span>
                                            <input type="tel" id="phone" class="form-control" placeholder="Primary Phone">
                                        </div>
                                    </div>
                                </div>
                                <hr/>
                                <h4>Are you a member of an Incident Management Team?</h4>
                                <div class="col-sm-6" ><select id="selectCDFIMT" class="selectpicker form-control selectform" onchange="checkForClear(this)" title="CDF IMT"><option value="">--clear--</option></select></div>
                                <div class="col-sm-6"><select id="selectFedIMT" class="selectpicker form-control selectform" onchange="checkForClear(this)" title="Federal IMT"><option value="">--clear--</option></select></div>
                                <div class="col-sm-6" ><select id="selectLocalIMT" class="selectpicker form-control selectform" onchange="checkForClear(this)" title="Other Local IMT"><option value="">--clear--</option></select></div>
                                <div class="col-sm-6"><select id="selectUSAR" class="selectpicker form-control selectform" onchange="checkForClear(this)" title="USAR" ><option value="">--clear--</option></select></div>
                            </div>

                        </div>
                        <div class="modal-footer">

                            <button  id="btnPrev3" type="button" class="btn btn-primary" onclick="doStep2()"><< Previous</button>
                            <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                            <button  id="btnNext3" type="submit" class="btn btn-success">Next >></button>
                        </div>
                    </form>
                </div><!-- /.modal-content -->
                <div id="step4" class="modal-content hidden">
                    <form  id="formStep4" role="form">
                        <div class="modal-header text-center">
                            <h3>Registration Step 4 of 4</h3>
                            <p>Read through the Terms and Conditions and accept at the bottom to finish your
                                registration request.</p>
                        </div>
                        <div class="modal-body">
                            <div style="display: table;margin: auto">
                                <div id="termsandconditions" class="termsandconditions">

                                    <div id="tc_content">

                                    </div>
                                    <div class="checkbox">
                                        <label style="font-weight: bold">
                                            <input id="chkAgreeTC" type="checkbox" onclick="tcclick()" required>
                                            I HAVE READ THE ABOVE AND UNDERSTAND THE POLICY REGARDING MISUSE OF ALL
                                            ACCESSIBLE INFORMATION. I UNDERSTAND THAT BY CHECKING BELOW, I AGREE TO ALL
                                            TERMS AND CONDITIONS AND ANY VIOLATION THEREOF MAY RESULT IN REVOCATION OF
                                            ACCESS TO SCOUT AS WELL AS CIVIL AND CRIMINAL PENALTY.
                                        </label>
                                    </div>
                                </div>
                                <div id="tchelp" class="errorhelp hidden">*Please read and accept the license agreement.</div>
                                <div id="confirmationVals" style="margin-top: 20px">
                                    <div class="col-sm-12 text-center">Org Type <span id="verifyorgtype" class="confirmValue">{Confirm Organization Type}</span></div>
                                    <div class="col-sm-12 text-center">Org Name: <span id="verifyorgname" class="confirmValue">{Organization Name}</span></div>
                                    <div class="col-sm-12 text-center">Email/Login: <span id="verifyemail" class="confirmValue">{Confirm Email}</span></div>
                                </div>
                            </div>

                        </div>
                        <div class="modal-footer">

                            <button id="btnPrev4" type="button" class="btn btn-primary" onclick="doStep3()"><< Previous</button>
                            <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                            <button id="btnNext4" type="submit" class="btn btn-success">Submit Registration
                                Request
                            </button>
                        </div>
                    </form>
                </div><!-- /.modal-content -->
                <div id="regConfirmation" class="modal-content hidden">
                    <div class="modal-header text-center">
                        <h3>Thank you for registering!</h3>
                    </div>
                    <div class="modal-body">
                        <p>Your registration request has been submitted to your Agency&rsquo;s SCOUT Administrator.
                            The Administrator will review the request and enable your account, as deemed appropriate.
                            If you do not receive a registration confirmation email within a few days, please contact
                            your Agency&rsquo;s SCOUT Administrator.</p>
                    </div>
                    <div class="modal-footer text-center">
                        <button type="button" class="btn btn-success" data-dismiss="modal">Close</button>
                    </div>
                </div><!-- /.modal-content -->
                <div id="errordialog" class="modal-content hidden">
                    <div class="modal-header text-center">
                        <h3 class="errorhelp">An error occurred.</h3>
                    </div>
                    <div class="modal-body">
                        <p id="errormessage" class="errorhelp">{Error Message}</p>
                    </div>
                    <div class="modal-footer text-center">
                        <button type="button" class="btn btn-success" data-dismiss="modal">Close</button>
                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
        </div><!-- /.modal -->

    </div>

    <script type="text/javascript">
        $(function() {

            var workspacedata =
                <json:object>
                <json:array name="workspaces" var="workspace" items="${requestScope.workspaces}">
                <json:object>
                <json:property name="id" value="${workspace['workspaceid']}"/>
                <json:property name="name" value="${workspace['workspacename']}"/>
                </json:object>
                </json:array>
                <json:array name="announcements" var="announcement" items="${requestScope.announcements}">
                <json:object>
                <json:property name="createdate" value="${announcement['created']}"/>
                <json:property name="message" value="${announcement['message']}"/>
                </json:object>
                </json:array>
                </json:object>

                console.log(workspacedata);

                loginpage.setPageData(workspacedata);
                loginpage.setWorkspace();
                loginpage.setAnnouncements();


            $('#modalRegistration').on('hidden.bs.modal', function (e) {
                resetDialogSequence();
            });



        } )
    </script>


            <%--<div class="footer">--%>
                <%--<span class="footer-left">--%>
                    <%--<span>Version: <c:out value="${requestScope.version}" /></span>--%>
                <%--</span>--%>

                <%--<span class="footer-right nav">--%>
                    <%--<span>--%>
                        <%--<a href="https://www.scout.ca.gov/nics/about.html">About</a>--%>
                    <%--</span>--%>
                    <%--<span>--%>
                        <%--<a href="https://www.scout.ca.gov/nics/terms.html">Terms</a>--%>
                    <%--</span>--%>
                    <%--<span>--%>
                        <%--<a href="https://www.scout.ca.gov/scouthelp/" target="_blank">Help</a>--%>
                    <%--</span>--%>
                <%--</span>--%>
            <%--</div>--%>
        






    </body>
</html>
