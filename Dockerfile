FROM tomcat:8-jre7

COPY webapp/target/nics.war /usr/local/tomcat/webapps/.
