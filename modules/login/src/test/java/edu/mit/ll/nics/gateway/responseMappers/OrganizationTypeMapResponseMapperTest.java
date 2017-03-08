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
package edu.mit.ll.nics.gateway.responseMappers;

import org.junit.Test;

import java.util.Map;
import java.util.Set;

import static org.junit.Assert.*;

public class OrganizationTypeMapResponseMapperTest {
    OrganizationTypeMapResponseMapper mapper = new OrganizationTypeMapResponseMapper();

    @Test
    public void testParsingOrganizationTypeMap() throws Exception {
        String json = "{\"message\":\"ok\",\"orgAdminList\":null,\"orgTypes\":[],\"orgOrgTypes\":[{\"orgOrgtypeid\":0,\"orgid\":4,\"orgtypeid\":4,\"org\":null,\"orgtype\":null},{\"orgOrgtypeid\":0,\"orgid\":2,\"orgtypeid\":8,\"org\":null,\"orgtype\":null},{\"orgOrgtypeid\":0,\"orgid\":1,\"orgtypeid\":8,\"org\":null,\"orgtype\":null}],\"count\":3,\"organizations\":[]}";
        Map<Integer, Set<Integer>> organizationTypeMap = mapper.mapResponse(json);
        assertNotNull(organizationTypeMap);
        assertEquals(organizationTypeMap.size(), 2);
        Set<Integer> organizationIds = organizationTypeMap.get(8);
        assertEquals(2, organizationIds.size());
        assertTrue(organizationIds.contains(1));
        assertTrue(organizationIds.contains(2));
        organizationIds = organizationTypeMap.get(4);
        assertEquals(1, organizationIds.size());
        assertTrue(organizationIds.contains(4));
    }

    @Test
    public void testParsingZeroOrganizations() throws Exception {
        String json = "{\"message\":\"ok\",\"orgAdminList\":null,\"orgTypes\":[],\"orgOrgTypes\":[],\"count\":0,\"organizations\":[]}";
        Map<Integer, Set<Integer>> organizationTypes = mapper.mapResponse(json);
        assertNotNull(organizationTypes);
        assertEquals(0, organizationTypes.size());
    }

    @Test(expected = Exception.class)
    public void testParsingInvalidResponseThrowsException() throws Exception {
        String json = "Just unexpected response";
        mapper.mapResponse(json);
    }
}
