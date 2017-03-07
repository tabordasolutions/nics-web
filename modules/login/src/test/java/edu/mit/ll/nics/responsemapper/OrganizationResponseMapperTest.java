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
package edu.mit.ll.nics.responsemapper;

import edu.mit.ll.nics.model.Organization;
import org.junit.Test;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;

import java.util.List;

public class OrganizationResponseMapperTest {
    OrganizationResponseMapper mapper = new OrganizationResponseMapper();

    @Test
    public void testParsingOrganizations() throws Exception {
        String json = "{\"message\":\"ok\",\"orgAdminList\":null,\"orgTypes\":[],\"orgOrgTypes\":[],\"count\":1,\"organizations\":[{\"orgId\":1,\"name\":\"Testers a 1\",\"county\":\"Sacramento\",\"state\":\"CA\",\"timezone\":null,\"prefix\":\"o1\",\"distribution\":\"dist\",\"defaultlatitude\":38.895,\"defaultlongitude\":-77.03667,\"parentorgid\":1,\"country\":\"USA\",\"created\":null,\"userorgs\":[],\"orgTypes\":[{\"orgOrgtypeid\":0,\"orgid\":1,\"orgtypeid\":8,\"orgtype\":null,\"org\":null}]}]}]}";
        List<Organization> organizationTypes = mapper.mapResponse(json);
        assertNotNull(organizationTypes);
        assertEquals(organizationTypes.size(), 1);
        Organization organizationType = organizationTypes.get(0);
        assertEquals(1, organizationType.getId());
        assertEquals("Testers a 1", organizationType.getName());
    }

    @Test
    public void testParsingMultipleOrganizations() throws Exception {
        String json = "{\"message\":\"ok\",\"orgAdminList\":null,\"orgTypes\":[],\"orgOrgTypes\":[],\"count\":4,\"organizations\":[{\"orgId\":4,\"name\":\"Org with multiple types\",\"county\":\"sacramento\",\"state\":\"ca\",\"timezone\":null,\"prefix\":\"\",\"distribution\":\"\",\"defaultlatitude\":0.0,\"defaultlongitude\":0.0,\"parentorgid\":null,\"country\":\"USA\",\"created\":null,\"userorgs\":[],\"orgTypes\":[{\"orgOrgtypeid\":0,\"orgid\":4,\"orgtypeid\":9,\"orgtype\":null,\"org\":null},{\"orgOrgtypeid\":0,\"orgid\":4,\"orgtypeid\":14,\"orgtype\":null,\"org\":null},{\"orgOrgtypeid\":0,\"orgid\":4,\"orgtypeid\":4,\"orgtype\":null,\"org\":null}]},{\"orgId\":2,\"name\":\"Test\",\"county\":\"Sacramento\",\"state\":\"CA\",\"timezone\":null,\"prefix\":\"\",\"distribution\":\"\",\"defaultlatitude\":0.0,\"defaultlongitude\":0.0,\"parentorgid\":null,\"country\":null,\"created\":null,\"userorgs\":[],\"orgTypes\":[{\"orgOrgtypeid\":0,\"orgid\":2,\"orgtypeid\":8,\"orgtype\":null,\"org\":null}]},{\"orgId\":1,\"name\":\"Testers a 1\",\"county\":\"Sacramento\",\"state\":\"CA\",\"timezone\":null,\"prefix\":\"o1\",\"distribution\":null,\"defaultlatitude\":38.895,\"defaultlongitude\":-77.03667,\"parentorgid\":null,\"country\":\"USA\",\"created\":null,\"userorgs\":[],\"orgTypes\":[{\"orgOrgtypeid\":0,\"orgid\":1,\"orgtypeid\":8,\"orgtype\":null,\"org\":null}]},{\"orgId\":3,\"name\":\"Test Federal IMT Org\",\"county\":\"Sac\",\"state\":\"CA\",\"timezone\":null,\"prefix\":\"CA Sac\",\"distribution\":\"\",\"defaultlatitude\":0.0,\"defaultlongitude\":0.0,\"parentorgid\":null,\"country\":\"US\",\"created\":null,\"userorgs\":[],\"orgTypes\":[{\"orgOrgtypeid\":0,\"orgid\":3,\"orgtypeid\":14,\"orgtype\":null,\"org\":null}]}]}";
        List<Organization> organizations = mapper.mapResponse(json);
        assertNotNull(organizations);
        assertEquals(organizations.size(), 4);
        assertFalse(organizations.contains(null));
    }

    @Test
    public void testParsingZeroOrganizations() throws Exception {
        String json = "{\"message\":\"ok\",\"orgAdminList\":null,\"orgTypes\":[],\"orgOrgTypes\":[],\"count\":0,\"organizations\":[]}";
        List<Organization> organizations = mapper.mapResponse(json);
        assertNotNull(organizations);
        assertEquals(0, organizations.size());
    }

    @Test(expected = Exception.class)
    public void testParsingInvalidResponseThrowsException() throws Exception {
        String json = "Just unexpected response";
        mapper.mapResponse(json);
    }
}
