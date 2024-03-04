const express =  require ("express");
const bodyParser = require ("body-parser");

const app = express() ;
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("Public"));

app.get("/" , function(req , res){
 res.sendFile(__dirname + "/index.html")

});
 
app.post("/log-in.html" , function(req, res){
    res.sendFile(__dirname + "/log-in.html");
});

app.post("/signup.html" , function(req , res){
    res.sendFile(__dirname + "/signup.html")
})



app.listen( 3001 , function (){
    console.log("listening on the port 3001");
}); 
