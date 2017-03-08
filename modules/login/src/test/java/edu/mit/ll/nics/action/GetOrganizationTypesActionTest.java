package edu.mit.ll.nics.action;

import edu.mit.ll.nics.log.LoggerFactory;
import edu.mit.ll.nics.model.OrganizationType;
import edu.mit.ll.nics.response.OrganizationTypesResponse;
import edu.mit.ll.nics.response.Response;
import edu.mit.ll.nics.service.JsonSerializationService;
import edu.mit.ll.nics.service.OrganizationService;
import org.apache.log4j.Logger;
import org.junit.Before;
import org.junit.Test;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.MediaType;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;

public class GetOrganizationTypesActionTest {

    private GetOrganizationTypesAction action;
    private OrganizationService organizationService = mock(OrganizationService.class);
    private JsonSerializationService jsonSerializationService = mock(JsonSerializationService.class);
    private LoggerFactory loggerFactory = mock(LoggerFactory.class);
    private Logger logger = mock(Logger.class);
    private HttpServletRequest request = mock(HttpServletRequest.class);
    private HttpServletResponse response = mock(HttpServletResponse.class);
    private ServletOutputStream outputStream = mock(ServletOutputStream.class);

    @Before
    public void setup() throws IOException {
        when(loggerFactory.getLogger(GetOrganizationTypesAction.class)).thenReturn(logger);
        when(response.getOutputStream()).thenReturn(outputStream);
        action = new GetOrganizationTypesAction(loggerFactory, organizationService, jsonSerializationService);
    }

    @Test
    public void testGetOrganizationTypes() throws IOException {
        List<OrganizationType> organizationTypes = new ArrayList<OrganizationType>();
        OrganizationType type1 = new OrganizationType(1, "Jedi");
        OrganizationType type2 = new OrganizationType(2, "Army of Clones");
        organizationTypes.add(type1);
        organizationTypes.add(type2);
        OrganizationTypesResponse responseBody = new OrganizationTypesResponse(HttpServletResponse.SC_OK, "OK", organizationTypes);
        String responseBodyString = "Jedi Response";

        when(organizationService.getOrganizationTypesWithOrganizations()).thenReturn(organizationTypes);
        when(jsonSerializationService.serialize(responseBody)).thenReturn(responseBodyString);

        action.handle(request, response);
        verify(organizationService).getOrganizationTypesWithOrganizations();
        verify(jsonSerializationService).serialize(responseBody);
        verify(response).setStatus(HttpServletResponse.SC_OK);
        verify(response).setContentType(MediaType.APPLICATION_JSON);
        verify(outputStream).write(responseBodyString.getBytes());
        verify(outputStream).flush();
    }

    @Test
    public void testFailingGetOrganizationTypes() throws IOException {
        RuntimeException exception = new RuntimeException("Error");
        Response errorResponse =  new Response(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,"Failed to retrieve Organization Types: " + exception.getMessage());
        String errorResponseJson = "Error";
        when(organizationService.getOrganizationTypesWithOrganizations()).thenThrow(exception);
        when(jsonSerializationService.serialize(errorResponse)).thenReturn(errorResponseJson);

        action.handle(request, response);
        verify(organizationService).getOrganizationTypesWithOrganizations();
        verify(jsonSerializationService).serialize(errorResponse);
        verify(response).setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        verify(response).setContentType(MediaType.APPLICATION_JSON);
        verify(outputStream).write(errorResponseJson.getBytes());
        verify(outputStream).flush();
    }
}