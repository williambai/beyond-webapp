package com.hoyotech.image;

import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.File;

import javax.imageio.ImageIO;

public class ImageHandler {
    public static int isWhite(int colorInt) {  
        Color color = new Color(colorInt);  
        if (color.getRed() + color.getGreen() + color.getBlue() > 100) {  
            return 1;  
        }  
        return 0;  
    }  
  
    public static BufferedImage removeBackgroud(String picFile)  
            throws Exception {  
        BufferedImage img = ImageIO.read(new File(picFile));  
        int width = img.getWidth();  
        int height = img.getHeight();  
        for (int x = 0; x < width; ++x) {  
            for (int y = 0; y < height; ++y) {  
                if (isWhite(img.getRGB(x, y)) == 1) {  
                    img.setRGB(x, y, Color.WHITE.getRGB());  
                } else {  
                    img.setRGB(x, y, Color.BLACK.getRGB());  
                }  
            }  
        }  
        return img;  
    } 
    public static void main(String[] args) throws Exception {
//        String path = "./pic/1432888238209.jpg";

//        BufferedImage image = removeBackgroud(path);
        File file = new File("./pic");
        File[] listFile = file.listFiles();
        int j = 0;
        for(File li:listFile){
//            BufferedImage img = ImageIO.read(li);  
            BufferedImage img = ImagePreProcess.removeBackgroud(li.getPath()); 
            String savePath = "./picc/"+li.getName();
            ImageIO.write(img, "jpg", new File(savePath));
//            int width = img.getWidth();  
//            int height = img.getHeight();  
//            System.out.println(width);
//            System.out.println(height);
//            for(int i=0;i<4;i++){
//                j++;
//                String path = "./train/"+j+".jpg";
//                BufferedImage bi = img.getSubimage(0+15*i, 0, 15, 20);
//                ImageIO.write(bi, "jpg", new File(path));
//            }
        }
    }
}
