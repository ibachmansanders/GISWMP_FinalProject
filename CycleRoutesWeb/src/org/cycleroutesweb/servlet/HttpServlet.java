package org.cycleroutesweb.servlet;

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
		// TODO Auto-generated method stub
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		
		String fname =request.getParameter("fname");
		
		if (fname != null){
			System.out.println("A report is submitted!");
			try{
			queryReport(request, response);
			}catch (JSONException e){
			e.printStackTrace();
			}catch (SQLException e){
			e.printStackTrace();
			}
		}
	}
	
private void queryReport (HttpServletRequest request, HttpServletResponse response)throws JSONException, SQLException, IOException {
	JSONArray list = new JSONArray();
	
	String fname = request.getParameter("fname");
	String str_name1 = request.getParameter("str_name1");
	String str_name2 = request.getParameter("str_name2");
	String geom = request.getParameter("geom");
	String shape_stle = request.getParameter("shape_stle");

	
	// resource_or_damage will be null if report_type is null
	//String resource_or_damage = request.getParameter("resource_or_damage");
	
	//request report
	if (fname != null){
		String sql = "select fname,  str_name1, str_name2, shape_stle, ST_asText(geom) as geom, ST_StartPoint(geom) as start_point, ST_EndPoint(geom) as end_point from d_roads";
		queryReportHelper(sql,list);
	}
	
	response.getWriter().write(list.toString());
}	


private void queryReportHelper(String sql, JSONArray list) throws SQLException{
	DBUtility dbutil = new DBUtility();
	
	ResultSet res = dbutil.queryDB(sql);
	while(res.next()){
		//add to response
		HashMap<String, String> m = new HashMap<String, String>();
		m.put("fname", res.getString("fname"));
		m.put("str_name1", res.getString("str_name1"));
		m.put("str_name2", res.getString("str_name2"));
		m.put("shape_stle", res.getString("shape_stle"));
		m.put("start_point", res.getString("start_point"));
		m.put("end_point", res.getString("end_point"));
		list.put(m);
	}
}
		
public void main() throws JSONException {
}
}