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

import edu.mit.ll.iweb.websocket.Config;
import edu.mit.ll.nics.log.LoggerFactory;
import edu.mit.ll.nics.util.CookieTokenUtil;
import org.springframework.context.annotation.*;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import java.net.MalformedURLException;
import java.net.URL;

@ComponentScan("edu.mit.ll.nics")
@Configuration
public class SpringConfiguration {
    private static AnnotationConfigApplicationContext context = null;

    @Bean
    public org.apache.commons.configuration.Configuration configuration() {
        return Config.getInstance().getConfiguration();
    }

    @Bean
    public LoggerFactory loggerFactory() {
        return new LoggerFactory();
    }

    @Bean(name = "restEndpoint")
    public URL restEndpoint() throws MalformedURLException {
        return new URL(configuration().getString("endpoint.rest"));
    }

    @Bean(name = "internalRestEndpoint")
    public URL internalRestEndpoint() throws MalformedURLException {
        return new URL(configuration().getString("endpoint.internalrest"));
    }

    @Bean
    @Scope("prototype")
    public CookieTokenUtil cookieTokenUtil() {
        return new CookieTokenUtil();
    }

    @Bean
    public Client client() {
        return ClientBuilder.newClient();
    }

    public static AnnotationConfigApplicationContext getContext() {
        if(context == null)
            context = new AnnotationConfigApplicationContext(SpringConfiguration.class);
        return context;
    }
}