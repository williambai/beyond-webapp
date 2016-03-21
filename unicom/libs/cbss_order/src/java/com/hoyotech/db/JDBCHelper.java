package com.hoyotech.db;

import java.lang.reflect.Constructor;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.isa.pims.basic.BeanUtils;

/**
 * JDBC 工具类 来自 basic 包
 * 
 * @author HaHa
 */
public class JDBCHelper {

private static final Logger log = LoggerFactory.getLogger(JDBCHelper.class);
	/**
	 * 执行sql，根据查询结果，动态反射组装成list返回 注意：使用的是Constructor，要求构造器中顺序和查询顺序必须相同
	 * 没有做类型转换，所以clazz的字段为 String
	 * 
	 * @param clazz
	 *            实体Bean
	 * @param paramLength
	 *            指定需要使用的构造器长度
	 * @param conditionSql
	 *            查询sql语句
	 * @param values
	 *            查询条件的值集合
	 * @return
	 */
	public static List queryBySql(final Class clazz, final int paramLength,
			final String conditionSql, final Object[] values) {

		Connection conn,tmpconn = null;
		List list = new ArrayList();
		ResultSet rs = null;
		PreparedStatement pstmt = null;
		ResultSetMetaData meta = null;
		int columnLength = 0;

		Object[] columnValues = null; // 列
		try {
			
			if(DBConnectionPool.isTransacionStart()){
				conn = DBConnectionPool.getInstance().getTransConn();
				conn.setAutoCommit(false);
			}
			else{
				conn = DBConnectionPool.getInstance().getConnection();
				conn.setAutoCommit(true);
				tmpconn = conn;
			}
			
			pstmt = conn.prepareStatement(conditionSql,ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_READ_ONLY);

			if (values != null) {
				for (int i = 0; i < values.length; i++) {
					pstmt.setObject(i + 1, values[i]);
				}
			}
			rs = pstmt.executeQuery();

			if (rs.next()) {
				meta = rs.getMetaData();
				columnLength = meta.getColumnCount();
				if (columnLength > 0) {
					columnValues = new Object[columnLength];
				}
				rs.beforeFirst();
			}
			// ResultSet 沒有 列
			if (columnLength < 1 || columnValues == null)
				return list;

			while (rs.next()) {
				for (int i = 0; i < columnLength; i++) {
					columnValues[i] = rs.getString(i + 1);
				}
				Constructor constructor = BeanUtils.getConstructor(clazz,paramLength);
				Object temp = constructor.newInstance(columnValues);
				list.add(temp);
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			closeJDBCResources(rs,pstmt,tmpconn);
		}
		return list;
	}

	/**
	 * 执行sql，根据查询结果，动态反射组装成list返回 注意：使用的是Constructor，要求构造器中顺序和查询顺序必须相同
	 * 没有做类型转换，所以clazz的字段为 String
	 * 
	 * @param clazz
	 *            实体Bean
	 * @param paramLength
	 *            指定需要使用的构造器长度
	 * @param conditionSql
	 *            查询sql语句
	 * @param values
	 *            查询条件的值集合
	 * @return
	 */
	public static List queryBySql(Connection conn,final Class clazz, final int paramLength,
			final String conditionSql, final Object[] values) {

		List list = new ArrayList();
		ResultSet rs = null;
		PreparedStatement pstmt = null;
		ResultSetMetaData meta = null;
		int columnLength = 0;

		Object[] columnValues = null; // 列類型
		try {
			
			
			pstmt = conn.prepareStatement(conditionSql,ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_READ_ONLY);

			if (values != null) {
				for (int i = 0; i < values.length; i++) {
					pstmt.setObject(i + 1, values[i]);
				}
			}
			rs = pstmt.executeQuery();

			if (rs.next()) {
				meta = rs.getMetaData();
				columnLength = meta.getColumnCount();
				if (columnLength > 0) {
					columnValues = new Object[columnLength];
				}
				rs.beforeFirst();
			}
			// ResultSet 沒有 列
			if (columnLength < 1 || columnValues == null)
				return list;

			while (rs.next()) {
				for (int i = 0; i < columnLength; i++) {
					columnValues[i] = rs.getString(i + 1);
				}
				Constructor constructor = BeanUtils.getConstructor(clazz,paramLength);
				Object temp = constructor.newInstance(columnValues);
				list.add(temp);
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			closeJDBCResources(rs,pstmt,null);
		}
		return list;
	}
	
	
	/**
	 * 简单查询，返回唯一结果
	 * @param conditionSql SQL语句
	 * @param values 
	 * @return
	 */
	public static Object[] queryBySql(final String conditionSql, final Object[] values) {
		Connection conn,tmpconn = null;
		ResultSet rs = null;
		PreparedStatement pstmt = null;
		Object[] objectResult = null;
		ResultSetMetaData meta = null;
        int columnLength = 0;
		try {

			if(DBConnectionPool.isTransacionStart()){
				conn = DBConnectionPool.getInstance().getTransConn();
				conn.setAutoCommit(false);
			}
			else{
				conn = DBConnectionPool.getInstance().getConnection();
				conn.setAutoCommit(true);
				tmpconn = conn;
			}
			pstmt = conn.prepareStatement(conditionSql);
			
			if (values != null) {
				for (int i = 0; i < values.length; i++) {
					pstmt.setObject(i + 1, values[i]);
				}
			}
			rs = pstmt.executeQuery();
			if (rs.next()) {
			    meta = rs.getMetaData();
                columnLength = meta.getColumnCount();
                objectResult = new Object[columnLength];
                for(int i =0; i <columnLength; i++)
                {
                    objectResult[i] = rs.getObject(i+1);
                }
			}

		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			closeJDBCResources(rs,pstmt,tmpconn);
		}
		return objectResult;
	}
	
	/**
	 * 简单查询，返回唯一结果
	 * @param conditionSql SQL语句
	 * @param values 
	 * @return
	 */
	public static Object queryBySql(Connection conn,final String conditionSql, final Object[] values) {
		ResultSet rs = null;
		PreparedStatement pstmt = null;
		Object result = null;
		try {

			pstmt = conn.prepareStatement(conditionSql);
			
			if (values != null) {
				for (int i = 0; i < values.length; i++) {
					pstmt.setObject(i + 1, values[i]);
				}
			}
			rs = pstmt.executeQuery();
			if (rs.next()) {
				result = rs.getObject(1);
			}

		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			closeJDBCResources(rs,pstmt,null);
		}
		return result;
	}
	
	/**
	 * 简单查询，返回数组
	 * @param conditionSql SQL语句
	 * @param values 
	 * @return
	 */
	public static List queryBySqlList(final String conditionSql, final Object[] values) {
		Connection conn,tmpconn = null;
		ResultSet rs = null;
		PreparedStatement pstmt = null;
		List result = new ArrayList();
		try {
			if(DBConnectionPool.isTransacionStart()){
				conn = DBConnectionPool.getInstance().getTransConn();
				conn.setAutoCommit(false);
			}
			else{
				conn = DBConnectionPool.getInstance().getConnection();
				conn.setAutoCommit(true);
				tmpconn = conn;
			}
			pstmt = conn.prepareStatement(conditionSql);
			if (values != null) {
				for (int i = 0; i < values.length; i++) {
					pstmt.setObject(i + 1, values[i]);
				}
			}
			rs = pstmt.executeQuery();
			while(rs.next()) {
				String o  = rs.getString(1);
				result.add(o);
			}

		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			closeJDBCResources(rs,pstmt,tmpconn);
		}
		return result;
	}
	
	/**
	 * 简单查询，返回数组
	 * @param conditionSql SQL语句
	 * @param values 
	 * @return
	 */
	public static List queryBySqlList(Connection conn,final String conditionSql, final Object[] values) {
		ResultSet rs = null;
		PreparedStatement pstmt = null;
		List result = new ArrayList();
		try {
			pstmt = conn.prepareStatement(conditionSql);
			if (values != null) {
				for (int i = 0; i < values.length; i++) {
					pstmt.setObject(i + 1, values[i]);
				}
			}
			rs = pstmt.executeQuery();
			while(rs.next()) {
				String o  = rs.getString(1);
				result.add(o);
			}

		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			closeJDBCResources(rs,pstmt,null);
		}
		return result;
	}
	
	/**
	 * 简单查询，返回数组
	 * @param conditionSql SQL语句
	 * @param values 
	 * @return
	 */
	public static Object[] queryBySqlReturnArray(final String conditionSql, final Object[] values) {
		Connection conn,tmpconn = null;
		ResultSet rs = null;
		PreparedStatement pstmt = null;
		List result = new ArrayList();
		try {
			if(DBConnectionPool.isTransacionStart()){
				conn = DBConnectionPool.getInstance().getTransConn();
				conn.setAutoCommit(false);
			}
			else{
				conn = DBConnectionPool.getInstance().getConnection();
				conn.setAutoCommit(true);
				tmpconn = conn;
			}
			pstmt = conn.prepareStatement(conditionSql);
			if (values != null) {
				for (int i = 0; i < values.length; i++) {
					pstmt.setObject(i + 1, values[i]);
				}
			}
			rs = pstmt.executeQuery();
			int i = 0;
			while(rs.next()) {
				String o  = rs.getString(1);
				result.add(o);
			}

		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			closeJDBCResources(rs,pstmt,tmpconn);
		}
		return result.toArray();
	}
	
	/**
	 * 简单查询，返回数组
	 * @param conditionSql SQL语句
	 * @param values 
	 * @return
	 */
	public static Object[] queryBySqlReturnArray(Connection conn,final String conditionSql, final Object[] values) {
		ResultSet rs = null;
		PreparedStatement pstmt = null;
		List result = new ArrayList();
		try {
			pstmt = conn.prepareStatement(conditionSql);
			if (values != null) {
				for (int i = 0; i < values.length; i++) {
					pstmt.setObject(i + 1, values[i]);
				}
			}
			rs = pstmt.executeQuery();
			int i = 0;
			while(rs.next()) {
				String o  = rs.getString(1);
				result.add(o);
			}

		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			closeJDBCResources(rs,pstmt,null);
		}
		return result.toArray();
	}
	
	/**
	 * 执行insert或update语句 返回 true 代表执行成功 返回 false 代表执行失败
	 * 
	 * @param sql
	 * @param values
	 * @return
	 */
	public static boolean execute(final String sql, final Object[] values) {
		boolean result = false;
		Connection conn,tmpconn = null;
		PreparedStatement pstmt = null;
		try {
			if(DBConnectionPool.isTransacionStart()){
				conn = DBConnectionPool.getInstance().getTransConn();
				conn.setAutoCommit(false);
			}
			else{
				conn = DBConnectionPool.getInstance().getConnection();
				conn.setAutoCommit(true);
				tmpconn = conn;
			}
			pstmt = conn.prepareStatement(sql);

			if (values != null) {
				for (int i = 0, n=values.length; i < n; i++) {
					pstmt.setObject(i + 1, values[i]);
				}
			}
			int tmp = pstmt.executeUpdate();
			if(tmp!=0)
				result = true;
		} catch(Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e.getMessage());
		} finally {
			closeJDBCResources(null,pstmt,tmpconn);
		}
		return result;
	}
	
	/**
	 * 执行insert或update语句 返回 true 代表执行成功 返回 false 代表执行失败
	 * 
	 * @param sql
	 * @param values
	 * @return
	 */
	public static boolean execute(Connection conn,final String sql, final Object[] values) {
		boolean result = false;
		PreparedStatement pstmt = null;
		try {
			pstmt = conn.prepareStatement(sql);

			if (values != null) {
				for (int i = 0, n=values.length; i < n; i++) {
					pstmt.setObject(i + 1, values[i]);
				}
			}
			int tmp = pstmt.executeUpdate();
			if(tmp!=0)
				result = true;
		} catch(Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e.getMessage());
		} finally {
			closeJDBCResources(null,pstmt,null);
		}
		return result;
	}
	
	/**
	 * 存储过程使用, 把结果集变成list
	 * @return
	 */
	public static List queryByResultSet(ResultSet rs, final Class clazz, final int paramLength) {

		List list = new ArrayList();
		ResultSetMetaData meta = null;
		int columnLength = 0;

		Object[] columnValues = null; // 列類型
		try {
			if (rs.next()) {
				meta = rs.getMetaData();
				columnLength = meta.getColumnCount();
				if (columnLength > 0) {
					columnValues = new Object[columnLength];
				}
				rs.beforeFirst();
			}
			// ResultSet 沒有 列
			if (columnLength < 1 || columnValues == null)
				return list;

			while (rs.next()) {
				for (int i = 0; i < columnLength; i++) {
					columnValues[i] = rs.getString(i + 1);
				}
				Constructor constructor = BeanUtils.getConstructor(clazz,paramLength);
				Object temp = constructor.newInstance(columnValues);
				list.add(temp);
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				meta = null;
				if (rs != null)
					rs.close();
			} catch (SQLException e) {
			}
		}
		return list;
	}
	
	
	/**
	 * 执行insert或update语句 返回 true 代表执行成功 返回 false 代表执行失败
	 * 
	 * @param sql
	 * @param values
	 * @return
	 */
	public static void executeFile(final String sql, final Object[] values) {
		Connection conn,tmpconn = null;
		PreparedStatement pstmt = null;
		try {
			if(DBConnectionPool.isTransacionStart()){
				conn = DBConnectionPool.getInstance().getTransConn();
				conn.setAutoCommit(false);
			}
			else{
				conn = DBConnectionPool.getInstance().getConnection();
				conn.setAutoCommit(true);
				tmpconn = conn;
			}
			pstmt = conn.prepareStatement(sql);
			if (values != null) {
				for (int i = 0, n=values.length; i < n; i++) {
					pstmt.setObject(i + 1, values[i]);
				}
			}
			pstmt.execute();
		} catch(Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e.getMessage());
		} finally {
			closeJDBCResources(null,pstmt,tmpconn);
		}
	}
	
	/**
	 * 执行insert或update语句 返回 true 代表执行成功 返回 false 代表执行失败
	 * 
	 * @param sql
	 * @param values
	 * @return
	 */
	public static void executeFile(Connection conn,final String sql, final Object[] values) {
		PreparedStatement pstmt = null;
		try {
			pstmt = conn.prepareStatement(sql);
			if (values != null) {
				for (int i = 0, n=values.length; i < n; i++) {
					pstmt.setObject(i + 1, values[i]);
				}
			}
			pstmt.execute();
		} catch(Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e.getMessage());
		} finally {
			closeJDBCResources(null,pstmt,null);
		}
	}
	
	public static void executePorcedure(String sql,Object[] values){
		CallableStatement call = null;
		Connection conn,tmpconn = null;
		try {
			// 调用存储过程更新 topic_match_fast
			if(DBConnectionPool.isTransacionStart()){
				conn = DBConnectionPool.getInstance().getTransConn();
				conn.setAutoCommit(false);
			}
			else{
				conn = DBConnectionPool.getInstance().getConnection();
				conn.setAutoCommit(true);
				tmpconn = conn;
			}
			call = conn.prepareCall(sql);
			if (values != null) {
				for (int i = 0; i < values.length; i++) {
					call.setObject(i+1, values[i]);
				}
			}
			call.execute();
		} catch(Exception e) {
			throw new RuntimeException(e.getMessage());
		} finally{
			if(call != null){
				try {
					call.close();
					
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
			closeJDBCResources(null,null,tmpconn);
		}
	}
	public static void executePorcedure(Connection conn,String sql,Object[] values){
		CallableStatement call = null;
		try {
			call = conn.prepareCall(sql);
			if (values != null) {
				for (int i = 0; i < values.length; i++) {
					call.setObject(i+1, values[i]);
				}
			}
			call.execute();
		} catch(Exception e) {
			throw new RuntimeException(e.getMessage());
		} finally{
			if(call != null){
				try {
					call.close();
					
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}
	}
	/**
	 * 执行insert语句，返回自增长主键
	 * 
	 * @param sql
	 * @param values
	 * @return
	 */
	public static int executeWithGeneratedKey(final String sql, final Object[] values) {
		int result = -1;
		Connection conn,tmpconn = null;
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		try {
			if(DBConnectionPool.isTransacionStart()){
				conn = DBConnectionPool.getInstance().getTransConn();
				conn.setAutoCommit(false);
			}
			else{
				conn = DBConnectionPool.getInstance().getConnection();
				conn.setAutoCommit(true);
				tmpconn = conn;
			}
			pstmt = conn.prepareStatement(sql,PreparedStatement.RETURN_GENERATED_KEYS);

			if (values != null) {
				for (int i = 0, n=values.length; i < n; i++) {
					pstmt.setObject(i + 1, values[i]);
				}
			}
			pstmt.executeUpdate();
			rs = pstmt.getGeneratedKeys();
			if(rs.next()){
				result = rs.getInt(1);
			}
		} catch(Exception e) {
			e.printStackTrace();
		} finally {
			closeJDBCResources(rs,pstmt,tmpconn);
		}
		return result;
	}
	
	/**
	 * 执行insert语句，返回自增长主键
	 * 
	 * @param sql
	 * @param values
	 * @return
	 */
	public static int executeWithGeneratedKey(Connection conn,final String sql, final Object[] values) {
		int result = -1;
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		try {
			pstmt = conn.prepareStatement(sql,PreparedStatement.RETURN_GENERATED_KEYS);

			if (values != null) {
				for (int i = 0, n=values.length; i < n; i++) {
					pstmt.setObject(i + 1, values[i]);
				}
			}
			pstmt.executeUpdate();
			rs = pstmt.getGeneratedKeys();
			if(rs.next()){
				result = rs.getInt(1);
			}
		} catch(Exception e) {
			e.printStackTrace();
		} finally {
			closeJDBCResources(rs,pstmt,null);
		}
		return result;
	}
	
	/**
	 * 关闭相关的JDBC资源
	 * 
	 * @param rs
	 * @param st
	 * @param conn
	 * @throws SQLException
	 */
	private static void closeJDBCResources(ResultSet rs, Statement st,Connection conn) {

		try{
			if (rs != null) {
				rs.close();
				rs = null;
			}
		}catch(Exception e){
			log.error("关闭JDBC资源时出现异常：", e);				
		}
		
		try{
			if (st != null) {
				st.close();
				st = null;
			}
		}catch(Exception e){
			log.error("关闭JDBC资源时出现异常：", e);				
		}
		
		try{
			if (conn != null) {
				conn.close();
				conn = null;
			}
		}catch(Exception e){
			log.error("关闭JDBC资源时出现异常：", e);				
		}
	}
}
