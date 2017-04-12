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

import edu.mit.ll.nics.model.OrganizationType;
import org.junit.Test;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;

import java.util.List;

public class OrganizationTypeResponseMapperTest {
    OrganizationTypeResponseMapper mapper = new OrganizationTypeResponseMapper();

    @Test
    public void testParsingOrganizations() throws Exception {
        String json = "{\"message\":\"ok\",\"orgAdminList\":null,\"orgTypes\":[{\"orgTypeId\":11,\"orgTypeName\":\"Federal\",\"orgOrgTypes\":[]}],\"orgOrgTypes\":[],\"count\":1,\"organizations\":[]}";
        List<OrganizationType> organizationTypes = mapper.mapResponse(json);
        assertNotNull(organizationTypes);
        assertEquals(organizationTypes.size(), 1);
        OrganizationType organizationType = organizationTypes.get(0);
        assertEquals(11, organizationType.getId());
        assertEquals("Federal", organizationType.getName());
    }

    @Test
    public void testParsingMultipleOrganizations() throws Exception {
        String json = "{\"message\":\"ok\",\"orgAdminList\":null,\"orgTypes\":[{\"orgTypeId\":2,\"orgTypeName\":\"Academia\",\"orgOrgTypes\":[]},{\"orgTypeId\":13,\"orgTypeName\":\"CDF IMT\",\"orgOrgTypes\":[]},{\"orgTypeId\":8,\"orgTypeName\":\"Corporate\",\"orgOrgTypes\":[]},{\"orgTypeId\":11,\"orgTypeName\":\"Federal\",\"orgOrgTypes\":[]}],\"orgOrgTypes\":[],\"count\":4,\"organizations\":[]}";
        List<OrganizationType> organizationTypes = mapper.mapResponse(json);
        assertNotNull(organizationTypes);
        assertEquals(organizationTypes.size(), 4);
        assertFalse(organizationTypes.contains(null));
    }

    @Test
    public void testParsingZeroOrganizations() throws Exception {
        String json = "{\"message\":\"ok\",\"orgAdminList\":null,\"orgTypes\":[],\"orgOrgTypes\":[],\"count\":0,\"organizations\":[]}";
        List<OrganizationType> organizationTypes = mapper.mapResponse(json);
        assertNotNull(organizationTypes);
        assertEquals(0, organizationTypes.size());
    }

    @Test(expected = Exception.class)
    public void testParsingInvalidResponseThrowsException() throws Exception {
        String json = "Just unexpected response";
        mapper.mapResponse(json);
    }
}

