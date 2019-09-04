let express = require('express');
let mongodb = require('mongodb');

let app = express();
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
const port = 5900;

let db;
let connectionString = "mongodb://localhost:27017/admin";
mongodb.connect(connectionString,{useNewUrlParser:true,useUnifiedTopology:true},function(err,client) {
    db = client.db();
    app.listen(port);
})

app.get("/getToDoList", (req, res) => {
    db.collection('TODO_LIST').find({}).toArray(function(err,result) {
        if(err) {
            console.log(err);
        }
        res.send(result);
    })
});

app.post('/addToList',function(req,res) {
    let value = req.body.value;
    db.collection('TODO_LIST').insertOne({text:value},function(err,result) {
        if(err) {
            throw err;
        }
        res.send(result); 
    })
})

app.post("/removeItem", (req, res) => {
    let value = req.body.value;
    let query = {text:value};
    db.collection('TODO_LIST').deleteOne(query,function(err,result) {
        if(err) {
            throw err;
        }
        res.send('OK');
    })
});

app.post("/update-item", (req, res) => {
    let mongodbId = new mongodb.ObjectID(req.body._id);
    db.collection('TODO_LIST').findOneAndUpdate({_id:mongodbId},{$set:{text:req.body.value}},function(err,response) {
        if(err) {
            throw err;
        }
        res.send('OK');
    })
});