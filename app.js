var express = require('express');
var promise = require('bluebird');
var path = require('path');


var app = express();

var checked = false;

var options =  {
	promiseLib: promise
};

var pgp = require('pg-promise')(options);
app.use(express.static('public'));
var db = pgp('postgres://localhost:5432/todolist');


// body parser
var bodyParser = require('body-parser');

// json method kaifu
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine','hbs');
app.set('views', path.join(__dirname,'views'));


app.get('/',function(req,res,next){
	res.render('login');
});


app.post('/',function(req,res,next){
	var newUser = req.body.username;
	var newPass = req.body.password;
	var query = "SELECT COUNT (*) FROM users WHERE username = '"+newUser+"' AND password = '"+newPass+"';";

	// var user_id = req.params.user_id;
	// console.log(user_id);
	// expects no rows

	db.any(query)
	.then(function(data){
		data=data[0].count;
		if(data>0){
			checked = true;
			res.redirect('/index/'+newUser);
		}
		else{
			res.render('login',{failMess:"Invalid Username/Password"});
		}
	})
	.catch(function (err){

		// return next(err);
	});
});

app.post('/register',function(req,res,next){
	var newUser = req.body.username;
	var newPass = req.body.password;
	db.none('insert into users (username, password)'+
		' values (${username}, ${password})',
		req.body)
	.then(function(){
		res.redirect('/index/'+newUser);
	})
	.catch(function(err){
		// return next(err);
	});
})


app.get('/index/:usernameref',function(req,res,next){
	if(checked == true){
	var userId = req.params.usernameref;

	db.any('SELECT * FROM list WHERE usernameref =$1',userId)
	.then(function(data){
		res.render('index',{ data: data, userId: userId });
	})
	.catch(function(err){
		return next(err);
	});
	}
});


app.post('/index/:usernameref',function(req,res,next){
	var user = req.params.usernameref;
	db.none('insert into list (usernameref, todo ,description)'+
		' values (${user}, ${list}, ${description})',
		{user:user, list:req.body.list, description:req.body.description})
	.then(function(){
		res.redirect('/index/'+user);
	})
	.catch(function(err){
		return next(err);
	});
});


app.get('/index/:userId/:usernameref/delete', function(req,res,next){
	var userId = req.params.userId;
		var username = req.params.usernameref;
	db.none('DELETE FROM list WHERE todo = $1', userId)
   .then(function() {
   		res.redirect('/index/'+username);	
	 })
	 .catch(function(err){
	 	return next(err);
	 });
});


// find description by id
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




