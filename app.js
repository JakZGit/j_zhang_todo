var express = require('express');
var promise = require('bluebird');
var path = require('path');


var app = express();

var options =  {
	promiseLib: promise
};

var pgp = require('pg-promise')(options);

var db = pgp('postgres://localhost:5432/todolist');


// body parser
var bodyParser = require('body-parser');

// json method kaifu
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine','hbs');
app.set('views', path.join(__dirname,'views'));


app.get('/',function(req,res,next){
	db.any('SELECT * FROM list')
	.then(function(data){
		res.render('index',{ data: data });
	})
	.catch(function(err){
		return next(err);
	});
});

app.post('/',function(req,res,next){
	db.none('INSERT INTO list(todo,description)'+
		'values(${list},${description})',
		req.body)
	.then(function(){
		res.redirect('/');
	})
	.catch(function (err){
		return next(err);
	});
});


//find description by id
app.get('/:id', function(req,res,next){
	var listid = req.params.id;
	db.one('SELECT * FROM list WHERE id = $1', listid)
   .then(function (data) {
     res.render('show', {description:data.description} );
	 })
	 .catch(function(err){
	 	return next(err);
	 });
});


app.listen(3000);