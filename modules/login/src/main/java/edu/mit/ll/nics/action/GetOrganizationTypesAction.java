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

import edu.mit.ll.nics.log.LoggerFactory;
import edu.mit.ll.nics.model.OrganizationType;
import edu.mit.ll.nics.response.OrganizationTypesResponse;
import edu.mit.ll.nics.response.Response;
import edu.mit.ll.nics.service.JsonSerializationService;
import edu.mit.ll.nics.service.OrganizationService;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@Component
public class GetOrganizationTypesAction extends Action {
    private final OrganizationService organizationService;
    private final JsonSerializationService jsonSerializationService;
    private final Logger logger;

    @Autowired
    public GetOrganizationTypesAction(LoggerFactory loggerFactory, OrganizationService organizationService, JsonSerializationService jsonSerializationService) {
        this.logger = loggerFactory.getLogger(GetOrganizationTypesAction.class);
        this.organizationService = organizationService;
        this.jsonSerializationService = jsonSerializationService;
    }

    public void handle(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String responseBody;
        try {
            List<OrganizationType> organizationTypes = organizationService.getOrganizationTypesWithOrganizations();
            OrganizationTypesResponse organizationTypesResponse = new OrganizationTypesResponse(HttpServletResponse.SC_OK, "OK", organizationTypes);
            responseBody  = jsonSerializationService.serialize(organizationTypesResponse);
            this.writeJsonResponse(response, responseBody, HttpServletResponse.SC_OK);
        } catch(Exception e) {
            logger.error("Error retrieving organization types data ", e);
            Response errorResponse = new Response(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to retrieve Organization Types: " + e.getMessage());
            responseBody = jsonSerializationService.serialize(errorResponse);
            this.writeJsonResponse(response, responseBody, HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}
