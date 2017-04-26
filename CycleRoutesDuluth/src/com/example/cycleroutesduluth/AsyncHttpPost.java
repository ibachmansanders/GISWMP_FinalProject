package com.example.cycleroutesduluth;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;

	import android.os.AsyncTask;

	import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

	import com.google.android.gms.maps.CameraUpdate;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.LatLngBounds;
import com.google.android.gms.maps.model.MarkerOptions;


public class AsyncHttpPost extends AsyncTask<String, Void, JSONArray>{
	
	//Post Data
	private HashMap<String, String> mData; 
	private GoogleMap mMap;
	
	public AsyncHttpPost(HashMap<String, String> data, GoogleMap map){
		mData =data;
		mMap = map;
	}
	
	@Override
	protected JSONArray doInBackground(String... params) {
		// TODO Auto-generated method stub
		
		JSONArray arr =null;
		HttpClient client = new DefaultHttpClient();
		
		try{
			HttpPost post = new HttpPost(params[0]);
			
			//Set up post data
			ArrayList<NameValuePair> nameValuePair = new ArrayList<NameValuePair>();
			Iterator<String> it = mData.keySet().iterator();
			
			while(it.hasNext()){
				String key = it.next();
				nameValuePair.add(new BasicNameValuePair (key, mData.get(key)));
			}
			
			post.setEntity(new UrlEncodedFormEntity(nameValuePair, "UTF-8"));
			
			HttpResponse response = client.execute(post);
			
			byte[] result =EntityUtils.toByteArray(response.getEntity());
			String str = new String(result, "UTF-8");
	        arr = new JSONArray(str);
	        System.out.println(arr);
		}
		 catch (UnsupportedEncodingException e) {
		        android.util.Log.v("INFO", e.toString());
		}
		 catch (Exception e) {
		        android.util.Log.v("INFO", e.toString());
		}
		 return arr;
	}
	protected void onPostExecute(JSONArray Result){
		LatLngBounds.Builder builder = new LatLngBounds.Builder();
		
		for (int i =0 ; i < Result.length(); i++){
			try{
				JSONObject report =Result.getJSONObject(i);
				Double lng = Double.parseDouble(report.getString("longitude"));
				Double lat = Double.parseDouble(report.getString("latitude"));
				LatLng latlng = new LatLng(lat,lng);
				builder.include(latlng);
				
				mMap.addMarker(new MarkerOptions().position(latlng)
						.title("Title")
						.icon(BitmapDescriptorFactory.fromResource(R.drawable.map_marker))
						.snippet("Snippet Message")
						);
			}catch (JSONException e) {
		        android.util.Log.v("INFO", e.toString());
		}
	}
		if (Result.length() > 0){
			LatLngBounds bounds = builder.build();
			
			int padding = 0;
			CameraUpdate cu =CameraUpdateFactory.newLatLngBounds(bounds, padding);
			
			mMap.moveCamera(cu);
		}
		
	}
}
