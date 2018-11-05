var http = require('http'),
MongoClient = require('mongodb').MongoClient,
url = 'mongodb://localhost:27017',
express = require('express'),
app = express(), engines = require('consolidate');
//Database Name
const dbName = 'crunchbase';
let client = new MongoClient(url);

app.engine('html',engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname+'/views');


app.get('/',
    (req, res)=> {

      let query = prepareQuery(req.query);
      client.close();
      client = new MongoClient(url);
      client.connect( (
          err) => {
            if (!err) {
              var db = client.db(dbName);
              const collection = db.collection('companies');

              find(collection, query, res);
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

function prepareQuery(options){
  var query = {};
  if (options){
    if ('firstYear' in options && 'lastYear' in options){
      query = {'founded_year': {
          '$gte': parseInt(options.firstYear), '$lte':parseInt(options.lastYear)
      }
     };
    }
    if ('employees' in options){
      query.number_of_employees = { '$gte':parseInt(options.employees) };
    }
    console.log(options.overview);
    if ('overview' in options) {
      query.overview = { "$regex":options.overview.toString(), "$options":"i" };
    }
    if ('country' in options) {
      query['offices.country_code'] = options.country;
    }
  }
  console.log(query);
  return query;
}

async function find(collection, query, res){
  let cursor = collection.find(query/*
   * , { 'name' : 1, category_code:1, '_id' :
   * 0 }
   */).project({ 'name' : 1, category_code:1, '_id' : 0, founded_year:1 }).
   sort([['founded_year',1],['number_of_employees',-1]]).skip(1).
   limit(1000000000);
  // 1. Sort 2. Skip 3. Limit
  var data = [], count = 0;
  while( await cursor.hasNext()) {
    const doc = await cursor.next();
    data.push(doc);
    count = count + 1;
  }
  console.log(count);
  res.render('movies',{movies : data});
}
app.use((req, res)=>{
  res.sendStatus(404);
});

http.createServer(app
).listen(8000);
