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
package edu.mit.ll.nics.service;

import edu.mit.ll.nics.gateway.EmApiGateway;
import edu.mit.ll.nics.model.Organization;
import edu.mit.ll.nics.model.OrganizationType;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.*;

public class OrganizationServiceTest {
    private EmApiGateway emApiGateway = mock(EmApiGateway.class);
    private OrganizationService service = new OrganizationService(emApiGateway);
    private List<OrganizationType> organizationTypes;
    private Map<Integer, Set<Integer>> organizaitonTypeMap;
    private List<Organization> organizations;

    @Before
    public void setup() {
        organizationTypes = new ArrayList<OrganizationType>();
        organizationTypes.add(new OrganizationType(1, "test org type 1"));
        organizationTypes.add(new OrganizationType(2, "test org type 2"));
        organizaitonTypeMap = new HashMap<Integer, Set<Integer>>();
        organizaitonTypeMap.put(1, new HashSet<Integer>(1,3));
        organizaitonTypeMap.put(2, new HashSet<Integer>(4,6));

        organizations = new ArrayList<Organization>();
        Organization organization1 = new Organization();
        organization1.setId(1);
        organization1.setName("Test org 1");
        Organization organization2 = new Organization();
        organization2.setId(2);
        organization2.setName("Test org 2");
        organizations.add(organization1);
        organizations.add(organization2);
    }

    @Test
    public void testOrganizationTypesIncludeOrganizationIds() throws Exception {
        when(emApiGateway.getOrganizationTypes()).thenReturn(organizationTypes);
        when(emApiGateway.getOrganizationTypeMap()).thenReturn(organizaitonTypeMap);
        List<OrganizationType> organizationTypesFromEmApi = service.getOrganizationTypesWithOrganizations();
        assertEquals(organizationTypes.size(), organizationTypesFromEmApi.size());
        assertEquals(organizaitonTypeMap.get(1), organizationTypesFromEmApi.get(0).getOrganizationIds());
        assertEquals(organizaitonTypeMap.get(2), organizationTypesFromEmApi.get(1).getOrganizationIds());
    }

    @Test
    public void testGetOrganizations() throws Exception {
        when(emApiGateway.getOrganizations()).thenReturn(organizations);
        List<Organization> organizations = service.getOrganizations();
        assertEquals(this.organizations.size(), organizations.size());
        assertEquals(1, organizations.get(0).getId());
        assertEquals("Test org 1", organizations.get(0).getName());
        assertEquals(2, organizations.get(1).getId());
        assertEquals("Test org 2", organizations.get(1).getName());
    }
}
