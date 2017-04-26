package com.example.cycleroutesduluth;

import android.app.Activity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;

import java.util.HashMap;

import com.example.cycleroutesduluth.AsyncHttpPost;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapFragment;


public class MainActivity extends Activity {
	
	private GoogleMap map;
	
	//public static String servletURL ="http://10.0.3.2:8000/CycleRoutesWeb/HttpServlet"; //Emulator
	public static String servletURL ="http://192.168.1.112:8000/CycleRoutesWeb/HttpServlet"; //Phone //May vary depending on your ip address. 
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		map =((MapFragment)getFragmentManager().findFragmentById(R.id.map)).getMap();
		
		HashMap<String, String> data = new HashMap<String, String>();
		
		//Populate this field
		data.put("tab_id", "2");//Tweets
		///
		
		AsyncHttpPost asyncHttpPost = new AsyncHttpPost(data, map);
		asyncHttpPost.execute(servletURL);
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.main, menu);
		return true;
	}

	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		// Handle action bar item clicks here. The action bar will
		// automatically handle clicks on the Home/Up button, so long
		// as you specify a parent activity in AndroidManifest.xml.
		int id = item.getItemId();
		if (id == R.id.action_settings) {
			return true;
		}
		return super.onOptionsItemSelected(item);
	}

}
