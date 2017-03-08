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
import java.net.URL;
import java.util.*;

import edu.mit.ll.nics.model.Organization;
import edu.mit.ll.nics.model.OrganizationType;
import edu.mit.ll.nics.gateway.responseMappers.*;
import edu.mit.ll.nics.util.CookieTokenUtil;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.Invocation.Builder;
import javax.ws.rs.core.GenericType;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Component
public class EmApiGateway {

    private static final Logger logger = Logger.getLogger(EmApiGateway.class);
    private static final String ALL_ORGS_ENDPOINT = "orgs/1/all";
    private static final String ORG_TYPES_ENDPOINT = "orgs/1/types";
    private static final String ORG_TYPE_MAP_ENDPOINT = "orgs/1/typemap";

    private URL restEndpoint;
    private Client client;
    private OrganizationResponseMapper organizationsResponseMapper;
    private OrganizationTypeResponseMapper organizationTypeResponseMapper;
    private OrganizationTypeMapResponseMapper organizationTypeMapResponseMapper;

    @Autowired
    public EmApiGateway(@Qualifier("restEndpoint") URL restEndpoint, @Qualifier("client") Client client) {
        this.restEndpoint = restEndpoint;
        this.client = client;
        this.organizationsResponseMapper = new OrganizationResponseMapper();
        this.organizationTypeResponseMapper = new OrganizationTypeResponseMapper();
        this.organizationTypeMapResponseMapper = new OrganizationTypeMapResponseMapper();
    }

    public EmApiGateway(URL restEndpoint, ApplicationContext context, OrganizationResponseMapper organizationResponseParser, OrganizationTypeResponseMapper organizationTypeResponseMapper,
                        OrganizationTypeMapResponseMapper organizationTypeMapResponseMapper) {
        this.restEndpoint = restEndpoint;
        this.organizationsResponseMapper = organizationResponseParser;
        this.organizationTypeResponseMapper = organizationTypeResponseMapper;
        this.organizationTypeMapResponseMapper = organizationTypeMapResponseMapper;
    }

    public List<Organization> getOrganizations() throws IOException {
        CookieTokenUtil tokenUtil = getCookieTokenUtil();
        Response response = null;
        List<Organization> orgList = Collections.emptyList();
        try {
            Builder builder = client.target(restEndpoint.toString()).path(ALL_ORGS_ENDPOINT).request(MediaType.APPLICATION_JSON_TYPE);
            tokenUtil.setCookies(builder);
            response = builder.get();
            if(response.getStatus() == Response.Status.OK.getStatusCode()) {
                String entity = response.readEntity(String.class);
                orgList = organizationsResponseMapper.mapResponse(entity);
            } else {
                Map<String, Object> entity = response.readEntity(new GenericType<Map<String, Object>>(){});
                throw new RuntimeException((String)entity.get("message"));
            }
        } finally {
            if(response!= null) response.close();
            tokenUtil.destroyToken();
        }
        return orgList;
    }

    public List<OrganizationType> getOrganizationTypes() throws IOException {
        CookieTokenUtil tokenUtil = getCookieTokenUtil();
        Response response = null;
        List<OrganizationType> orgList = Collections.emptyList();
        try {
            Builder builder = client.target(restEndpoint.toString()).path(ORG_TYPES_ENDPOINT).request(MediaType.APPLICATION_JSON_TYPE);
            tokenUtil.setCookies(builder);
            response = builder.get();
            if(response.getStatus() == Response.Status.OK.getStatusCode()) {
                String entity = response.readEntity(String.class);
                orgList = organizationTypeResponseMapper.mapResponse(entity);
            } else {
                Map<String, Object> entity = response.readEntity(new GenericType<Map<String, Object>>(){});
                throw new RuntimeException((String)entity.get("message"));
            }
        } finally {
            if(response!= null) response.close();
            tokenUtil.destroyToken();
        }
        return orgList;
    }

    public Map<Integer, Set<Integer>> getOrganizationTypeMap() throws IOException {
        CookieTokenUtil tokenUtil = getCookieTokenUtil();
        Map<Integer, Set<Integer>> organizationTypeMap = new HashMap<Integer, Set<Integer>>();
        Response response = null;
        try {
            Builder builder = client.target(restEndpoint.toString()).path(ORG_TYPE_MAP_ENDPOINT).request(MediaType.APPLICATION_JSON_TYPE);
            tokenUtil.setCookies(builder);
            response = builder.get();
            if(response.getStatus() == Response.Status.OK.getStatusCode()) {
                String entity = response.readEntity(String.class);
                organizationTypeMap = organizationTypeMapResponseMapper.mapResponse(entity);
            } else {
                Map<String, Object> entity = response.readEntity(new GenericType<Map<String, Object>>(){});
                throw new RuntimeException((String)entity.get("message"));
            }
        } finally {
            if(response!= null) response.close();
            tokenUtil.destroyToken();
        }
        return organizationTypeMap;
    }

    private CookieTokenUtil getCookieTokenUtil() {
        return new CookieTokenUtil();
    }
}
