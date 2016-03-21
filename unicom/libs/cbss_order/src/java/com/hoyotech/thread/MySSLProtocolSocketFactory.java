package com.hoyotech.thread;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.SocketAddress;
import java.net.UnknownHostException;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;

import javax.net.SocketFactory;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import org.apache.commons.httpclient.ConnectTimeoutException;
import org.apache.commons.httpclient.Header;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.params.HttpConnectionParams;
import org.apache.commons.httpclient.protocol.Protocol;
import org.apache.commons.httpclient.protocol.ProtocolSocketFactory;
 
 
 
public class MySSLProtocolSocketFactory implements ProtocolSocketFactory {
 
  private SSLContext sslcontext = null; 
  
  private SSLContext createSSLContext() { 
      SSLContext sslcontext=null; 
      try { 
          sslcontext = SSLContext.getInstance("SSL"); 
          sslcontext.init(null, new TrustManager[]{new TrustAnyTrustManager()}, new java.security.SecureRandom()); 
      } catch (NoSuchAlgorithmException e) { 
          e.printStackTrace(); 
      } catch (KeyManagementException e) { 
          e.printStackTrace(); 
      } 
      return sslcontext; 
  } 
  
  private SSLContext getSSLContext() { 
      if (this.sslcontext == null) { 
          this.sslcontext = createSSLContext(); 
      } 
      return this.sslcontext; 
  } 
  
  public Socket createSocket(Socket socket, String host, int port, boolean autoClose) 
          throws IOException, UnknownHostException { 
      return getSSLContext().getSocketFactory().createSocket( 
              socket, 
              host,
              port, 
              autoClose 
          ); 
  } 
 
  public Socket createSocket(String host, int port) throws IOException, 
          UnknownHostException { 
      return getSSLContext().getSocketFactory().createSocket( 
              host, 
              port 
          ); 
  } 
  
  
  public Socket createSocket(String host, int port, InetAddress clientHost, int clientPort) 
          throws IOException, UnknownHostException { 
      return getSSLContext().getSocketFactory().createSocket(host, port, clientHost, clientPort); 
  } 
 
  public Socket createSocket(String host, int port, InetAddress localAddress, 
          int localPort, HttpConnectionParams params) throws IOException, 
          UnknownHostException, ConnectTimeoutException { 
      if (params == null) { 
          throw new IllegalArgumentException("Parameters may not be null"); 
      } 
      int timeout = params.getConnectionTimeout(); 
      SocketFactory socketfactory = getSSLContext().getSocketFactory(); 
      if (timeout == 0) { 
          return socketfactory.createSocket(host, port, localAddress, localPort); 
      } else { 
          Socket socket = socketfactory.createSocket(); 
          SocketAddress localaddr = new InetSocketAddress(localAddress, localPort); 
          SocketAddress remoteaddr = new InetSocketAddress(host, port); 
          socket.bind(localaddr); 
          socket.connect(remoteaddr, timeout); 
          return socket; 
      } 
  } 
  
  //自定义私有类 
  private static class TrustAnyTrustManager implements X509TrustManager { 
     
      public void checkClientTrusted(X509Certificate[] chain, String authType) throws CertificateException { 
      } 
 
      public void checkServerTrusted(X509Certificate[] chain, String authType) throws CertificateException { 
      } 
 
      public X509Certificate[] getAcceptedIssuers() { 
          return new X509Certificate[]{}; 
      } 
  }   

    /**
     * strean 转换为字符串  
     * @param in
     * @return
     * @throws IOException
     */
    public static String inputStream2String(InputStream in) throws IOException {
        StringBuffer out = new StringBuffer();
        byte[] b = new byte[4096];
        for (int n; (n = in.read(b)) != -1;) {
            out.append(new String(b, 0, n));
        }
        return out.toString();
    }


  public static void main(String[] args) {
      HttpClient http = new HttpClient();                                                      
      String url = "https://esales.10010.com/pages/sys/frame/frameValidationServlet?randamCode=1431067198268";
      Protocol myhttps = new Protocol("https", new MySSLProtocolSocketFactory(), 443); 
      Protocol.registerProtocol("https", myhttps); 
//      PostMethod post = new PostMethod(url);
      GetMethod get = new GetMethod(url);
      try {
            int response = http.executeMethod(get);
    //        String html = get.getResponseBodyAsString();
            InputStream inputStream = get.getResponseBodyAsStream();
    //        System.out.println(inputStream2String(inputStream));
    //        System.out.println(response);
            String storeFile = "./pic/"+System.currentTimeMillis() + ".jpg";
            FileOutputStream fileOutputStream = new FileOutputStream(storeFile);
            FileOutputStream output = fileOutputStream;
    //        InputStream stream = entity.getContent();
            byte[] buf = new byte[1024];
            while (inputStream.read(buf) != -1) {
                output.write(buf);
            }
            output.close();
            Header[] headers = get.getResponseHeaders();
            for(Header li:headers){
                System.out.println(li.getName());
                System.out.println(li.getValue());
            }
        }
        catch (HttpException e) {
            e.printStackTrace();
        }
        catch (IOException e) {
            e.printStackTrace();
        }
      System.out.println(System.currentTimeMillis());
  }
 
}