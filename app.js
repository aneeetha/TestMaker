const express = require("express");
const ejs = require('ejs');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const routes = require("./routes");
const cors = require("cors");
const User = require("./models/User");


const app = express();
require("dotenv").config();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());
app.use(express.json());
app.use(routes);


mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true , useUnifiedTopology: true } );

app.get("/", function(req, res, next) {
    res.render("home"); 
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){ 
    // return res.json(req.body)
    var checked;
    if(req.body.teacher){
        checked = "teacher";
    }else{
        checked = "student";
    }  
    const newUser = new User({
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
        usertype: checked        
    });
    newUser.save(function(err){
        if(err)
        {
            console.log(err);
        }else{
            res.redirect("/questions");
        }
    });
});

app.post("/login", function(req, res){
    User.findOne({ email: req.body.username }, function(err, foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                if(foundUser.password === req.body.password){
                    res.redirect("/questions");
                }else{
                    res.redirect("/register");
                }
            }
        }
    });
});

app.listen(process.env.PORT, function(){
    console.log("Listening on port 5000");
});

