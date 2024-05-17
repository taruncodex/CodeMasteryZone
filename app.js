const express =  require ("express");
const bodyParser = require ("body-parser");
const mongoose = require('mongoose');
const compiler = require("compilex");
const validator = require("validator");
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  
const upload = multer({ storage: storage });
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());
// Serve static files from the 'public' directory
app.use(express.static('public'));
// compiler addition 
const options = {stats:true};
compiler.init(options);  //init() creates a folder named temp in your project directory which is used for storage purpose. Before using other methods , make sure to call init() method. 

// <-- setting the mongodb -->//
const uri = 'mongodb://localhost:27017/CMZ';
mongoose.connect(uri);
const db = mongoose.connection;
db.on('error', console.error.bind(console,'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


// <-- Defing the User Scema -->
const UserSchema =  new mongoose.Schema({
    userName: {
        type: String,
        required: [true , "name is required"]
      },
      email: {
        type: String,
        required: true,
        unique: true,
        validate: {
          validator: function(v) {
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
          },
          message: props => `${props.value} is not a valid email address!`
        }
      } ,
     password: {
        type: String,
        required: [true, "Password is required"]
     },
     avatar:String,
     first:String,
     last:String,
     address:String,
     contact:Number,
     city:String,
     country:String,
     about:String
});

 // <-- Defing the loginUser Scema -->
const loginSchema =  new mongoose.Schema({
      email: {
        type: String,
        required: true,
        //unique: true// Ensures uniqueness
      } ,
     password: {
        type: String,
        required: [true, "Password is required"]
     }
 });

   // <-- Defing the Question Scema -->
   const questionSchema = new mongoose.Schema({
    _id: Number,
    title: String,
    difficulty: String,
    topic: String,
    description: String,
    Input: mongoose.Schema.Types.Mixed, // Can be a string or array of strings
    Output: mongoose.Schema.Types.Mixed,
    Input2: mongoose.Schema.Types.Mixed,
    Output2: mongoose.Schema.Types.Mixed
  });



//Creating the mongoose Model for User Sign-up
const Cmzuser  = mongoose.model('Cmzuser', UserSchema);
//Creating the Model for Log-in Schema
const Loginuser = mongoose.model('loginuser', loginSchema);
//Creating the Model for Log-in Schema
const Question = mongoose.model('Question', questionSchema  );


app.post('/signup', async function (req, res) {
    const { username, mail, password } = req.body; // Destructure the request body

    //Check if the email already exists
    const existingUser = await Cmzuser.findOne({ email: mail });
    if (existingUser) {
        res.sendFile(__dirname + "/failure.html");

    } else {
        //If email is unique, create a new User instance and save the user's information into the database
        const newUser = new Cmzuser({
            userName: username,
            email: mail,
            password: password
        });
        newUser.save();
        console.log("The data is Saved");
        res.sendFile(__dirname + "/success.html"); // Replace with the actual name of your successful page
    }
});

// <-- Log-in Logic -->
let Check = {};
app.post("/login", async function(req,res){

const {mail , password2 } = req.body;

 Check = await Cmzuser.findOne({ email: mail });

if(Check){
    if(Check.password === password2){
        res.render('profile', {userName: Check.userName, useremail : Check.email});
    }else{
    res.send("<h1> Wrong Details </h1>");
   }
 }
else{
   res.sendFile(__dirname + "/failure2.html");
 }
});


app.post("/submit",upload.single('avatar'), async (req, res) => {
    const { username, mail, first_name, last_name, address, contact_no, city, country, about_me } = req.body;

    const avatarPath = `/uploads/${req.file.filename}`; 

    try {
      const resu = await Cmzuser.updateOne({email: Check.email},
     {
      $set:{
            avatar:avatarPath,
            userName: username,
            email:mail,
            first: first_name,
            last: last_name,
            address: address,
            contact: contact_no,
            city: city,
            country: country,
            about: about_me
          } 
        });
        res.redirect("/"); 
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).send(error.message); // Send error message to client
    }

    Check = await Cmzuser.findOne({ email: mail });
});


app.get("/", async function(req, res) {
    const page = parseInt(req.query.page) || 1; // Get the current page from query params, default to 1
    const perPage = 14; // Number of questions per page
    try {
        const totalQuestions = await Question.countDocuments();
        const totalPages = Math.ceil(totalQuestions / perPage);

        const questions = await Question.find()
            .skip((page - 1) * perPage) // Skip the correct number of documents
            .limit(perPage); // Limit the number of documents


        // Render the try.ejs file with the necessary variables
        res.render('try', {
            questions: questions,
            totalPages: totalPages,
            currentPage: page,
            user: Check
        });
    } catch (err) {
        console.error('Error fetching questions:', err);
        res.status(500).send('Internal Server Error');
    }
});

// <-- Questions filtering route -->
// Route to fetch questions with optional filtering
app.get("/questions", async (req, res) => {
    const { difficulty, topic } = req.query;
    let query = {};

    const page = parseInt(req.query.page) || 1; // Get the current page from query params, default to 1
    const perPage = 14; // Number of questions per page
    // Build the query based on provided parameters
    if (difficulty) {
        query.difficulty = difficulty;
    }
    if (topic) {
        query.topic = topic;
    }


    try {
        const totalQuestions = await Question.countDocuments();
        const totalPages = Math.ceil(totalQuestions / perPage);

        const questions1 = await Question.find(query)
            .skip((page - 1) * perPage) // Skip the correct number of documents
            .limit(perPage); // Limit the number of documents

            res.render('try', {
                questions: questions1,
                totalPages: totalPages,
                currentPage: page,
                user:Check
            });



    } catch (err) {
        console.error('Error fetching questions:', err);
        res.status(500).send('Internal Server Error');
    }
});

  let question;

app.get("/questions/:id", async (req, res) => {
compiler.flush(function(){
    console.log("temp files deleted")
})
    const questionId = req.params.id;
//   console.log(questionId);
//   console.log("running");
    try{
        question = await Question.findById(questionId);
        if(!question){
            return res.status(404).send("Question not found");
        }
        res.render('singleQuestion',{questions: question,user:Check});
    }
     catch(err){
      console.error("Error fetching question: ", err);
      res.status(500).send('Internal Server Error');
     }
});

// cmpiler post
let quesOutput = false;
app.post("/questions/:id/compile",function(req,res){
    var code = req.body.code;
    var input = req.body.input;
    var lang = req.body.lang;
   
      try{

        quesOutput = false;

          if(lang == "C++")
            {
              if(!input)
                {
                  var  envdata = {OS:"windows",cmd:"g++",options:{timeout:10000}};
                  compiler.compileCPP(envdata,code,function(data){
                   
                    if(data.output)
                      {
                       res.send(data);
                       }
                    else{
                    res.send({output:data.error});}
                  });
              }
              else{
                  let envData = {OS:"windows",cmd:"g++",options:{timeout:10000}};
                  compiler.compileCPPWithInput(envData,code,input,function(data){
                    if(data.output){
                        res.send(data);
                    }
                      
                    else
                    res.send({output:data.error});
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
                    res.send({output:data.error});
                  });
              }
              else{
                  let envData = {OS:"windows"};
                  compiler.compileJavaWithInput(envData,code,input,function(data){
                    if(data.output)
                      res.send(data);
                    else
                    res.send({output:data.error});
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
                      res.send({output:data.error});
                  });
              }
              else{
                  let envData = {OS:"windows"};
                  compiler.compilePythonWithInput(envData,code,input,function(data){
                      if(data.output)
                       res.send(data);
                      else
                      res.send({output:data.error});
                  });
              }
          }
      }
      catch(e){
          console.log("Error");
      }
  });

  //Submit button
    app.post("/questions/:id/Run",function(req,res){
      var code = req.body.code;
      var input = question.Input2;
      var lang = req.body.lang;

      console.log(question.Input);
        try{
            quesOutput = false;
            if(lang == "C++")
              {
                if(input)
                {
                    let envData = {OS:"windows",cmd:"g++",options:{timeout:10000}};
                    compiler.compileCPPWithInput(envData,code,input,function(data){
                    console.log(input);
                    console.log(data);
                  if(data.output)
                          {
                             console.log(question.Output2);
                             console.log(data.output);
                              if ( question.Output2 == data.output.toString() ) {
                                    quesOutput = true;
                                  res.send({output:  data.output+" (Testcase Pass)"});

                              } 
                              else{
                                  res.send({output:  data.output+" (Testcase Fail)"});
                              }
                          }
                      else
                        res.send({output:data.error});
                    });
                }
            }
            else if(lang == "Java"){
                if(input){
                  let envData = {OS:"windows" , options:{timeout:10000}};
                  compiler.compileJavaWithInput(envData,code,input,function(data){
                      if(data.output)
                          {
                              if ( question.Output2 == data.output.toString()  ) {
                                      quesOutput = true;
                                  res.send({output:  data.output+" (Testcase Pass)"});
                              }
                              else{
                                  res.send({output:  data.output+" (Testcase Fail)"});
                              }
                          }
                    else
                    res.send({output:data.error});
                  });
                }
            }
            else if(lang == "Python"){
                if(input){
                  let envData = {OS:"windows" , options:{timeout:10000}};
                    compiler.compilePythonWithInput(envData,code,input,function(data){
                      if(data.output)
                          {
                              if ( question.Output2 == data.output ) {
                                      quesOutput = true;
                                  res.send({output:  data.output+" (Testcase Pass)"});
                              }
                              else{
                                  res.send({output:  data.output+" (Testcase Fail)"});
                              }
                          }
                        else
                        res.send({output:data.error});
                    });
                }
            }
        }
        catch(e){
            console.log("Error");
        }
    });


app.post("/quesSuccess",async(req,res)=>{
        try {
           
          if (quesOutput) {
            
              res.render("quesSuccess",{userName:Check.userName});
          } else {
              res.send("Not match");
          }
        } catch (error) {
            res.send("Internal server error");
        }
    })
// <--TO SHOW HOMEPAGE -->
app.get("/home" , function(req , res){
    res.sendFile(__dirname + "/HomePage.html")
});

// <--DIRECT TO LOG-IN PAGE-->
app.post("/log-in.html" , function(req, res){
    res.sendFile(__dirname + "/log-in.html");
});

// <--DIRECT TO SIGN-UP PAGE-->
app.post("/signup.html" , function(req , res){
    res.sendFile(__dirname + "/signup.html")
});

// <-- Failure Post [When email is not Unique -->
app.post("/failure", function (req , res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/success", function (req , res) {
    res.sendFile(__dirname + "/log-in.html");
});

app.post("/contactUs", function (req , res) {
    res.redirect("/home");
});
app.get("/contactUs", function (req , res) {
    res.sendFile(__dirname + "/contactUs.html");
});
app.get("/register", function (req , res) {
    res.sendFile(__dirname + "/signup.html");
});
app.get("/feedback", function (req , res) {
    res.sendFile(__dirname + "/feedback.html");
});
app.get("/aboutUs", function (req , res) {
    res.sendFile(__dirname + "/aboutUs.html");
});



app.listen( 3001 , function (){
    console.log("listening on the port 3001");
});



// app.post('/signup',   function(req, res) {
//     const { name, email, password } = req.body; // Destructure the request body

//     // If email is unique, create a new User instance
//     const newUser = new Cmzuser({
//       name: name,
//       email: email,
//       password: password
//     });
//     newUser.save();
//     console.log("The data is Saved");
// });



// <--  split screen rendering -->
// app.post("/login", async function(req,res){
//     const {mail , password2 } = req.body;
//      Check = await Cmzuser.findOne({ email: mail });
//     if(Check.password === password2){
//         res.render('splitscreen', {userName: Check.name });
//     }else{
//         res.send("<h1> Wrong Details </h1>");
//     }
//     });
