package app.webserver;

public class Firewall {

    public static boolean block(String ip) {
        return !(ip.startsWith("/localhost") || ip.startsWith("/192.168.") || ip.startsWith("/127.0."));
    }
}
