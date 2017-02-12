# NICS Web Application

## Building

You can build a 'debug' build using:

    mvn package 

Or a 'production' build using:

    mvn package -Dproduction


Both options will build nics.war to the webapp/target/ directory.

## Configuration

The NICS Web Application requires the following configuration files:

* AMConfig.properties
* core.properties
* newUserEnabledTemplate.txt.erb
* openam.properties
* openam-tools.properties
* sso-tools.properties

These configuration files will be loaded from /opt/data/nics/config directory unless changed using the config.xml file,
the default version of which can be found at ```webapp/src/main/resources/config.xml``` in the source repository.


## Docker Support

The NICS Web Application provides a Dockerfile capable of running the application as a Docker container based on Tomcat.

Follow these steps to build the docker container:

1. Build the WAR file (see above)
1. Place the required application configuration files in the ```config``` directory
1. Build the Docker image [using the Docker build command](https://docs.docker.com/engine/reference/commandline/build/)

## Documentation

Further documentation is available in the [NICS Common Wiki](https://github.com/tabordasolutions/nics-common/wiki).

## Frequently Asked Questions

### What is the difference between a debug and production build?

A production build takes some extra steps to optimize the static resources like minifying the Javascript.

### What are these 'modules'?

Each 'module' is a maven jar project. It will package any compiled Java code for that module, plus any static resources
(Javascript, CSS, Images) in [META-INF/resources](https://blogs.oracle.com/alexismp/entry/web_inf_lib_jar_meta). When
these jars are included in the webapp WAR project, they Java will be executed at runtime and the static resources will
be available.

### How do I use these modules?

Just add the module as a dependency of the webapp WAR project and add any code to bootstrap your module. This will
likely include adding your module to main.js in the webapp and adding html link tags for your CSS to be included. 

