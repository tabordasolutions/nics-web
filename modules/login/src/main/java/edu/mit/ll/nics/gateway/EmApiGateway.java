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
package edu.mit.ll.nics.gateway;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.*;

import edu.mit.ll.nics.log.LoggerFactory;
import edu.mit.ll.nics.model.Organization;
import edu.mit.ll.nics.model.OrganizationType;
import edu.mit.ll.nics.gateway.responseMappers.*;
import edu.mit.ll.nics.response.EmApiResponse;
import edu.mit.ll.nics.util.CookieTokenUtil;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.Invocation.Builder;
import javax.ws.rs.core.GenericType;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Component
public class EmApiGateway {

    private static final String ALL_ORGS_PATH = "orgs/1/all";
    private static final String ORG_TYPES_PATH = "orgs/1/types";
    private static final String ORG_TYPE_MAP_PATH = "orgs/1/typemap";
    private static final String REGISTRATION_PATH = "users/1";
    private static final String VERIFY_EMAIL_PATH = "users/1/verifyEmail/%s";

    private final Logger logger;
    private final URL restEndpoint;
    private final Client client;
    private final OrganizationResponseMapper organizationsResponseMapper;
    private final OrganizationTypeResponseMapper organizationTypeResponseMapper;
    private final OrganizationTypeMapResponseMapper organizationTypeMapResponseMapper;

    @Autowired
    public EmApiGateway(@Qualifier("restEndpoint") URL restEndpoint, Client client, LoggerFactory loggerFactory) {
        this.restEndpoint = restEndpoint;
        this.client = client;
        this.logger = loggerFactory.getLogger(EmApiGateway.class);
        this.organizationsResponseMapper = new OrganizationResponseMapper();
        this.organizationTypeResponseMapper = new OrganizationTypeResponseMapper();
        this.organizationTypeMapResponseMapper = new OrganizationTypeMapResponseMapper();
    }

    protected EmApiGateway(URL restEndpoint, Client client, LoggerFactory loggerFactory,  OrganizationResponseMapper organizationResponseParser, OrganizationTypeResponseMapper organizationTypeResponseMapper,
                        OrganizationTypeMapResponseMapper organizationTypeMapResponseMapper) {
        this.restEndpoint = restEndpoint;
        this.client = client;
        this.logger = loggerFactory.getLogger(EmApiGateway.class);
        this.organizationsResponseMapper = organizationResponseParser;
        this.organizationTypeResponseMapper = organizationTypeResponseMapper;
        this.organizationTypeMapResponseMapper = organizationTypeMapResponseMapper;
    }

    public List<Organization> getOrganizations() throws IOException {
        String responseEntity = this.getRequest(ALL_ORGS_PATH);
        List<Organization> organizations = organizationsResponseMapper.mapResponse(responseEntity);
        return organizations;
    }

    public List<OrganizationType> getOrganizationTypes() throws IOException {
        String responseEntity = this.getRequest(ORG_TYPES_PATH);
        List<OrganizationType> organizationTypes = organizationTypeResponseMapper.mapResponse(responseEntity);
        return organizationTypes;
    }

    public Map<Integer, Set<Integer>> getOrganizationTypeMap() throws IOException {
        String responseEntity = this.getRequest(ORG_TYPE_MAP_PATH);
        Map<Integer, Set<Integer>> organizationTypeMap = organizationTypeMapResponseMapper.mapResponse(responseEntity);
        return organizationTypeMap;
    }

    private String getRequest(String path) {
        CookieTokenUtil tokenUtil = getCookieTokenUtil();
        Response response = null;
        String entity;
        try {
            Builder builder = client.target(restEndpoint.toString()).path(path).request(MediaType.APPLICATION_JSON_TYPE);
            tokenUtil.setCookies(builder);
            response = builder.get();
            if(response.getStatus() == Response.Status.OK.getStatusCode()) {
                entity = response.readEntity(String.class);
            } else {
                Map<String, Object> mapEntity = response.readEntity(new GenericType<Map<String, Object>>(){});
                throw new RuntimeException((String)mapEntity.get("message"));
            }
        } finally {
            if(response!= null) response.close();
            tokenUtil.destroyToken();
        }
        return entity;
    }

    public EmApiResponse registerUser(String jsonRequest) {
        CookieTokenUtil tokenUtil = getCookieTokenUtil();
        Response response = null;
        EmApiResponse registrationResponse;
        try{
            Builder builder = client.target(restEndpoint.toString()).path(REGISTRATION_PATH).request(MediaType.APPLICATION_JSON_TYPE);
            builder.header("Content-type", "application/json");
            tokenUtil.setCookies(builder);
            response = builder.post(Entity.entity(jsonRequest, MediaType.APPLICATION_JSON_TYPE));
            String jsonResponse = response.readEntity(String.class);
            registrationResponse = new EmApiResponse(response.getStatus(), jsonResponse);
        } finally {
            if(response != null) response.close();
            tokenUtil.destroyToken();
        }
        return registrationResponse;
    }

    public EmApiResponse verifyEmail(String email) {
        CookieTokenUtil tokenUtil = getCookieTokenUtil();
        Response response = null;
        EmApiResponse apiResponse;
        try{
            String path = String.format(VERIFY_EMAIL_PATH, email);
            Builder builder = client.target(restEndpoint.toString()).path(path).request(MediaType.APPLICATION_JSON_TYPE);
            tokenUtil.setCookies(builder);
            response = builder.get();
            String jsonResponse = response.readEntity(String.class);
            apiResponse = new EmApiResponse(response.getStatus(), jsonResponse);
        } finally {
            if(response != null) response.close();
            tokenUtil.destroyToken();
        }
        return apiResponse;
    }

    private CookieTokenUtil getCookieTokenUtil() {
        return new CookieTokenUtil();
    }
}
