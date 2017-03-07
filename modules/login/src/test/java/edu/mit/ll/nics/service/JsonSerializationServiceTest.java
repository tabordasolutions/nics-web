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

import edu.mit.ll.nics.model.Organization;
import edu.mit.ll.nics.response.OrganizationsResponse;
import org.junit.Test;
import static org.junit.Assert.assertEquals;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class JsonSerializationServiceTest {
    JsonSerializationService service = new JsonSerializationService();

    @Test
    public void testSerializeJson() throws IOException {
        List<Organization> organizations = new ArrayList<Organization>();
        String expectedJsonString = "{\"status\":200,\"message\":\"OK\",\"organizations\":[{\"name\":\"Test org 1\",\"id\":1},{\"name\":\"Test org 2\",\"id\":2}]}";
        Organization organization1 = new Organization();
        organization1.setId(1);
        organization1.setName("Test org 1");
        organization1.setCounty("Sacramento");
        Organization organization2 = new Organization();
        organization2.setId(2);
        organization2.setName("Test org 2");
        organization2.setCountry("USA");
        organizations.add(organization1);
        organizations.add(organization2);

        OrganizationsResponse response = new OrganizationsResponse(200, "OK", organizations);
        String actualJsonString = service.serializeOrganizations(response);
        assertEquals(expectedJsonString, actualJsonString);
    }

    @Test
    public void testOrganizationEquality() {
        Organization organization1 = new Organization();
        organization1.setId(1);
        organization1.setName("Test org 1");
        organization1.setCounty("Sacramento");
        organization1.setCountry("USA");
        Organization organization2 = new Organization();
        organization2.setId(1);
        organization2.setName("Test org 1");
        organization2.setCounty("Sacramento");
        organization2.setCountry("USA");
        org.junit.Assert.assertTrue(organization1.equals(organization1));
    }
}
