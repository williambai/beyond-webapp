package com.hoyotech.utils;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

public class FileHelper {
	
	private static final String DEFAULT_ENCODING = "utf-8";
	
	public static void write(String fileName, String text){
	    write(fileName, text, false);
	}

	public static void write(String fileName, String text, boolean tag) {
	    write(fileName, text, DEFAULT_ENCODING, tag);
	}
	
	public static void write(String fileName, String text, String encoding, boolean tag) {
	    OutputStreamWriter out = null;
		try {
			File f = new File(fileName);
			if (!f.exists()) {
				f.createNewFile();
			}
			
			out = new OutputStreamWriter(new FileOutputStream(f, tag), DEFAULT_ENCODING);
			out.write(text);
			out.flush();

		} catch (IOException e) {
		} finally {
			try {
				if(out != null){
				    out.close();
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}
	
	protected static String lineSeparator = System.getProperty("line.separator");
	
	public static void writeBinary(String fileName, byte[] text) {
	    FileOutputStream out = null;
        try {
            out=new FileOutputStream(fileName);
            out.write(text);
            out.flush();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                out.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

    }

	public static String readFile(String filename) {
		return readFile(filename, DEFAULT_ENCODING);
	}

	public static String readFile(String path, String encoding) {
		FileInputStream inStream = null;
		String content = "";
		try {
			inStream = load(path);
			byte[] byteBuf = new byte[inStream.available()];
			inStream.read(byteBuf);
			content = new String(byteBuf, encoding);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if (inStream != null)
					inStream.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return content;
	}

	public static FileInputStream load(String filename)
			throws FileNotFoundException {
		return new FileInputStream(filename);
	}



	public static String[] readLine(String filename, String encoding) {
		FileInputStream is = null;
		InputStreamReader inReader = null;
		BufferedReader reader = null;
		List<String> texts = new ArrayList<String>();
		try {
			is = load(filename);
			inReader = new InputStreamReader(is, encoding);
			reader = new BufferedReader(inReader);
			String line = null;

			while ((line = reader.readLine()) != null)
				texts.add(line);

		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if (is != null)
					is.close();
				if (inReader != null)
					inReader.close();
				if (reader != null)
					reader.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return texts.toArray(new String[0]);
	}

	public static String[] readLines(String filename) {
		return readLine(filename, DEFAULT_ENCODING);
	}
	
	public static String getClasspath() {
        
        URL url = Thread.currentThread().getContextClassLoader().getResource("/");
        String classpath;
        if(url== null) {
            classpath = FileHelper.class.getResource("/").toString();
        } else {
            classpath = Thread.currentThread().getContextClassLoader().getResource("/").toString();  
        }
        String path = classpath.substring(6);
        // eclipse、bat加载路径不一致
        if(path != null && !path.endsWith("/bin/")){
            path = path + "/bin/";
        }

        return  (isLinux()) ? "/" + path : path;
    }   
	
	private static boolean isLinux(){
        boolean isLinux = false;
        try {
            Properties prop = System.getProperties();
            String os = prop.getProperty("os.name");
            if("linux".equalsIgnoreCase(os)){
                isLinux = true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return isLinux;
    }

}
