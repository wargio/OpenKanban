package app.utils;

import app.main.Main;
import java.awt.Image;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import javax.imageio.ImageIO;

public class Utils {

    public static String stringifyStream(InputStream is) {
        String data = "";
        try {
            BufferedInputStream in = new BufferedInputStream(is);
            byte[] contents = new byte[1024];
            int bytesRead;
            String strFileContents;
            while ((bytesRead = in.read(contents)) != -1) {
                data += new String(contents, 0, bytesRead);
            }
        } catch (IOException ex) {
            ex.printStackTrace();
        }
        return data;
    }

    public static String resource(Class c, String path) {
        return stringifyStream(c.getResourceAsStream(path));
    }

    public static String resourceFile(String path) {
        try {
            return stringifyStream(new FileInputStream(path));
        } catch (FileNotFoundException ex) {
            ex.printStackTrace();
        }
        return "";
    }

    public static Image createImage(Class c, String path) {
        try {
            return ImageIO.read(c.getResourceAsStream(path));
        } catch (IOException ex) {
            ex.printStackTrace();
        }
        return null;
    }

    public static void writeFile(byte[] data, String path) {
        try {
            BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(path));
            bos.write(data);
            bos.flush();
            bos.close();
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }
}
