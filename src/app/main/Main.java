package app.main;

import app.utils.Utils;
import app.webserver.WebServer;
import java.awt.AWTException;
import java.awt.Desktop;
import java.awt.Dimension;
import java.awt.Image;
import java.awt.MenuItem;
import java.awt.PopupMenu;
import java.awt.SystemTray;
import java.awt.TrayIcon;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.net.URI;

public class Main {

    private static WebServer webserver = null;

    private static void open(String url) {
        if (Desktop.isDesktopSupported()) {
            try {
                Desktop.getDesktop().browse(new URI(url));
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
    }

    public static void main(String[] args) {
        if (!SystemTray.isSupported()) {
            System.out.println("SystemTray is not supported");
            return;
        }
        webserver = new WebServer();
        webserver.run();
        final PopupMenu popup = new PopupMenu("OpenKanban");
        final SystemTray tray = SystemTray.getSystemTray();
        final Dimension trayIconSize = tray.getTrayIconSize();
        final Image imageBlue = Utils.createImage(Main.class, "/app/images/icon.png").getScaledInstance(trayIconSize.width, trayIconSize.height, Image.SCALE_SMOOTH);
        // make red the icon when not written yet.
        // final Image imageRed = Utils.createImage(Main.class, "/app/images/icon-red.png").getScaledInstance(trayIconSize.width, trayIconSize.height, Image.SCALE_SMOOTH);
        final TrayIcon trayIcon = new TrayIcon(imageBlue);

        // Create a pop-up menu components
        MenuItem openKanban = new MenuItem("Open WebPage");
        openKanban.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                open(webserver.getWebAddress());
            }
        });
        //Add components to pop-up menu
        popup.add(openKanban);
        /*
        MenuItem writing = new MenuItem("Writing (disable)");
        writing.addActionListener((e) -> {
            webserver.setWritable(!webserver.isWritable());
            String text = webserver.isWritable() ? "enabled" : "disabled";
            writing.setLabel("Writing (" + text + ")");
        });
        popup.add(writing);        
         */
        MenuItem exitItem = new MenuItem("Exit");
        exitItem.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                webserver.stop();
                System.exit(0);
            }
        });
        popup.addSeparator();
        popup.add(exitItem);

        trayIcon.setPopupMenu(popup);
        trayIcon.setToolTip("OpenKanban");

        try {
            open(webserver.getWebAddress());
            tray.add(trayIcon);
        } catch (AWTException e) {
            System.out.println("TrayIcon could not be added.");
        }
    }

}
