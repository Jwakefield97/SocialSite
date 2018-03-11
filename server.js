"use strict"; 
const express = require("express"), 
    app = express(), 
    bodyParser = require("body-parser"), 
    http = require("http").Server(app),
    socketIo = require("socket.io")(http),
    mysql = require("mysql"),
    dbconn = mysql.createConnection({ //used to connect to db 
      host: "localhost",
      user: "hackathon",
      password: "hackathon",
      database: "hackathon"
    }),
    bcrypt = require("bcrypt"), // used for encryption 
    saltRounds = 10,//num of salting rounds
    querybuilder = require("./modules/querybuilder.js");   

app.use(express.static("resources"));

app.set("view engine","pug");//sets view engine  
app.set("views", "./views");  //tells view engine where to look for templates 

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); 

app.get("/",(req,res)=>{
    res.render("login.pug"); 
}); 

app.get("/index", (req,res)=>{
    res.render("index.pug"); 
});     

app.get("/sign-up",(req,res)=>{
    res.render("signup.pug"); 
}); 

app.post("/sign-up-attempt", (req,res)=>{
    let attempt = req.body; 
    attempt.password = attempt.password.trim(); 
    bcrypt.hash(attempt.password, saltRounds, (err, hash)=> {
       if(!err){
            attempt.password = hash; 
            dbconn.query(querybuilder.findUser(attempt.email), (err,result)=>{
                if(err){
                    res.send("error");  
                    console.log(err); 
                }else{
                    if(result.length === 0){
                        dbconn.query(querybuilder.createUser(attempt), (err,result)=>{
                            if(err){
                                res.send("error");
                                console.log(err); 
                            }
                        }); 
                        res.send("success");
                    }else{
                        res.send("registered"); 
                    }
                }
            });   
       }else{
            res.send("error");
            console.log(err); 
       }
   });
});

app.post("/login-attempt",(req,res)=>{
    let attempt = req.body;  
    dbconn.query(querybuilder.findUser(attempt.email), (err,result)=>{
        if(result.length === 1){
            bcrypt.compare(attempt.password.toString().trim(), result[0].Password, function(err, check) { 
                if(err){
                    res.send("error"); 
                }else{
                    if(check === true){
                        res.send("success"); 
                    }else{
                        res.send("wrong"); 
                    }
                }
            });
        }else{
            res.send("error"); 
        } 
    }); 
}); 

socketIo.on("connection",(socket)=>{
    socket.on("message",(msg)=>{
        socketIo.emit("message",msg); 
    });
});


http.listen(3000,()=>{
    console.log("Listening on port 3000");
}); 