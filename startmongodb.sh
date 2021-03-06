## Start MongoDB Server
cd C:\Users\sgray\Programs\MongoDB\bin
mongod --dbpath c:\Users\sgray\workspace\ClonedWebsite\data


## Connect to MongoDB Server
cd C:\Users\sgray\Programs\MongoDB\bin
mongo ClonedWebsite
> use ClonedWebsite

## Start MongoDB Web Frontend port 8081
C:\Users\sgray\workspace\node_modules\mongo-express
node app.js

## Query database collection 'usercollection' - collections are made automatically
db.userlist.find().pretty()

## Insert statement
db.userlist.insert({'username' : 'test1','email' : 'test1@test.com','fullname' : 'Bob Smith','age' : 27,'location' : 'San Francisco','gender' : 'Male'})

db.userlist.insert({'username': 'skipperjim','email': 'sgrayjr289@gmail.com', 'password': 'baseball'})

GET http://localhost:3700/stylesheets/game.css 
game:1 GET http://localhost:3700/javascripts/game.min.js 404 (Not Found)