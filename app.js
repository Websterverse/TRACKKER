const express = require("express");

const app = express();

// socket.io require http server for run //// 
const http = require("http");
const socket = require("socket.io")
const path = require("path")
const server = http.createServer(app);

const io = socket(server);

// set up for ejs //
app.set("view engine" , "ejs");
// app.set(express.static(path.join(__dirname, "public")));
app.use('/public', express.static(path.join(__dirname, 'public')));
// a.) handling socket io request that come ffrom fronted 
io.on("connection" , function (socket){
socket.on("send-location" , function (data){
    io.emit("receive-location" , {id : socket.id , ...data})
}) ;

socket.on("disconnect" , function (){
   io.emit("user-disconnect" , socket.id);

})


console.log("CONECTED")

})


app.get("/" , function (req , res){
res.render("index");
})
    
server.listen(3000);
