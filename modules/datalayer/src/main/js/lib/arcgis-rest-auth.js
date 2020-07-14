/*
 * Copyright (c) 2008-2020, Massachusetts Institute of Technology (MIT)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors
 * may be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
/* @preserve
* @esri/arcgis-rest-auth - v2.11.0 - Apache-2.0
* Copyright (c) 2017-2020 Esri, Inc.
* Mon Apr 06 2020 13:15:32 GMT-0700 (Pacific Daylight Time)
*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@esri/arcgis-rest-request')) :
    typeof define === 'function' && define.amd ? define(['exports', './arcgis-rest-request'], factory) :
    (global = global || self, factory(global.arcgisRest = global.arcgisRest || {}, global.arcgisRest));
}(this, function (exports, arcgisRestRequest) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    /* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
     * Apache-2.0 */
    function fetchToken(url, requestOptions) {
        var options = requestOptions;
        // we generate a response, so we can't return the raw response
        options.rawResponse = false;
        return arcgisRestRequest.request(url, options).then(function (response) {
            var r = {
                token: response.access_token,
                username: response.username,
                expires: new Date(
                // convert seconds in response to milliseconds and add the value to the current time to calculate a static expiration timestamp
                Date.now() + (response.expires_in * 1000 - 1000)),
                ssl: response.ssl === true
            };
            if (response.refresh_token) {
                r.refreshToken = response.refresh_token;
            }
            return r;
        });
    }

    /* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
     * Apache-2.0 */
    /**
     * ```js
     * import { ApplicationSession } from '@esri/arcgis-rest-auth';
     * const session = new ApplicationSession({
     *   clientId: "abc123",
     *   clientSecret: "sshhhhhh"
     * })
     * // visit https://developers.arcgis.com to generate your own clientid and secret
     * ```
     * You can use [App Login](/arcgis-rest-js/guides/node/) to access premium content and services in ArcGIS Online.
     *
     */
    var ApplicationSession = /** @class */ (function () {
        function ApplicationSession(options) {
            this.clientId = options.clientId;
            this.clientSecret = options.clientSecret;
            this.token = options.token;
            this.expires = options.expires;
            this.portal = options.portal || "https://www.arcgis.com/sharing/rest";
            this.duration = options.duration || 7200;
        }
        // url isnt actually read or passed through.
        ApplicationSession.prototype.getToken = function (url, requestOptions) {
            if (this.token && this.expires && this.expires.getTime() > Date.now()) {
                return Promise.resolve(this.token);
            }
            if (this._pendingTokenRequest) {
                return this._pendingTokenRequest;
            }
            this._pendingTokenRequest = this.refreshToken(requestOptions);
            return this._pendingTokenRequest;
        };
        ApplicationSession.prototype.refreshToken = function (requestOptions) {
            var _this = this;
            var options = __assign({ params: {
                    client_id: this.clientId,
                    client_secret: this.clientSecret,
                    grant_type: "client_credentials",
                    expiration: this.duration
                } }, requestOptions);
            return fetchToken(this.portal + "/oauth2/token/", options).then(function (response) {
                _this._pendingTokenRequest = null;
                _this.token = response.token;
                _this.expires = response.expires;
                return response.token;
            });
        };
        ApplicationSession.prototype.refreshSession = function () {
            var _this = this;
            return this.refreshToken().then(function () { return _this; });
        };
        return ApplicationSession;
    }());

    /* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
     * Apache-2.0 */
    function generateToken(url, requestOptions) {
        var options = requestOptions;
        /* istanbul ignore else */
        if (typeof window !== "undefined" &&
            window.location &&
            window.location.host) {
            options.params.referer = window.location.host;
        }
        else {
            options.params.referer = arcgisRestRequest.NODEJS_DEFAULT_REFERER_HEADER;
        }
        return arcgisRestRequest.request(url, options);
    }

    /**
     * Used to test if a URL is an ArcGIS Online URL
     */
    var arcgisOnlineUrlRegex = /^https?:\/\/(\S+)\.arcgis\.com.+/;
    function isOnline(url) {
        return arcgisOnlineUrlRegex.test(url);
    }
    function normalizeOnlinePortalUrl(portalUrl) {
        if (!arcgisOnlineUrlRegex.test(portalUrl)) {
            return portalUrl;
        }
        switch (getOnlineEnvironment(portalUrl)) {
            case "dev":
                return "https://devext.arcgis.com/sharing/rest";
            case "qa":
                return "https://qaext.arcgis.com/sharing/rest";
            default:
                return "https://www.arcgis.com/sharing/rest";
        }
    }
    function getOnlineEnvironment(url) {
        if (!arcgisOnlineUrlRegex.test(url)) {
            return null;
        }
        var match = url.match(arcgisOnlineUrlRegex);
        var subdomain = match[1].split(".").pop();
        if (subdomain.includes("dev")) {
            return "dev";
        }
        if (subdomain.includes("qa")) {
            return "qa";
        }
        return "production";
    }
    function isFederated(owningSystemUrl, portalUrl) {
        var normalizedPortalUrl = arcgisRestRequest.cleanUrl(normalizeOnlinePortalUrl(portalUrl)).replace(/https?:\/\//, "");
        var normalizedOwningSystemUrl = arcgisRestRequest.cleanUrl(owningSystemUrl).replace(/https?:\/\//, "");
        return new RegExp(normalizedOwningSystemUrl, "i").test(normalizedPortalUrl);
    }
    function canUseOnlineToken(portalUrl, requestUrl) {
        var portalIsOnline = isOnline(portalUrl);
        var requestIsOnline = isOnline(requestUrl);
        var portalEnv = getOnlineEnvironment(portalUrl);
        var requestEnv = getOnlineEnvironment(requestUrl);
        if (portalIsOnline && requestIsOnline && portalEnv === requestEnv) {
            return true;
        }
        return false;
    }

    /* Copyright (c) 2017-2019 Environmental Systems Research Institute, Inc.
     * Apache-2.0 */
    function defer() {
        var deferred = {
            promise: null,
            resolve: null,
            reject: null
        };
        deferred.promise = new Promise(function (resolve, reject) {
            deferred.resolve = resolve;
            deferred.reject = reject;
        });
        return deferred;
    }
    /**
     * ```js
     * import { UserSession } from '@esri/arcgis-rest-auth';
     * UserSession.beginOAuth2({
     *   // register an app of your own to create a unique clientId
     *   clientId: "abc123",
     *   redirectUri: 'https://yourapp.com/authenticate.html'
     * })
     *   .then(session)
     * // or
     * new UserSession({
     *   username: "jsmith",
     *   password: "123456"
     * })
     * // or
     * UserSession.deserialize(cache)
     * ```
     * Used to authenticate both ArcGIS Online and ArcGIS Enterprise users. `UserSession` includes helper methods for [OAuth 2.0](/arcgis-rest-js/guides/browser-authentication/) in both browser and server applications.
     */
    var UserSession = /** @class */ (function () {
        function UserSession(options) {
            this.clientId = options.clientId;
            this._refreshToken = options.refreshToken;
            this._refreshTokenExpires = options.refreshTokenExpires;
            this.username = options.username;
            this.password = options.password;
            this._token = options.token;
            this._tokenExpires = options.tokenExpires;
            this.portal = options.portal
                ? arcgisRestRequest.cleanUrl(options.portal)
                : "https://www.arcgis.com/sharing/rest";
            this.ssl = options.ssl;
            this.provider = options.provider || "arcgis";
            this.tokenDuration = options.tokenDuration || 20160;
            this.redirectUri = options.redirectUri;
            this.refreshTokenTTL = options.refreshTokenTTL || 1440;
            this.trustedServers = {};
            // if a non-federated server was passed explicitly, it should be trusted.
            if (options.server) {
                // if the url includes more than '/arcgis/', trim the rest
                var root = this.getServerRootUrl(options.server);
                this.trustedServers[root] = {
                    token: options.token,
                    expires: options.tokenExpires
                };
            }
            this._pendingTokenRequests = {};
        }
        /**
         * Begins a new browser-based OAuth 2.0 sign in. If `options.popup` is `true` the
         * authentication window will open in a new tab/window otherwise the user will
         * be redirected to the authorization page in their current tab/window.
         *
         * @browserOnly
         */
        /* istanbul ignore next */
        UserSession.beginOAuth2 = function (options, win) {
            if (win === void 0) { win = window; }
            var _a = __assign({
                portal: "https://www.arcgis.com/sharing/rest",
                provider: "arcgis",
                duration: 20160,
                popup: true,
                state: options.clientId,
                locale: ""
            }, options), portal = _a.portal, provider = _a.provider, clientId = _a.clientId, duration = _a.duration, redirectUri = _a.redirectUri, popup = _a.popup, state = _a.state, locale = _a.locale, params = _a.params;
            var url;
            if (provider === "arcgis") {
                url = portal + "/oauth2/authorize?client_id=" + clientId + "&response_type=token&expiration=" + duration + "&redirect_uri=" + encodeURIComponent(redirectUri) + "&state=" + state + "&locale=" + locale;
            }
            else {
                url = portal + "/oauth2/social/authorize?client_id=" + clientId + "&socialLoginProviderName=" + provider + "&autoAccountCreateForSocial=true&response_type=token&expiration=" + duration + "&redirect_uri=" + encodeURIComponent(redirectUri) + "&state=" + state + "&locale=" + locale;
            }
            // append additional params
            if (params) {
                url = url + "&" + arcgisRestRequest.encodeQueryString(params);
            }
            if (!popup) {
                win.location.href = url;
                return undefined;
            }
            var session = defer();
            win["__ESRI_REST_AUTH_HANDLER_" + clientId] = function (errorString, oauthInfoString) {
                if (errorString) {
                    var error = JSON.parse(errorString);
                    session.reject(new arcgisRestRequest.ArcGISAuthError(error.errorMessage, error.error));
                    return;
                }
                if (oauthInfoString) {
                    var oauthInfo = JSON.parse(oauthInfoString);
                    session.resolve(new UserSession({
                        clientId: clientId,
                        portal: portal,
                        ssl: oauthInfo.ssl,
                        token: oauthInfo.token,
                        tokenExpires: new Date(oauthInfo.expires),
                        username: oauthInfo.username
                    }));
                }
            };
            win.open(url, "oauth-window", "height=400,width=600,menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes");
            return session.promise;
        };
        /**
         * Completes a browser-based OAuth 2.0  in. If `options.popup` is `true` the user
         * will be returned to the previous window. Otherwise a new `UserSession`
         * will be returned. You must pass the same values for `options.popup` and
         * `options.portal` as you used in `beginOAuth2()`.
         *
         * @browserOnly
         */
        /* istanbul ignore next */
        UserSession.completeOAuth2 = function (options, win) {
            if (win === void 0) { win = window; }
            var _a = __assign({ portal: "https://www.arcgis.com/sharing/rest", popup: true }, options), portal = _a.portal, clientId = _a.clientId, popup = _a.popup;
            function completeSignIn(error, oauthInfo) {
                try {
                    if (popup &&
                        win.opener &&
                        win.opener.parent &&
                        win.opener.parent["__ESRI_REST_AUTH_HANDLER_" + clientId]) {
                        var handlerFn = win.opener.parent["__ESRI_REST_AUTH_HANDLER_" + clientId];
                        if (handlerFn) {
                            handlerFn(error ? JSON.stringify(error) : undefined, JSON.stringify(oauthInfo));
                        }
                        win.close();
                        return undefined;
                    }
                    if (popup &&
                        win !== win.parent &&
                        win.parent &&
                        win.parent["__ESRI_REST_AUTH_HANDLER_" + clientId]) {
                        var handlerFn = win.parent["__ESRI_REST_AUTH_HANDLER_" + clientId];
                        if (handlerFn) {
                            handlerFn(error ? JSON.stringify(error) : undefined, JSON.stringify(oauthInfo));
                        }
                        win.close();
                        return undefined;
                    }
                }
                catch (e) {
                    throw new arcgisRestRequest.ArcGISAuthError("Unable to complete authentication. It's possible you specified popup based oAuth2 but no handler from \"beginOAuth2()\" present. This generally happens because the \"popup\" option differs between \"beginOAuth2()\" and \"completeOAuth2()\".");
                }
                if (error) {
                    throw new arcgisRestRequest.ArcGISAuthError(error.errorMessage, error.error);
                }
                return new UserSession({
                    clientId: clientId,
                    portal: portal,
                    ssl: oauthInfo.ssl,
                    token: oauthInfo.token,
                    tokenExpires: oauthInfo.expires,
                    username: oauthInfo.username
                });
            }
            var match = win.location.href.match(/access_token=(.+)&expires_in=(.+)&username=([^&]+)/);
            if (!match) {
                var errorMatch = win.location.href.match(/error=(.+)&error_description=(.+)/);
                var error = errorMatch[1];
                var errorMessage = decodeURIComponent(errorMatch[2]);
                return completeSignIn({ error: error, errorMessage: errorMessage });
            }
            var token = match[1];
            var expires = new Date(Date.now() + parseInt(match[2], 10) * 1000 - 60 * 1000);
            var username = decodeURIComponent(match[3]);
            var ssl = win.location.href.indexOf("&ssl=true") > -1 ||
                win.location.href.indexOf("#ssl=true") > -1;
            return completeSignIn(undefined, {
                token: token,
                expires: expires,
                ssl: ssl,
                username: username
            });
        };
        /**
         * Begins a new server-based OAuth 2.0 sign in. This will redirect the user to
         * the ArcGIS Online or ArcGIS Enterprise authorization page.
         *
         * @nodeOnly
         */
        UserSession.authorize = function (options, response) {
            var _a = __assign({ portal: "https://arcgis.com/sharing/rest", duration: 20160 }, options), portal = _a.portal, clientId = _a.clientId, duration = _a.duration, redirectUri = _a.redirectUri;
            response.writeHead(301, {
                Location: portal + "/oauth2/authorize?client_id=" + clientId + "&duration=" + duration + "&response_type=code&redirect_uri=" + encodeURIComponent(redirectUri)
            });
            response.end();
        };
        /**
         * Completes the server-based OAuth 2.0 sign in process by exchanging the `authorizationCode`
         * for a `access_token`.
         *
         * @nodeOnly
         */
        UserSession.exchangeAuthorizationCode = function (options, authorizationCode) {
            var _a = __assign({
                portal: "https://www.arcgis.com/sharing/rest",
                refreshTokenTTL: 1440
            }, options), portal = _a.portal, clientId = _a.clientId, redirectUri = _a.redirectUri, refreshTokenTTL = _a.refreshTokenTTL;
            return fetchToken(portal + "/oauth2/token", {
                params: {
                    grant_type: "authorization_code",
                    client_id: clientId,
                    redirect_uri: redirectUri,
                    code: authorizationCode
                }
            }).then(function (response) {
                return new UserSession({
                    clientId: clientId,
                    portal: portal,
                    ssl: response.ssl,
                    redirectUri: redirectUri,
                    refreshToken: response.refreshToken,
                    refreshTokenTTL: refreshTokenTTL,
                    refreshTokenExpires: new Date(Date.now() + (refreshTokenTTL - 1) * 1000),
                    token: response.token,
                    tokenExpires: response.expires,
                    username: response.username
                });
            });
        };
        UserSession.deserialize = function (str) {
            var options = JSON.parse(str);
            return new UserSession({
                clientId: options.clientId,
                refreshToken: options.refreshToken,
                refreshTokenExpires: new Date(options.refreshTokenExpires),
                username: options.username,
                password: options.password,
                token: options.token,
                tokenExpires: new Date(options.tokenExpires),
                portal: options.portal,
                ssl: options.ssl,
                tokenDuration: options.tokenDuration,
                redirectUri: options.redirectUri,
                refreshTokenTTL: options.refreshTokenTTL
            });
        };
        /**
         * Translates authentication from the format used in the [ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/).
         *
         * ```js
         * UserSession.fromCredential({
         *   userId: "jsmith",
         *   token: "secret"
         * });
         * ```
         *
         * @returns UserSession
         */
        UserSession.fromCredential = function (credential) {
            return new UserSession({
                portal: credential.server.includes("sharing/rest")
                    ? credential.server
                    : credential.server + "/sharing/rest",
                ssl: credential.ssl,
                token: credential.token,
                username: credential.userId,
                tokenExpires: new Date(credential.expires)
            });
        };
        Object.defineProperty(UserSession.prototype, "token", {
            /**
             * The current ArcGIS Online or ArcGIS Enterprise `token`.
             */
            get: function () {
                return this._token;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UserSession.prototype, "tokenExpires", {
            /**
             * The expiration time of the current `token`.
             */
            get: function () {
                return this._tokenExpires;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UserSession.prototype, "refreshToken", {
            /**
             * The current token to ArcGIS Online or ArcGIS Enterprise.
             */
            get: function () {
                return this._refreshToken;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UserSession.prototype, "refreshTokenExpires", {
            /**
             * The expiration time of the current `refreshToken`.
             */
            get: function () {
                return this._refreshTokenExpires;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Returns authentication in a format useable in the [ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/).
         *
         * ```js
         * esriId.registerToken(session.toCredential());
         * ```
         *
         * @returns ICredential
         */
        UserSession.prototype.toCredential = function () {
            return {
                expires: this.tokenExpires.getTime(),
                server: this.portal,
                ssl: this.ssl,
                token: this.token,
                userId: this.username
            };
        };
        /**
         * Returns information about the currently logged in [user](https://developers.arcgis.com/rest/users-groups-and-items/user.htm). Subsequent calls will *not* result in additional web traffic.
         *
         * ```js
         * session.getUser()
         *   .then(response => {
         *     console.log(response.role); // "org_admin"
         *   })
         * ```
         *
         * @param requestOptions - Options for the request. NOTE: `rawResponse` is not supported by this operation.
         * @returns A Promise that will resolve with the data from the response.
         */
        UserSession.prototype.getUser = function (requestOptions) {
            var _this = this;
            if (this._pendingUserRequest) {
                return this._pendingUserRequest;
            }
            else if (this._user) {
                return Promise.resolve(this._user);
            }
            else {
                var url = this.portal + "/community/self";
                var options = __assign({ httpMethod: "GET", authentication: this }, requestOptions, { rawResponse: false });
                this._pendingUserRequest = arcgisRestRequest.request(url, options).then(function (response) {
                    _this._user = response;
                    _this._pendingUserRequest = null;
                    return response;
                });
                return this._pendingUserRequest;
            }
        };
        /**
         * Returns the username for the currently logged in [user](https://developers.arcgis.com/rest/users-groups-and-items/user.htm). Subsequent calls will *not* result in additional web traffic. This is also used internally when a username is required for some requests but is not present in the options.
         *
         *    * ```js
         * session.getUsername()
         *   .then(response => {
         *     console.log(response); // "casey_jones"
         *   })
         * ```
         */
        UserSession.prototype.getUsername = function () {
            if (this.username) {
                return Promise.resolve(this.username);
            }
            else if (this._user) {
                return Promise.resolve(this._user.username);
            }
            else {
                return this.getUser().then(function (user) {
                    return user.username;
                });
            }
        };
        /**
         * Gets an appropriate token for the given URL. If `portal` is ArcGIS Online and
         * the request is to an ArcGIS Online domain `token` will be used. If the request
         * is to the current `portal` the current `token` will also be used. However if
         * the request is to an unknown server we will validate the server with a request
         * to our current `portal`.
         */
        UserSession.prototype.getToken = function (url, requestOptions) {
            if (canUseOnlineToken(this.portal, url)) {
                return this.getFreshToken(requestOptions);
            }
            else if (new RegExp(this.portal, "i").test(url)) {
                return this.getFreshToken(requestOptions);
            }
            else {
                return this.getTokenForServer(url, requestOptions);
            }
        };
        UserSession.prototype.toJSON = function () {
            return {
                clientId: this.clientId,
                refreshToken: this.refreshToken,
                refreshTokenExpires: this.refreshTokenExpires,
                username: this.username,
                password: this.password,
                token: this.token,
                tokenExpires: this.tokenExpires,
                portal: this.portal,
                ssl: this.ssl,
                tokenDuration: this.tokenDuration,
                redirectUri: this.redirectUri,
                refreshTokenTTL: this.refreshTokenTTL
            };
        };
        UserSession.prototype.serialize = function () {
            return JSON.stringify(this);
        };
        /**
         * Manually refreshes the current `token` and `tokenExpires`.
         */
        UserSession.prototype.refreshSession = function (requestOptions) {
            // make sure subsequent calls to getUser() don't returned cached metadata
            this._user = null;
            if (this.username && this.password) {
                return this.refreshWithUsernameAndPassword(requestOptions);
            }
            if (this.clientId && this.refreshToken) {
                return this.refreshWithRefreshToken();
            }
            return Promise.reject(new arcgisRestRequest.ArcGISAuthError("Unable to refresh token."));
        };
        /**
         * Determines the root of the ArcGIS Server or Portal for a given URL.
         *
         * @param url the URl to determine the root url for.
         */
        UserSession.prototype.getServerRootUrl = function (url) {
            var root = arcgisRestRequest.cleanUrl(url).split(/\/rest(\/admin)?\/services(?:\/|#|\?|$)/)[0];
            var _a = root.match(/(https?:\/\/)(.+)/), match = _a[0], protocol = _a[1], domainAndPath = _a[2];
            var _b = domainAndPath.split("/"), domain = _b[0], path = _b.slice(1);
            // only the domain is lowercased becasue in some cases an org id might be
            // in the path which cannot be lowercased.
            return "" + protocol + domain.toLowerCase() + "/" + path.join("/");
        };
        /**
         * Validates that a given URL is properly federated with our current `portal`.
         * Attempts to use the internal `trustedServers` cache first.
         */
        UserSession.prototype.getTokenForServer = function (url, requestOptions) {
            var _this = this;
            // requests to /rest/services/ and /rest/admin/services/ are both valid
            // Federated servers may have inconsistent casing, so lowerCase it
            var root = this.getServerRootUrl(url);
            var existingToken = this.trustedServers[root];
            if (existingToken &&
                existingToken.expires &&
                existingToken.expires.getTime() > Date.now()) {
                return Promise.resolve(existingToken.token);
            }
            if (this._pendingTokenRequests[root]) {
                return this._pendingTokenRequests[root];
            }
            this._pendingTokenRequests[root] = arcgisRestRequest.request(root + "/rest/info")
                .then(function (response) {
                if (response.owningSystemUrl) {
                    /**
                     * if this server is not owned by this portal
                     * bail out with an error since we know we wont
                     * be able to generate a token
                     */
                    if (!isFederated(response.owningSystemUrl, _this.portal)) {
                        throw new arcgisRestRequest.ArcGISAuthError(url + " is not federated with " + _this.portal + ".", "NOT_FEDERATED");
                    }
                    else {
                        /**
                         * if the server is federated, use the relevant token endpoint.
                         */
                        return arcgisRestRequest.request(response.owningSystemUrl + "/sharing/rest/info", requestOptions);
                    }
                }
                else if (response.authInfo &&
                    _this.trustedServers[root] !== undefined) {
                    /**
                     * if its a stand-alone instance of ArcGIS Server that doesn't advertise
                     * federation, but the root server url is recognized, use its built in token endpoint.
                     */
                    return Promise.resolve({ authInfo: response.authInfo });
                }
                else {
                    throw new arcgisRestRequest.ArcGISAuthError(url + " is not federated with any portal and is not explicitly trusted.", "NOT_FEDERATED");
                }
            })
                .then(function (response) {
                return response.authInfo.tokenServicesUrl;
            })
                .then(function (tokenServicesUrl) {
                // an expired token cant be used to generate a new token
                if (_this.token && _this.tokenExpires.getTime() > Date.now()) {
                    return generateToken(tokenServicesUrl, {
                        params: {
                            token: _this.token,
                            serverUrl: url,
                            expiration: _this.tokenDuration,
                            client: "referer"
                        }
                    });
                    // generate an entirely fresh token if necessary
                }
                else {
                    return generateToken(tokenServicesUrl, {
                        params: {
                            username: _this.username,
                            password: _this.password,
                            expiration: _this.tokenDuration,
                            client: "referer"
                        }
                    }).then(function (response) {
                        _this._token = response.token;
                        _this._tokenExpires = new Date(response.expires);
                        return response;
                    });
                }
            })
                .then(function (response) {
                _this.trustedServers[root] = {
                    expires: new Date(response.expires),
                    token: response.token
                };
                delete _this._pendingTokenRequests[root];
                return response.token;
            });
            return this._pendingTokenRequests[root];
        };
        /**
         * Returns an unexpired token for the current `portal`.
         */
        UserSession.prototype.getFreshToken = function (requestOptions) {
            var _this = this;
            if (this.token && !this.tokenExpires) {
                return Promise.resolve(this.token);
            }
            if (this.token &&
                this.tokenExpires &&
                this.tokenExpires.getTime() > Date.now()) {
                return Promise.resolve(this.token);
            }
            if (!this._pendingTokenRequests[this.portal]) {
                this._pendingTokenRequests[this.portal] = this.refreshSession(requestOptions).then(function (session) {
                    _this._pendingTokenRequests[_this.portal] = null;
                    return session.token;
                });
            }
            return this._pendingTokenRequests[this.portal];
        };
        /**
         * Refreshes the current `token` and `tokenExpires` with `username` and
         * `password`.
         */
        UserSession.prototype.refreshWithUsernameAndPassword = function (requestOptions) {
            var _this = this;
            var options = __assign({ params: {
                    username: this.username,
                    password: this.password,
                    expiration: this.tokenDuration
                } }, requestOptions);
            return generateToken(this.portal + "/generateToken", options).then(function (response) {
                _this._token = response.token;
                _this._tokenExpires = new Date(response.expires);
                return _this;
            });
        };
        /**
         * Refreshes the current `token` and `tokenExpires` with `refreshToken`.
         */
        UserSession.prototype.refreshWithRefreshToken = function (requestOptions) {
            var _this = this;
            if (this.refreshToken &&
                this.refreshTokenExpires &&
                this.refreshTokenExpires.getTime() < Date.now()) {
                return this.refreshRefreshToken(requestOptions);
            }
            var options = __assign({ params: {
                    client_id: this.clientId,
                    refresh_token: this.refreshToken,
                    grant_type: "refresh_token"
                } }, requestOptions);
            return fetchToken(this.portal + "/oauth2/token", options).then(function (response) {
                _this._token = response.token;
                _this._tokenExpires = response.expires;
                return _this;
            });
        };
        /**
         * Exchanges an unexpired `refreshToken` for a new one, also updates `token` and
         * `tokenExpires`.
         */
        UserSession.prototype.refreshRefreshToken = function (requestOptions) {
            var _this = this;
            var options = __assign({ params: {
                    client_id: this.clientId,
                    refresh_token: this.refreshToken,
                    redirect_uri: this.redirectUri,
                    grant_type: "exchange_refresh_token"
                } }, requestOptions);
            return fetchToken(this.portal + "/oauth2/token", options).then(function (response) {
                _this._token = response.token;
                _this._tokenExpires = response.expires;
                _this._refreshToken = response.refreshToken;
                _this._refreshTokenExpires = new Date(Date.now() + (_this.refreshTokenTTL - 1) * 60 * 1000);
                return _this;
            });
        };
        return UserSession;
    }());

    exports.ApplicationSession = ApplicationSession;
    exports.UserSession = UserSession;
    exports.fetchToken = fetchToken;
    exports.generateToken = generateToken;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=arcgis-rest-auth.js.map