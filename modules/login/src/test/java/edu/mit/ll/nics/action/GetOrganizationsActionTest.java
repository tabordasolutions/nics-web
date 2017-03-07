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
import edu.mit.ll.nics.model.Organization;
import edu.mit.ll.nics.response.OrganizationsResponse;
import edu.mit.ll.nics.response.Response;
import edu.mit.ll.nics.service.JsonSerializationService;
import edu.mit.ll.nics.service.OrganizationService;
import org.apache.commons.configuration.Configuration;
import org.apache.log4j.Logger;
import org.junit.Before;
import org.junit.Test;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.never;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.MediaType;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class GetOrganizationsActionTest {
    private GetOrganizationsAction action;
    private OrganizationService organizationService;
    private JsonSerializationService jsonSerializationService;
    private Configuration configuration;
    private HttpServletRequest request;
    private HttpServletResponse response;
    private ServletOutputStream outputStream;
    private LoggerFactory loggerFactory;
    private Logger logger;

    @Before
    public void setup() throws IOException {
        loggerFactory = mock(LoggerFactory.class);
        logger = mock(Logger.class);
        organizationService = mock(OrganizationService.class);
        jsonSerializationService = mock(JsonSerializationService.class);
        configuration = mock(Configuration.class);
        request = mock(HttpServletRequest.class);
        response = mock(HttpServletResponse.class);
        outputStream = mock(ServletOutputStream.class);

        when(loggerFactory.getLogger(GetOrganizationsAction.class)).thenReturn(logger);
        action = new GetOrganizationsAction(organizationService, jsonSerializationService, loggerFactory);
        when(response.getOutputStream()).thenReturn(outputStream);
    }

    @Test
    public void testGetOrganizations() throws IOException {
        List<Organization> organizations = new ArrayList<Organization>();
        Organization organization1 = new Organization();
        organization1.setId(1);
        organization1.setName("Test org 1");
        organization1.setCounty("Sacramento");
        Organization organization2 = new Organization();
        organization2.setId(1);
        organization2.setName("Test org 1");
        organization2.setCountry("USA");
        organizations.add(organization1);
        organizations.add(organization2);
        OrganizationsResponse organizationResponse = new OrganizationsResponse(HttpServletResponse.SC_OK, GetOrganizationsAction.OK, organizations);
        String jsonString = "json string";

        when(organizationService.getOrganizations()).thenReturn(organizations);
        when(jsonSerializationService.serializeOrganizations(organizationResponse)).thenReturn(jsonString);
        action.handle(request, response);

        verify(organizationService).getOrganizations();
        verify(jsonSerializationService).serializeOrganizations(organizationResponse);
        verify(response).setStatus(HttpServletResponse.SC_OK);
        verify(response).setContentType(MediaType.APPLICATION_JSON);
        verify(outputStream).write(jsonString.getBytes());
        verify(outputStream).flush();
    }

    @Test
    public void testGetOrganizationsReturnsError() throws IOException {
        IOException exception = new IOException("Test Exception");
        Response errorResponse = new Response(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to retrieve Organizations: " + exception.getMessage());
        String errorResponseBody = "error response";
        when(organizationService.getOrganizations()).thenThrow(exception);
        when(jsonSerializationService.serialize(any())).thenReturn(errorResponseBody);
        action.handle(request, response);

        verify(organizationService).getOrganizations();
        verify(jsonSerializationService).serialize(errorResponse);
        verify(response).setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        verify(response).setContentType(MediaType.APPLICATION_JSON);
        verify(logger).error("Error retrieving organization data ", exception);
        verify(outputStream).write(errorResponseBody.getBytes());
        verify(outputStream).flush();
    }
}
