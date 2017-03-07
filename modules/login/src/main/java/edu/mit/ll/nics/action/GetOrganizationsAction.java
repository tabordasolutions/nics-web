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

import edu.mit.ll.nics.model.Organization;
import edu.mit.ll.nics.response.Response;
import edu.mit.ll.nics.response.OrganizationsResponse;
import edu.mit.ll.nics.service.JsonSerializationService;
import edu.mit.ll.nics.service.OrganizationService;
import edu.mit.ll.nics.log.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import org.apache.log4j.Logger;
import org.apache.commons.configuration.Configuration;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.MediaType;
import java.io.IOException;
import java.io.OutputStream;
import java.util.*;

@Component
public class GetOrganizationsAction {
    private OrganizationService organizationService;
    private JsonSerializationService jsonSerializationService;
    private LoggerFactory loggerFactory;
    private Logger logger;
    protected static final String OK = "OK";

    @Autowired
    public GetOrganizationsAction(OrganizationService organizationService, JsonSerializationService jsonSerializationService, LoggerFactory loggerFactory) {
        this.organizationService = organizationService;
        this.jsonSerializationService = jsonSerializationService;
        this.loggerFactory = loggerFactory;
        logger = loggerFactory.getLogger(GetOrganizationsAction.class);
    }

    public void handle(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String responseBody;
        try {
            List<Organization> organizations = organizationService.getOrganizations();
            OrganizationsResponse organizationsResponse = new OrganizationsResponse(HttpServletResponse.SC_OK, OK, organizations);
            responseBody = jsonSerializationService.serializeOrganizations(organizationsResponse);
            this.writeResponse(response, responseBody, HttpServletResponse.SC_OK);
        } catch(Exception e) {
            logger.error("Error retrieving organization data ", e);
            Response errorResponse = new Response(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to retrieve Organizations: " + e.getMessage());
            responseBody = jsonSerializationService.serialize(errorResponse);
            this.writeResponse(response, responseBody, HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    private void writeResponse(HttpServletResponse response, String responseBody, int status) throws IOException {
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON);
        OutputStream outputStream = response.getOutputStream();
        outputStream.write(responseBody.getBytes());
        outputStream.flush();
    }
}
