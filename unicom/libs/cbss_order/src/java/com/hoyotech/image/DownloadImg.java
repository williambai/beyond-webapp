package com.hoyotech.image;

import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import javax.imageio.ImageIO;

import com.hoyotech.utils.HttpsTool;

public class DownloadImg {

    public static void ttt() throws IOException{
        String path = "./pic/6bd2f16c-0559-467e-b3eb-f2a47bf2c897.jpg";
//        String text = getAllOcr(path);  
//        System.out.println(path + " = " + text);  
        BufferedImage img = ImageIO.read(new File(path));  
        int width = img.getWidth();  
        int height = img.getHeight();  
//        System.out.println(width +" "+height);
        for (int y = 0; y < height; ++y) {  
            for (int x = 0; x < width; ++x) {  
                Color color = new Color(img.getRGB(x, y)); 
                System.out.print(color.getRed()+","+color.getGreen()+","+color.getBlue()+"\t");
            }  
            System.out.println();
        }  
    }
    public static void download() throws Exception{
      Map<String,String> picHeader = new HashMap<String,String>();
      String picUrl = "https://hb.cbss.10010.com/image?mode=validate&width=60&height=20";
      for(int i=0;i<300;i++){
          String name = UUID.randomUUID().toString()+".jpg";
          String savePath = "./pic/"+name;
          HttpsTool.downloadPicture(picUrl, picHeader, savePath);
          BufferedImage img = ImagePreProcess.removeBackgroud(savePath); 
          String save = "./picc/"+name;
          ImageIO.write(img, "jpg", new File(save));
          String text = ImagePreProcess.getAllOcr(savePath);  
          System.out.println(savePath + " = " + text);  
      }
    }
    public static void main(String[] args) throws Exception {
        download();
//        ttt();
    }
}
