var http = require('http');
var MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
var express = require('express');
var app = express(), engines = require('consolidate');
//Database Name
const dbName = 'video';
let client = new MongoClient(url);

app.engine('html',engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname+'/views');


app.get('/',
    (req, res)=> {
      client.close();
      client = new MongoClient(url);
      client.connect( (
          err) => {
            if (!err) {
              var db = client.db(dbName);
              const collection = db.collection('movies');
              collection.find({}).toArray(function (err, docs) {
                res.render('movies',{movies : docs});
                
              });
            }
      else {
        res.writeHead(500, {
          "Content-Type" : "text/plain"
        });
        res.write('Something went wrong');
        res.end();
      }
    })
    });
app.use((req, res)=>{
  res.sendStatus(404);
});

http.createServer(app
).listen(8000);

/* 
 * client.connect( (
    err) => {
      if (!err) {
        app.get('/',
            (req, res)=> {
              var db = client.db(dbName);
              const collection = db.collection('movies');
              collection.find({}).toArray(function (err, docs) {
                res.render('movies',{movies : docs});
                //client.close();
              })
              // res.write("Connected successfully to server");
            })
      } else {
        res.writeHead(500, {
          "Content-Type" : "text/plain"
        });
        res.write('Something went wrong');
        res.end();
        //client.close();
      }
      app.use((req, res)=>{
        res.sendStatus(404);
      });

      http.createServer(app
      ).listen(8000);
    });

 */
 
