package edu.mit.ll.nics.response;

import edu.mit.ll.nics.model.OrganizationType;
import org.apache.commons.lang.builder.EqualsBuilder;

import java.util.List;

public class OrganizationTypesResponse extends Response {
    private List<OrganizationType> organizationTypes;

    public OrganizationTypesResponse(int status, String message, List<OrganizationType> organizationTypes) {
        super(status, message);
        this.organizationTypes = organizationTypes;
    }

    public List<OrganizationType> getOrganizationTypes() {
        return this.organizationTypes;
    }

    public boolean equals(Object o) {
        return EqualsBuilder.reflectionEquals(this, o);
    }
}
