"use strict"; 
const express = require("express"), 
    app = express(), 
    http = require("http").Server(app),
    socketIo = require("socket.io")(http); 
app.use(express.static("resources"));

app.set("view engine","pug");//sets view engine  
app.set("views", "./views");  //tells view engine where to look for templates 

app.get("/",(req,res)=>{
    res.render("master-template.pug"); 
}); 

socketIo.on("connection",(socket)=>{
    socket.on("message",(msg)=>{
        socketIo.emit("message",msg); 
    });
});


http.listen(3000,()=>{
    console.log("Listening on port 3000");
}); 