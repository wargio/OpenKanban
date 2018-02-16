package app.webserver.handlers;

import app.webserver.Firewall;
import app.webserver.WebServer;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import java.io.IOException;
import java.io.OutputStream;

public class Save implements HttpHandler {

    private final WebServer server;

    public Save(WebServer server) {
        this.server = server;
    }

    @Override
    public void handle(HttpExchange he) throws IOException {
        String ip = he.getRemoteAddress().toString();
        if (Firewall.block(ip)) {
            System.out.println("Blocked: " + ip);
            return;
        }
        this.server.saveKanban();
        String response = "{}";
        he.getResponseHeaders().add("Content-Type", "application/json");
        he.sendResponseHeaders(200, response.length());
        try {
            OutputStream out = he.getResponseBody();
            out.write(response.getBytes());
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }

}
