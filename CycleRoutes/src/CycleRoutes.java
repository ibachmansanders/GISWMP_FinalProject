//Import Libraries needed for connection
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class CycleRoutes {
	
	public static void main(String[] args){
		//Create variables
		Connection conn;
		Statement stmt;
		
		try{
			Class.forName("org.postgresql.Driver");
			// DB URL May vary depending on individual set up
			String url = "jdbc:postgresql://144.92.235.47/cycleroutesdb";
			/* Connect to DB. The String literals are for username and 
			 * pw of the local db, not the SSH password. May change depending on your setup
			 */
			conn = DriverManager.getConnection(url, "postgres", "");
			
			//Sample Query to test if the database connection was successful.
			String sql = "select fname,  str_name1, str_name2, shape_stle, ST_asText(geom) as geom, ST_StartPoint(geom) as start_point, ST_EndPoint(geom) as end_point from d_roads";
			stmt = conn.createStatement();
			ResultSet res =stmt.executeQuery(sql);
			
			if (res != null){
				while (res.next()){
				System.out.println(res.getString("fname"));
				System.out.println(res.getString("str_name1"));
				System.out.println(res.getString("str_name2"));
				System.out.println(res.getString("geom"));
				System.out.println(res.getString("shape_stle"));
				System.out.println(res.getString("start_point"));
				System.out.println(res.getString("end_point"));
				
				
				
				
				
				
				
				}
			}
			//Close connection and statment
			stmt.close();
			conn.close();
		}
		catch(Exception e){
			e.printStackTrace();
		}
	}

}
