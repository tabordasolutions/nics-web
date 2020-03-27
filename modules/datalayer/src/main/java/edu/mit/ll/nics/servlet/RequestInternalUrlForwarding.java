package edu.mit.ll.nics.servlet;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import edu.mit.ll.iweb.websocket.Config;

public final class RequestInternalUrlForwarding {
    private static RequestInternalUrlForwarding single_requestInternalUrlForwarding_instance = null;
    private RequestInternalUrlForwarding() {}
    private static Logger logger = LoggerFactory.getLogger(RequestInternalUrlForwarding.class);

    private static final String NICS_PROXY_BASEURL = Config.getInstance().getConfiguration().getString("nics.proxy.baseurl");
    private static final String[] NICS_PROXY_TRANSLATIONS = Config.getInstance().getConfiguration().getStringArray("nics.proxy.translations");

    public static RequestInternalUrlForwarding getInstance(){
        if (single_requestInternalUrlForwarding_instance == null)
            single_requestInternalUrlForwarding_instance = new RequestInternalUrlForwarding();

        return single_requestInternalUrlForwarding_instance;
    }

    public static String getForwardingUrl(String requestUrl) {
        String forwardingUrl = requestUrl;

        try {
            for (int i = 0; i < NICS_PROXY_TRANSLATIONS.length; i++) {
                String[] keyValue = NICS_PROXY_TRANSLATIONS[i].split("->");
                if (requestUrl.startsWith(NICS_PROXY_BASEURL + keyValue[0])) {
                    logger.debug("URL changed FROM: " + requestUrl);
                    forwardingUrl = requestUrl.replace(NICS_PROXY_BASEURL + keyValue[0], keyValue[1]);
                    logger.debug(" TO: " + forwardingUrl + " in class WFSProxyServlet");
                    break;
                }
            }
        } catch (Exception e) {
            logger.error("Error rewriting URL", e);
        }

        return forwardingUrl;
    }
}
