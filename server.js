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

    // bcrypt.compare("jake", hash, function(err, res) { how to compare passwords
    //     console.log(res)
    // });

app.use(express.static("resources"));

app.set("view engine","pug");//sets view engine  
app.set("views", "./views");  //tells view engine where to look for templates 

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); 

app.get("/",(req,res)=>{
    res.render("login.pug"); 
}); 

app.get("/sign-up",(req,res)=>{
    res.render("signup.pug"); 
}); 

app.post("/sign-up-attempt", (req,res)=>{
    let attempt = req.body,
        resMsg = "success"; 
    attempt.password = attempt.password.trim(); 
    bcrypt.hash(attempt.password, saltRounds, (err, hash)=> {
       if(!err){
            attempt.password = hash; 
            dbconn.query(querybuilder.findUser(attempt.email), (err,result)=>{
                if(err){
                    resMsg = "error";  
                    console.log(err); 
                }else{
                    if(result.length === 0){
                        console.log("creating user"); 
                        dbconn.query(querybuilder.createUser(attempt), (err,result)=>{
                            if(err){
                                resMsg = "error"; 
                                console.log(err); 
                            }
                        }); 
                    }else{
                        console.log("user exists");
                        resMsg = "registered"; 
                    }
                }
            });   
       }else{
            resMsg = "error"; 
            console.log(err); 
       }
   });
   res.send(resMsg); 
});

app.post("/login-attempt",(req,res)=>{
    let attempt = req.body;  
    
}); 

socketIo.on("connection",(socket)=>{
    socket.on("message",(msg)=>{
        socketIo.emit("message",msg); 
    });
});


http.listen(3000,()=>{
    console.log("Listening on port 3000");
}); 