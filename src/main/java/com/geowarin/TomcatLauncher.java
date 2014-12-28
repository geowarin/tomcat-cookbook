package com.geowarin;

import org.apache.catalina.LifecycleException;
import org.apache.catalina.WebResourceRoot;
import org.apache.catalina.core.StandardContext;
import org.apache.catalina.startup.Tomcat;
import org.apache.catalina.webresources.StandardRoot;

import javax.servlet.ServletException;
import java.io.File;

/**
 * Date: 28/12/14
 * Time: 12:32
 *
 * @author Geoffroy Warin (http://geowarin.github.io)
 */
public class TomcatLauncher {

    public static void main(String[] args) throws ServletException, LifecycleException {
        Tomcat tomcat = new Tomcat();

        tomcat.setBaseDir("tomcat.tmp");
        tomcat.setPort(8090);
//        tomcat.enableNaming();
//        tomcat.getServer().setParentClassLoader(Thread.currentThread().getContextClassLoader());

        File webappRoot = new File("src/main/webapp");
        StandardContext ctx = (StandardContext) tomcat.addWebapp("/", webappRoot.getAbsolutePath());
//        WebResourceRoot resources = new StandardRoot(ctx);
//        for (File additionalResource : additionalResources) {
//            resources.addPreResources(new DirResourceSet(resources, "/", additionalResource.getAbsolutePath(), "/"));
//        }
//        ctx.setResources(resources);

        tomcat.start();
        tomcat.getServer().await();
    }
}
