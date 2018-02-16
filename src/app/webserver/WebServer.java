package app.webserver;

import app.utils.Utils;
import app.webserver.handlers.Save;
import app.webserver.handlers.WebFile;
import com.sun.net.httpserver.HttpServer;
import java.io.File;
import java.io.IOException;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.URISyntaxException;
import org.json.JSONException;
import org.json.JSONObject;

public class WebServer {
    
    private static final String JSON_WRITABLE = "writable";
    
    private static String jarPath = null;
    private HttpServer server = null;
    private final String kanbanData;
    private JSONObject data = null;
    private boolean writable = false;
    
    public WebServer() {
        kanbanData = (new File(getJARPath() + File.separator + "kanbandata.json")).getAbsolutePath();
        try {
            data = new JSONObject(Utils.resourceFile(kanbanData));
        } catch (Exception ex) {
            data = new JSONObject(Utils.resource(getClass(), "/app/config/default.json"));
            System.err.println("Exception: " + ex.getClass().getName() + " :" + ex.getMessage());
        }
    }
    
    public void run() {
        try {
            server = HttpServer.create(new InetSocketAddress(InetAddress.getByName("localhost"), 0), 0);
            server.createContext("/save", new Save(this));
            server.createContext("/", new WebFile(this));
            server.start();
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }
    
    public void stop() {
        server.stop(0);
    }
    
    public static String getJARPath() {
        if (jarPath == null) {
            try {
                jarPath = (new File(WebServer.class.getProtectionDomain().getCodeSource().getLocation().toURI().getPath())).getParentFile().getAbsolutePath();
            } catch (URISyntaxException ex) {
            }
        }
        return jarPath;
    }
    
    public synchronized String getWebAddress() {
        InetSocketAddress isa = server.getAddress();
        String host = isa.getHostName();
        if (host.equals("0:0:0:0:0:0:0:0")) {
            host = "localhost";
        }
        return "http://" + host + ":" + isa.getPort();
    }
    
    public synchronized void saveKanban() {
        if (writable) {
            System.out.println("Saving data.");
            writejson(data, kanbanData);
        }
    }
    
    private synchronized void writejson(JSONObject object, String path) {
        Utils.writeFile(object.toString(4).getBytes(), path);
    }
    
    public String getKanbanData() {
        data.put(JSON_WRITABLE, writable);
        return data.toString();
    }
    
    public synchronized void setKanbanData(String data) {
        JSONObject object = null;
        try {
            object = new JSONObject(data);
        } catch (JSONException ex) {
            ex.printStackTrace();
        }
        if (object != null && object.has(JSON_WRITABLE)) {
            writable = object.getBoolean(JSON_WRITABLE);
        }
        if (writable) {
            this.data = object;
        }
    }
    
    public synchronized void setWritable(boolean enable) {
        this.writable = enable;
    }
    
    public synchronized boolean isWritable() {
        return writable;
    }
    
}
