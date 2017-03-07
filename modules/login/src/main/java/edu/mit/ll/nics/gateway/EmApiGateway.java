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

import edu.mit.ll.nics.config.SpringConfiguration;
import edu.mit.ll.nics.model.Organization;
import edu.mit.ll.nics.model.OrganizationType;
import edu.mit.ll.nics.responsemapper.*;
import edu.mit.ll.nics.util.CookieTokenUtil;
import org.apache.commons.configuration.Configuration;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Invocation.Builder;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

public class EmApiGateway {

    private static final Logger logger = Logger.getLogger(EmApiGateway.class);
    private static final String ALL_ORGS_ENDPOINT = "orgs/1/all";
    private static final String ORG_TYPES_ENDPOINT = "orgs/1/types";
    private static final String ORG_TYPE_MAP_ENDPOINT = "orgs/1/typemap";

    private URL restEndpoint;
    private OrganizationResponseMapper organizationsResponseMapper;
    private OrganizationTypeResponseMapper organizationTypeResponseMapper;
    private OrganizationTypeMapResponseMapper organizationTypeMapResponseMapper;
    private final ApplicationContext context;

    @Autowired
    public EmApiGateway(@Qualifier("restEndpoint") URL restEndpoint, @Qualifier("configuration") Configuration configuration) {
        this.restEndpoint = restEndpoint;
        this.organizationsResponseMapper = new OrganizationResponseMapper();
        this.organizationTypeResponseMapper = new OrganizationTypeResponseMapper();
        this.organizationTypeMapResponseMapper = new OrganizationTypeMapResponseMapper();
        context = new AnnotationConfigApplicationContext(SpringConfiguration.class);
    }

    public EmApiGateway(URL restEndpoint, ApplicationContext context, OrganizationResponseMapper organizationResponseMapper, OrganizationTypeResponseMapper organizationTypeResponseMapper,
                        OrganizationTypeMapResponseMapper organizationTypeMapResponseMapper) {
        this.restEndpoint = restEndpoint;
        this.organizationsResponseMapper = organizationResponseMapper;
        this.organizationTypeResponseMapper = organizationTypeResponseMapper;
        this.organizationTypeMapResponseMapper = organizationTypeMapResponseMapper;
        this.context = context;
    }

    public List<Organization> getOrganizations() throws IOException {
        CookieTokenUtil tokenUtil = getCookieTokenUtil();
        Client client = null;
        Builder builder = null;
        Response response = null;
        List<Organization> orgList = Collections.emptyList();
        try {
            client = ClientBuilder.newClient();
            builder = client.target(restEndpoint.toString()).path(ALL_ORGS_ENDPOINT).request(MediaType.APPLICATION_JSON_TYPE);
            tokenUtil.setCookies(builder);
            response = builder.get();
            String entity = response.readEntity(String.class);
            orgList = organizationsResponseMapper.mapResponse(entity);
        } finally {
            if(response!= null) response.close();
            if(client!= null) client.close();
            tokenUtil.destroyToken();
        }
        return orgList;
    }

    public List<OrganizationType> getOrganizationTypes() throws IOException {
        CookieTokenUtil tokenUtil = getCookieTokenUtil();
        Client client = null;
        Builder builder = null;
        Response response = null;
        List<OrganizationType> orgList = Collections.emptyList();
        try {
            client = ClientBuilder.newClient();
            builder = client.target(restEndpoint.toString()).path(ORG_TYPES_ENDPOINT).request(MediaType.APPLICATION_JSON_TYPE);
            tokenUtil.setCookies(builder);
            response = builder.get();
            String entity = response.readEntity(String.class);
            orgList = organizationTypeResponseMapper.mapResponse(entity);
        } finally {
            if(response!= null) response.close();
            if(client!= null) client.close();
            tokenUtil.destroyToken();
        }
        return orgList;
    }

    public Map<Integer, Set<Integer>> getOrganizationTypeMap() throws IOException {
        CookieTokenUtil tokenUtil = getCookieTokenUtil();
        Map<Integer, Set<Integer>> organizationTypeMap = new HashMap<Integer, Set<Integer>>();
        Client client = null;
        Builder builder = null;
        Response response = null;
        try {
            client = ClientBuilder.newClient();
            builder = client.target(restEndpoint.toString()).path(ORG_TYPE_MAP_ENDPOINT).request(MediaType.APPLICATION_JSON_TYPE);
            tokenUtil.setCookies(builder);
            response = builder.get();
            String entity = response.readEntity(String.class);
            organizationTypeMap = organizationTypeMapResponseMapper.mapResponse(entity);
        } finally {
            if(response!= null) response.close();
            if(client!= null) client.close();
            tokenUtil.destroyToken();
        }
        return organizationTypeMap;
    }

    private CookieTokenUtil getCookieTokenUtil() {
        return context.getBean(CookieTokenUtil.class);
    }
}
