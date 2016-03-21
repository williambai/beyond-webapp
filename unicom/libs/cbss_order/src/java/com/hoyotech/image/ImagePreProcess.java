package com.hoyotech.image;

import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.imageio.ImageIO;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.io.IOUtils;
import org.apache.log4j.Logger;

import com.hoyotech.thread.CbssOrderController;
  
public class ImagePreProcess {  
  
    private static Logger logger = Logger.getLogger(ImagePreProcess.class);
	/**
	 * 判断像素是否是白色
	 * @param colorInt
	 * @return
	 */
    public static int isWhite(int colorInt) {  
        Color color = new Color(colorInt);  
        if (color.getRed() + color.getGreen() + color.getBlue() > 330) {  
            return 1;  
        }  
        return 0;  
    }  
  
    /**
     * 判断像素是否是黑色
     * @param colorInt
     * @return
     */
    public static int isBlack(int colorInt) {  
        Color color = new Color(colorInt);  
        if (color.getRed() + color.getGreen() + color.getBlue() <= 330) {  
            return 1;  
        }  
        return 0;  
    }  
  
    /**
     * 将图像设置为黑白图片
     * @param picFile
     * @return
     * @throws Exception
     */
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
  
    /**
     * 将输入的验证码图片切分成4个不同字母的图片
     * @param img
     * @return
     * @throws Exception
     */
    public static List<BufferedImage> splitImage(BufferedImage img)  
            throws Exception {  
        List<BufferedImage> subImgs = new ArrayList<BufferedImage>();  
        subImgs.add(img.getSubimage(0, 0, 15, 20));  
        subImgs.add(img.getSubimage(15, 0, 15, 20));  
        subImgs.add(img.getSubimage(30, 0, 15, 20));  
        subImgs.add(img.getSubimage(45, 0, 15, 20));  
        return subImgs;  
    }  

   /**
    *  载入训练集，并将图片和对应的字母关联
    * @return
    * @throws Exception
    */
    public static Map<BufferedImage, String> loadTrainData() throws Exception {  
        Map<BufferedImage, String> map = new HashMap<BufferedImage, String>();  
        File dir = new File("train");  
        File[] files = dir.listFiles();  
        for (File file : files) {  
        	if(file.isDirectory()){
        		File[] fi = file.listFiles();
        		for(File l:fi){
        			map.put(ImageIO.read(l), file.getName().charAt(0) + "");  
        		}
        	}
        }  
        return map;  
    }  
  
    /**
     * 判断图片包含的字母
     * @param img
     * @param map
     * @return
     */
    public static String getSingleCharOcr(BufferedImage img,  
            Map<BufferedImage, String> map) {  
        String result = "";  
        int width = img.getWidth();  
        int height = img.getHeight();  
        int min = width * height;  
        for (BufferedImage bi : map.keySet()) {  
            int count = 0;  
            Label1: for (int x = 0; x < width; ++x) {  
                for (int y = 0; y < height; ++y) {  
                    if (isWhite(img.getRGB(x, y)) != isWhite(bi.getRGB(x, y))) {  
                        count++;  
                        if (count >= min)  
                            break Label1;  
                    }  
                }  
            }  
            if (count < min) {  
                min = count;  
                result = map.get(bi);  
            }  
        }  
        return result;  
    }  
  
    /**
     * 获取下载的验证码图片并识别出验证码
     * @param file
     * @return
     * @throws Exception
     */
    public static String getAllOcr(String file) throws Exception {  
        BufferedImage img = removeBackgroud(file);  
        List<BufferedImage> listImg = splitImage(img);  
        Map<BufferedImage, String> map = loadTrainData();  
        String result = "";  
        for (BufferedImage bi : listImg) {  
            result += getSingleCharOcr(bi, map);  
        }  
        ImageIO.write(img, "JPG", new File("./result/"+result+".jpg"));  
        return result;  
    }  
  
    /**
     * 下载图片
     */
    public static void downloadImage() {  
        HttpClient httpClient = new HttpClient();  
        GetMethod getMethod = new GetMethod(  
                "http://www.puke888.com/authimg.php");  
        for (int i = 0; i < 30; i++) {  
            try {  
                // 执行getMethod  
                int statusCode = httpClient.executeMethod(getMethod);  
                if (statusCode != HttpStatus.SC_OK) {  
                    System.err.println("Method failed: "  
                            + getMethod.getStatusLine());  
                }  
                // 读取内容  
                String picName = "img//" + i + ".jpg";  
                InputStream inputStream = getMethod.getResponseBodyAsStream();  
                OutputStream outStream = new FileOutputStream(picName);  
                IOUtils.copy(inputStream, outStream);  
                outStream.close();  
                System.out.println("OK!");  
            } catch (Exception e) {  
                e.printStackTrace();  
            } finally {  
                // 释放连接  
                getMethod.releaseConnection();  
            }  
        }  
    }  
  
    /** 
     * @param args 
     * @throws Exception 
     */  
    public static void main(String[] args) throws Exception {  
        File file = new File("./pic");
        File[] listFile = file.listFiles();
        for(File li:listFile){
            String path = li.getAbsolutePath();
            String text = getAllOcr(path);  
            System.out.println(path + " = " + text);  
        }
    }  
}  