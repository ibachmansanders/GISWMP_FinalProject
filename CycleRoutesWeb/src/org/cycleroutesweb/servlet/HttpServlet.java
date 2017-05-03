package org.cycleroutesweb.servlet;

import java.io.Console;
import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.cycleroutesweb.db.util.DBUtility;
/**
 * Servlet implementation class HttpServlet
 */
@WebServlet("/HttpServlet")
public class HttpServlet extends javax.servlet.http.HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see javax.servlet.http.HttpServlet#javax.servlet.http.HttpServlet()
     */
    public HttpServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// leaving empty- this is a less secure method of contacting the server
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// Use json as the response format
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		
		//isolate the tab_id for the request
		String action_id =request.getParameter("tab_id");
		
		if (action_id.equals("1")){
			try{
				//query that should always run
				loadAttractions(request,response);
			} catch (JSONException e){
				e.printStackTrace();
			}catch (SQLException e){
				e.printStackTrace();
			}
		} else if (action_id.equals("2")) {	//second conditional, if the user AJAX request identifies geotweet
			try{
				//reference method to add geoTweets
				getGeotweets(request, response);

			}catch (JSONException e){
				e.printStackTrace();
			}catch (SQLException e){
				e.printStackTrace();
			}
		} else if (action_id.equals("3")){
			//identify coordinates passed from map for source/target
			Object sourceCoord = request.getParameter("sourceCoord");
			Object targetCoord = request.getParameter("targetCoord");
			try{
				//reference method to add route
				//TODO can we return 3 routes?
				getPGRoute(request,response,sourceCoord,targetCoord);
			}catch (JSONException e){
				e.printStackTrace();
			}catch (SQLException e){
				e.printStackTrace();
			}
		}
	}
	
private void loadAttractions (HttpServletRequest request, HttpServletResponse response)throws JSONException, SQLException, IOException {
	JSONArray list = new JSONArray();
		
    // load all attractions from the DB
	String sql = "SELECT name, desc_, ST_asText(geom) as geom, ST_AsGeoJSON(geom) as json from d_attractions_4326";
	DBUtility dbutil = new DBUtility();
	//send the sql to the DB, store in ResultSet res
	ResultSet res = dbutil.queryDB(sql);
	while(res.next()){
		//add to response
		HashMap<String, String> m = new HashMap<String, String>();
		m.put("json", res.getString("json"));
		m.put("name", res.getString("name"));
		m.put("text", res.getString("desc_"));
		list.put(m);
	}
	
	//write the queryReportHelper response (which is a JSONArray, called list) to a string (why?)
	//writes that list to the response, sent to the app that called it (laodmap.js)
	response.getWriter().write(list.toString());
}	

//load geoTweets from DB
private void getGeotweets(HttpServletRequest request, HttpServletResponse response)throws JSONException, SQLException, IOException {
	JSONArray list = new JSONArray();
		
	//call all geotweets from the DB using dbutil
	String sql = "SELECT name,  longitude, latitude, text FROM geotweets_4326 "
			+ "where st_dwithin((st_transform(geom,3857)),(st_transform("
			+"st_setsrid(st_makepoint(-92.101098,46.785201),4326),3857)),32187)"; //selects Tweets w/in 20 miles (32187m) of Duluth center
	DBUtility dbutil2 = new DBUtility();
	
	ResultSet res = dbutil2.queryDB(sql);
	
	while (res.next()){
		//get necessary tweet attributes
		HashMap<String, String> m = new HashMap<String, String>();
		m.put("name", res.getString("name"));
		m.put("longitude", res.getString("longitude"));
		m.put("latitude", res.getString("latitude"));
		m.put("text",res.getString("text"));
		list.put(m);
	}
	
	response.getWriter().write(list.toString());
}

//load pgRoutes from DB
private void getPGRoute(HttpServletRequest request, HttpServletResponse response, Object sourceCoord, Object targetCoord)throws JSONException, SQLException, IOException {
	String sql;
	String sql2;
	Integer lsize;
	Integer start;
	Integer previous;
	Object ststart;
	Object stprevious;
	
	//sql query to get nearest road id to coord
	String sqlSource = "(select source from d_roads "
			+ "where st_distance(geom,(st_transform((st_setsrid((st_makepoint("+sourceCoord+")),4326)),32615))) < 2000 "
			+ "order by st_distance(geom,(st_transform((st_setsrid((st_makepoint("+sourceCoord+")),4326)),32615))) "
			+ "limit 1)";

	//sql query to get nearest road id to coord
	String sqlTarget = "(select target from d_roads "
			+ "where st_distance(geom,(st_transform((st_setsrid((st_makepoint("+targetCoord+")),4326)),32615))) < 2000 "
			+ "order by st_distance(geom,(st_transform((st_setsrid((st_makepoint("+targetCoord+")),4326)),32615))) "
			+ "limit 1)";

	//call a route from the DB using dbutil
	JSONArray list = new JSONArray(); //for response
		
	sql = "SELECT ST_Asgeojson(ST_LineMerge(ST_Union(ST_Transform(geom, 4326)))) as json "
			+ "FROM pgr_dijkstra('SELECT gid as id, source, target, st_length(geom)/ride_dens2 as cost "
			+ "FROM d_roads', "+sqlSource+", "+sqlTarget+", false, false) "
			+ "as di JOIN d_roads pt ON di.id2 = pt.gid;";
	
	sql2 = "SELECT str_name1 as street "
			+ "FROM pgr_dijkstra('SELECT gid as id, source, target, st_length(geom)/ride_dens2 as cost "
			+ "FROM d_roads', "+sqlSource+", "+sqlTarget+", false, false) "
			+ "as di JOIN d_roads pt ON di.id2 = pt.gid;";
	
	DBUtility dbutil3 = new DBUtility();
	
	ResultSet res = dbutil3.queryDB(sql);
	
	while (res.next()){
		//get necessary route attributes
		HashMap<String, String> m = new HashMap<String, String>();
		m.put("json", res.getString("json"));
		list.put(m);
		
	}
		
	DBUtility dbutil4 = new DBUtility();
		
	ResultSet res2 = dbutil4.queryDB(sql2);
		
	while (res2.next()){
		//get necessary route attributes
		HashMap<String, String> n = new HashMap<String, String>();
		n.put("street", res2.getString("street"));
		list.put(n);
	}
	
	lsize = list.length();
	start = 2;
	
	while (start <= lsize-1){
		previous = (start-1);
		ststart = list.get(start).toString();
		stprevious = list.get(previous).toString();
		if (ststart.equals(stprevious)){
			list.remove(start);
			lsize = lsize-1;
		} else {
			start = start+1;
		}
	}
	
	response.getWriter().write(list.toString());
}
		
}