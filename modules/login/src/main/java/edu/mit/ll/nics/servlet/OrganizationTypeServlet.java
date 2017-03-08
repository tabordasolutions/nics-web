package edu.mit.ll.nics.servlet;

import edu.mit.ll.nics.action.GetOrganizationTypesAction;
import edu.mit.ll.nics.config.SpringConfiguration;
import org.apache.log4j.Logger;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/organizationTypes")
public class OrganizationTypeServlet extends HttpServlet {

    private static Logger logger = Logger.getLogger(OrganizationTypeServlet.class);
    private final ApplicationContext context;

    OrganizationTypeServlet(ApplicationContext context) {
        this.context = context;
    }

    public OrganizationTypeServlet() {
        this.context = new AnnotationConfigApplicationContext(SpringConfiguration.class);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        context.getBean(GetOrganizationTypesAction.class);
    }

}
