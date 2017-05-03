package org.cycleroutesweb.db.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class DBUtility {

	private static final String Driver= "org.postgresql.Driver";
	private static final String ConnUrl= "jdbc:postgresql://144.92.235.47/cycleroutesdb";
	private static final String Username = "########";
	private static final String Password = "########";

	
	//This is a constructor
	public DBUtility(){
		
	}
	
	//Create a connection to the DB
	private Connection connectDB(){
		Connection conn = null;
		try{
			Class.forName(Driver);
			conn =DriverManager.getConnection(ConnUrl,Username, Password);
			return conn;
		} catch (Exception e){
			e.printStackTrace();
		}
		return conn;
		
	}
	
	//Execute a sql query and return a result set
	public ResultSet queryDB(String sql){
		Connection conn =connectDB();
		ResultSet res = null;
		try{
			if(conn != null){
				Statement stmt =conn.createStatement();
				res = stmt.executeQuery(sql);
				conn.close();
			}
		}catch (Exception e){
			e.printStackTrace();
		}
		return res;
	}
	
	//execute a sql query to modify the DB
	public void modifyDB(String sql){
		Connection conn = connectDB();
		try{
			if (conn != null){
				Statement stmt =conn.createStatement();
				stmt.execute(sql);
				stmt.close();
				conn.close();
			}
		}catch (Exception e){
			e.printStackTrace();
		}
	}
	/**
	 * @param args
	 * @throws SQLException 
	 */
	public static void main(String[] args) throws SQLException {
		// You can test the methods you created here
		DBUtility util = new DBUtility();
		
		// 1. create a user
		//util.modifyDB("insert into person (first_name, last_name) values ('test_user_1_fN', 'test_user_1_lN')");
		
		// 2. query the database
		/*ResultSet res = util.queryDB("select * from person where first_name = 'test_user_1_fN'");
		while (res.next()) {
			System.out.println(res.getString("last_name"));
		}
		*/
		
		//2. query the DB TEST
		ResultSet res =util.queryDB("SELECT str_name1 FROM d_roads");
		while (res.next()){
			System.out.println(res.getString("str_name1"));
		}
		
		
	}

}