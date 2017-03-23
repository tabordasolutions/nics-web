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
package edu.mit.ll.nics.configuration;

import edu.mit.ll.nics.action.GetEmailVerificationAction;
import edu.mit.ll.nics.action.GetOrganizationTypesAction;
import edu.mit.ll.nics.action.GetOrganizationsAction;
import edu.mit.ll.nics.gateway.EmApiGateway;
import edu.mit.ll.nics.service.JsonSerializationService;
import edu.mit.ll.nics.service.OrganizationService;
import org.apache.commons.configuration.Configuration;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import static org.springframework.util.Assert.*;

public class SpringConfigurationTest {
    private AnnotationConfigApplicationContext context;
    @Before
    public void setUp() throws Exception {
        context = new AnnotationConfigApplicationContext(SpringConfiguration.class);
    }

    @Test
    public void hasEmApiGateway() {
        isInstanceOf(EmApiGateway.class, context.getBean(EmApiGateway.class));
    }

    @Test
    public void hasConfiguration() {
        isInstanceOf(Configuration.class, context.getBean(Configuration.class));
    }

    @Test
    public void hasGetOrganizationsAction() {
        isInstanceOf(GetOrganizationsAction.class, context.getBean(GetOrganizationsAction.class));
    }

    @Test
    public void hasGetOrganizationTypesAction() {
        isInstanceOf(GetOrganizationTypesAction.class, context.getBean(GetOrganizationTypesAction.class));
    }

    @Test
    public void hasGetEmailVerificationAction() {
        isInstanceOf(GetEmailVerificationAction.class, context.getBean(GetEmailVerificationAction.class));
    }

    @Test
    public void hasOrganizationService() {
        isInstanceOf(OrganizationService.class, context.getBean(OrganizationService.class));
    }

    @Test
    public void hasJsonSerializationService() {
        isInstanceOf(JsonSerializationService.class, context.getBean(JsonSerializationService.class));
    }
}
