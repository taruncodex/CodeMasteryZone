const express = require("express");
const app = express();
const bodyP = require("body-parser");
const compiler = require("compilex");
const options = {stats:true};
compiler.init(options);
app.use(bodyP.json()); 
app.use(bodyP.urlencoded({extended: false}));
app.use(express.static("C:/CMZ/Code Editor"));
app.use("codemirror-5.65.16",express.static("C:/CMZ/Code Editor"));
app.get("/",function(req,res){
  compiler.flush(function(){
   console.log("deleted");
  });
  res.sendFile("C:/CMZ/Code Editor/index.html");
});

app.post("Code Editor/api/compile", async function (req, res){
  let code = req.body.code;
  let input = req.body.input;
  let lang = req.body.lang;
    try{
        if(lang == "C++"){
            if(!input){
                let envdata = {OS:"windows",cmd:"g++",options:{timeout:10000}};
                compiler.compileCPP(envdata,code,function(data){
                  if(data.output)
                
                    res.send(data);
                  else
                    res.end({output:"error"});
                });
            }
            else{
                let envData = {OS:"windows",cmd:"g++",options:{timeout:10000}};
                compiler.compileCPPWithInput(envData,code,input,function(data){
                  if(data.output)
                    res.send(data);
                  else
                    res.end({output:"error"});
                });
            }
        }
        else if(lang == "Java"){
            if(!input){
                let envData = {OS:"windows"};
                compiler.compileJava(envData,code,function(data){
                 if(data.output)
                    res.send(data);
                  else
                    res.end({output:"error"});
                });
            }
            else{
                let envData = {OS:"windows"};
                compiler.compileJavaWithInput(envData,code,input,function(data){
                  if(data.output)
                    res.send(data);
                  else
                    res.end({output:"error"});
                });
            }
        }
        else if(lang == "Python"){
            if(!input){
                let envData = {OS:"windows"};
                compiler.compilePython(envData,code,function(data){
                    if(data.output)
                      res.send(data);
                    else
                      res.end({output:"error"});
                });
            }
            else{
                let envData = {OS:"windows"};
                compiler.compilePythonWithInput(envData,code,input,function(data){
                    if(data.output)
                     res.send(data);
                    else
                     res.end({output:"error"});
                });
            }
        }
    }
    catch(e){
        console.log("Error");
    }
})

// module.exports = app;
app.listen( 3002, function (){
  console.log("listening on the port 3001");
}); 
