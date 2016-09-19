var express = require( 'express' );
var app = express();
var path = require( 'path' );
var bodyParser = require( 'body-parser' );
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/treats';
var urlencodedParser = bodyParser.urlencoded( {extended: false } );
var port = process.env.PORT || 5550;

app.listen(port, function(){
  console.log('server listening on port', port);
});

app.get( '/', function( req, res ){
  console.log( 'base url hit' );
  res.sendFile( path.resolve( 'public/views/index.html' ) );
});
app.get('/treats', function(req, res){
  console.log('in get treats');
  pg.connect(connectionString, function(err, client, done){
    if( err ){
      console.log( err );
    } // end error
    else{
      console.log( 'connected to db' );
      var resultsArray = [];
      var queryResults = client.query( 'SELECT * FROM treatme' );
      queryResults.on( 'row', function( row ){
        // push each row into results array
        resultsArray.push( row );
      }); //end on row
      queryResults.on( 'end', function(){
        // let the db know we are done
        done();
        res.send(resultsArray);
  });
}
});
});
app.post('/treats', urlencodedParser, function(req, res){
  console.log('complete hit', req.body);
  var data = {
    name: req.body.name,
    description: req.body.description,
    url: req.body.url
  };
  console.log(data.name);
  pg.connect(connectionString, function(err, client, done){
    if( err ){
      console.log( err );
    } // end error
    else{
      console.log( 'connected to db' );
    client.query('INSERT INTO treatme (name, description, pic) VALUES($1, $2, $3) RETURNING *;', [data.name, data.description, data.url]);

    }
  });
  res.send( true );

});
  app.use(express.static('public'));
