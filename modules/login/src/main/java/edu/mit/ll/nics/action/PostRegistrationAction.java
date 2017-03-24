/**
 * Copyright (c) 2008-2016, Massachusetts Institute of Technology (MIT)
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
package edu.mit.ll.nics.action;

import edu.mit.ll.nics.gateway.EmApiGateway;
import edu.mit.ll.nics.log.LoggerFactory;
import edu.mit.ll.nics.response.EmApiResponse;
import edu.mit.ll.nics.response.Response;
import edu.mit.ll.nics.service.JsonSerializationService;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

@Component
public class PostRegistrationAction extends Action {
    private final EmApiGateway emApiGateway;
    private final JsonSerializationService jsonSerializationService;
    private final Logger logger;

    protected final String FAILURE_MESSAGE = "Sorry, we are unable to process your registration request currently. Please try again later.";

    @Autowired
    public PostRegistrationAction(EmApiGateway emApiGateway, JsonSerializationService jsonSerializationService, LoggerFactory loggerFactory) {
        this.emApiGateway = emApiGateway;
        this.jsonSerializationService = jsonSerializationService;
        this.logger = Logger.getLogger(PostRegistrationAction.class);
    }

    public void handle(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String jsonRequest = null;
        String jsonResponse;
        EmApiResponse registrationResponse;
        try{
            jsonRequest = this.readJson(request);
            registrationResponse = emApiGateway.registerUser(jsonRequest);
            this.writeJsonResponse(response, registrationResponse.getResponseBody(), registrationResponse.getStatus());
        } catch(Exception e) {
            logger.error("Failed to register account with data: " + jsonRequest, e);
            jsonResponse = jsonSerializationService.serialize(new Response(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, FAILURE_MESSAGE));
            this.writeJsonResponse(response, jsonResponse, HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    private String readJson(HttpServletRequest request) throws IOException {
        BufferedReader reader = request.getReader();
        StringBuffer jsonBuffer = new StringBuffer();
        String currentLine = null;
        while((currentLine = reader.readLine()) != null) {
            jsonBuffer.append(currentLine);
        }
        return jsonBuffer.toString();
    }
}
