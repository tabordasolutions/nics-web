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
import org.junit.Before;
import org.junit.Test;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.MediaType;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.StringReader;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.doThrow;

public class PostRegistrationActionTest {
    private PostRegistrationAction action;
    private EmApiGateway emApiGateway = mock(EmApiGateway.class);
    private JsonSerializationService jsonSerializationService = mock(JsonSerializationService.class);
    private LoggerFactory loggerFactory = mock(LoggerFactory.class);
    private Logger logger = mock(Logger.class);
    private HttpServletRequest request = mock(HttpServletRequest.class);
    private HttpServletResponse response = mock(HttpServletResponse.class);
    private ServletOutputStream outputStream = mock(ServletOutputStream.class);

    private String jsonRequest = "test json request";
    private BufferedReader requestReader = new BufferedReader(new StringReader(jsonRequest));

    @Before
    public void setup() throws IOException {
        when(loggerFactory.getLogger(PostRegistrationAction.class)).thenReturn(logger);
        when(request.getReader()).thenReturn(requestReader);
        when(response.getOutputStream()).thenReturn(outputStream);
        action = new PostRegistrationAction(emApiGateway, jsonSerializationService, loggerFactory);
    }

    @Test
    public void verifySuccessfulRegistration() throws IOException {
        EmApiResponse registrationResponse = new EmApiResponse(200, "success");
        when(emApiGateway.registerUser(jsonRequest)).thenReturn(registrationResponse);

        action.handle(request, response);

        verify(response).setStatus(registrationResponse.getStatus());
        verify(response).setContentType(MediaType.APPLICATION_JSON);
        verify(outputStream).write(registrationResponse.getResponseBody().getBytes());
        verify(outputStream).flush();
    }

    @Test
    public void verifyRegistrationFailureReturnsError() throws IOException {
        Response errorResponse = new Response(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, action.FAILURE_MESSAGE);
        String jsonErrorResponse = "error";
        doThrow(new RuntimeException("Test exception")).when(emApiGateway).registerUser(jsonRequest);
        when(jsonSerializationService.serialize(errorResponse)).thenReturn(jsonErrorResponse);

        action.handle(request, response);

        verify(response).setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        verify(response).setContentType(MediaType.APPLICATION_JSON);
        verify(outputStream).write(jsonErrorResponse.getBytes());
        verify(outputStream).flush();
    }
}
