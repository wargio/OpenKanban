package app.webserver.handlers;

import app.utils.Utils;
import app.webserver.Firewall;
import app.webserver.WebServer;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import java.io.BufferedOutputStream;
import java.io.ByteArrayInputStream;
import java.io.IOException;

public class WebFile implements HttpHandler {

    private final WebServer server;

    public WebFile(WebServer server) {
        this.server = server;
    }

    private String resource(String name) {
        if (name.startsWith("/")) {
            name = name.substring(1);
        }
        return Utils.resource(getClass(), "/webroot/" + name);
    }

    @Override
    public void handle(HttpExchange he) throws IOException {
        String ip = he.getRemoteAddress().toString();
        if (Firewall.block(ip)) {
            System.out.println("Blocked: " + ip);
            return;
        }
        int code = 404;
        String path = he.getRequestURI().getPath().trim();
        String type = "text/html; charset=UTF-8";
        String response = "<html><body><h1>404 not found</h1></body></html>";
        if (!path.contains("..")) {
            code = 200;
            if (path.equals("/")) {
                response = resource("index.html");
            } else if (path.equals("/kanban")) {
                String request = Utils.stringifyStream(he.getRequestBody()).trim();
                if (!request.isEmpty()) {
                    //System.out.println(request);
                    server.setKanbanData(request);
                }
                response = server.getKanbanData();
                type = "application/json";
            } else if (path.endsWith(".js")) {
                response = resource(path);
                type = "text/javascript";
            } else if (path.endsWith(".css")) {
                response = resource(path);
                type = "text/css";
            } else {
                response = "<html><body><h1>404 not found</h1></body></html>";
                code = 404;
            }
        }
        he.getResponseHeaders().add("Content-Type", type);
        byte[] bytes = response.getBytes();
        he.sendResponseHeaders(code, bytes.length);
        try {
            BufferedOutputStream out = new BufferedOutputStream(he.getResponseBody());
            ByteArrayInputStream bis = new ByteArrayInputStream(bytes);
            byte[] buffer = new byte[512];
            int count;
            while ((count = bis.read(buffer)) != -1) {
                out.write(buffer, 0, count);
            }
            out.flush();
            out.close();
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }

}
