var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// Connect to the database (remeber to change this to your database)
mongoose.connect('mongodb://test:test@ds161099.mlab.com:61099/todo');

// Create a schema
var todoSchema = new mongoose.Schema({
    item: String
});

var Todo = mongoose.model('Todo', todoSchema);

//var data = [{item: 'buy milk'}, {item: 'netflix and chill'}, {item: 'kick some coding ass'} ];
var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = function(app){

    app.get('/todo', function(req, res){
        // Get data from mongodb and pass it to the view
        Todo.find({}, function(err, data){
            if (err) throw err;
            res.render('todo', {todos: data});
        });
    });

    app.post('/todo', urlencodedParser, function(req, res){
        // Get data from the view and add it to mongodb
        var newTodo = Todo(req.body).save(function(err, data){
            if (err) throw err;
            res.json(data);
        });
    });

    app.delete('/todo/:item', function(req, res){
        // Delete the requested data from mongodb
        Todo.find({item: req.params.item.replace(/\-/g, " ")}).remove(function(err, data){
            if (err) throw err;
            res.json(data);
        });
    });
}
