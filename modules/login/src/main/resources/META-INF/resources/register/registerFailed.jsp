<%--

    Copyright (c) 2008-2016, Massachusetts Institute of Technology (MIT)
    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met:

    1. Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.

    2. Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.

    3. Neither the name of the copyright holder nor the names of its contributors
    may be used to endorse or promote products derived from this software without
    specific prior written permission.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
    AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
    DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
    FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
    DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
    SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
    CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
    OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
    OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

--%>
<%@ page pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<c:set var="language" value="${not empty param.language ? param.language : not empty language ? language : pageContext.request.locale}" scope="session" />
<fmt:setLocale value="${language}" />
<fmt:setBundle basename="edu.mit.ll.nics.servlet.register_messages" />
<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>Register Error</title>
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

        <link rel="stylesheet" href="register/styles/register.css">
    </head>
    <body>
    
        <div class="wrapper">       
            
            <div class="content">
                <div class="content-wrapper">
                    <!-- <img src="register/images/scout_logo.png" height="290px" width="423px"></img> -->
                    <br>
                    <h2><fmt:message key="${errorMessageKey}" /></h2>
                    <center>
                    <div style="width:60%">
                    	<p><%= request.getAttribute("REASON") %></p>
                    	
	                    <c:url var="register_url" value="/register"/>
	                    <p class="message">
	                    	<fmt:message key="${errorDescriptionKey}" />
	                    </p>
                    </div>
                    </center>
                    
            	</div>
            </div>
            
           
            <div class="footer">

                <span class="footer-right nav">
                    <span>
                        <a href="https://www.scout.ca.gov/nics/about.html">About</a>
                    </span>
                    <span>
                        <a href="https://www.scout.ca.gov/nics/terms.html">Terms</a>
                    </span>
                    <span>
                        <a href="https://www.scout.ca.gov/scouthelp" target="_blank">Help</a>
                    </span>
                </span>
            </div>
        
        </div>
    </body>
</html>
