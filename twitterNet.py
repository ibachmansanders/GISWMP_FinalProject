##Based on code from Tweepy https://github.com/tweepy/tweepy and Scott Farly https://github.com/scottsfarley93


print "importing extensions..."
import os
import tweepy
from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream
import json # for storing and writing out data
import csv #for writing the data
import time #to track when tweets were posted
print "extensions imported!"

print "setting outfile..."
#TEST outfile
outfileName = os.path.normpath("C:/programming/database/tweets2.csv/")
print "outfile set!"

#Consumer key/secret TODO: How to keep secret?
consumerKey = "####"
consumerSecret = "####"
#API keys --> Make hidden?
accessToken = "####"
accessTokenSecret = "####"


print "setting up csv and logging session start time"
#set up the csv for writing (and create it, if need be)
f = open(outfileName, 'a') #for appending, and will create it if it doesn't exist.
f.write("TERM: 'cycling','bicycling','cyclecommute','bicyclecommute','biking','mtb','bike trail', 'bike path'\n")
f.write("STARTED: ")
f.write(str(time.time())) #tracks the time the stream started before logging data
f.write("\n")
fieldnames = ['creation','id','name','screen_name','lang', 'coord', 'text']
csvWriter = csv.writer(f)
csvWriter.writerow(fieldnames)
print "csv formatted!"



#authorize the API access
auth = tweepy.OAuthHandler(consumerKey, consumerSecret)
auth.set_access_token(accessToken, accessTokenSecret)
api = tweepy.API(auth)
print "Authorized."
print "Running..."


print "Establishing methods"
#STEP 1 set up the Tweepy StreamListener to check messages coming from Twitter
#inclued methods to capture the information you want
class TwitterNetListener(tweepy.StreamListener):

	#method detecting new statuses- very basic
	def on_status(self, status):
		print(status.text)

	#search for data- code to parse out geotags by Scott Farly
	def on_data(self, data):
		#only write data to csv if coordinates are succesfully created (try method)
		try:
			d = json.loads(data)
			creation = d['created_at']
			id = d['id']
			text = d['text'].encode("UTF-8")
			name = d['user']['name'].encode("UTF-8")
			screen_name = d['user']['screen_name'].encode("UTF-8")
			lang = d['user']['lang']
			coord = d['coordinates']
			row = creation, id, name, screen_name, lang, coord, text
                        #add an if statement to check if coordinates are null before writing, otherwise you get a tweet without coords
			if coord != "":
				csvWriter.writerow(row)
		except Exception as e:
			print str(e)
		return True

	#in the event of error connecting to API, report
	def on_error(self, status_code):
		print(status_code)
		return True

	#catches timeout errors
	def on_timeout(self):
		print "Timeout..."
		return True

print "methods established!"


print "starting stream..."
#STEP 2 create a stream object
netListener = TwitterNetListener()
twitterNetStream = tweepy.Stream(api.auth,netListener)
twitterNetStream.new_session()
print "stream object created..."
#STEP 3 start the twitter stream!
twitterNetStream.filter(track=['cycling','bicycling','cyclecommute','bicyclecommute','biking','mtb','bike trail', 'bike path'], async = True)
print "stream started!"

