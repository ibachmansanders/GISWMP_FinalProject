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
		
		System.out.println("Servlet Check 1");
		//isolate the tab_id for the request
		String action_id =request.getParameter("tab_id");
		System.out.println(action_id);
		System.out.println("Servlet Check 2");
		
		if (action_id.equals("1")){
			System.out.println("adding attractions / or layer to map!");
			try{
				//query that should always run
				loadAttractions(request,response);
				System.out.println("ServletLoadLayerComplete");
			} catch (JSONException e){
				e.printStackTrace();
			}catch (SQLException e){
				e.printStackTrace();
			}
		} else if (action_id.equals("2")) {	//second conditional, if the user AJAX request identifies geotweet
			System.out.println("adding tweets to map!");
			try{
				//reference method to add geoTweets
				//TEST- later, this should be conditional
				getGeotweets(request, response);

			}catch (JSONException e){
				e.printStackTrace();
			}catch (SQLException e){
				e.printStackTrace();
			}
		} 
	}
	
private void loadAttractions (HttpServletRequest request, HttpServletResponse response)throws JSONException, SQLException, IOException {
	JSONArray list = new JSONArray();
		
	    //TEST load all attractions from the DB
		String sql = "select ST_asText(geom) as geom, ST_AsGeoJSON(ST_Transform(geom, 4326)) as json from d_attractions";
		loadLayerHelper(sql,list);
	
	//write the queryReportHelper response (which is a JSONArray, called list) to a string (why?)
	//writes that list to the response, sent to the app that called it (laodmap.js)
	response.getWriter().write(list.toString());
	System.out.println("queryReport response: "+list);
}	


private void loadLayerHelper(String sql, JSONArray list) throws SQLException{
	DBUtility dbutil = new DBUtility();
	System.out.println("Servlet sql to DB: "+sql);
	//send the sql to the DB, store in ResultSet res
	ResultSet res = dbutil.queryDB(sql);
	while(res.next()){
		//add to response
		HashMap<String, String> m = new HashMap<String, String>();
		m.put("json", res.getString("json"));
		list.put(m);
	}
}

//load geoTweets from DB
private void getGeotweets(HttpServletRequest request, HttpServletResponse response)throws JSONException, SQLException, IOException {
	JSONArray list = new JSONArray();
		
	//call all geotweets from the DB using dbutil
	String sql = "SELECT name,  longitude, latitude, text FROM geotweets";
	DBUtility dbutil = new DBUtility();
	
	ResultSet res = dbutil.queryDB(sql);
	
	while (res.next()){
		//get necessary tweet attributes
		HashMap<String, String> m = new HashMap<String, String>();
		m.put("name", res.getString("name"));
		m.put("longitude", res.getString("longitude"));
		m.put("latitude", res.getString("latitude"));
		m.put("text",res.getString("text"));
		//TEST
		System.out.println("GeoTweet: " + m);
		list.put(m);
	}
	
	response.getWriter().write(list.toString());
}	
		
}