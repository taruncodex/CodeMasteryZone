const express =  require ("express");
const bodyParser = require ("body-parser");
const mongoose = require('mongoose');
const compiler = require("compilex");
// const compilerApi = require('./api');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static("Public"));

// <-- setting the mongodb -->//
const uri = 'mongodb://localhost:27017/CMZ';
mongoose.connect(uri);
const db = mongoose.connection;
db.on('error', console.error.bind(console,'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

let Check = {};
// <-- Defing the User Scema -->
const UserSchema =  new mongoose.Schema({
    name: {
        type: String,
        required: [true , "name is required"]
      },
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
    Output: mongoose.Schema.Types.Mixed
  });


//Creating the mongoose Model for User Sign-up
const Cmzuser  = mongoose.model('Cmzuser', UserSchema);
//Creating the Model for Log-in Schema
const Loginuser = mongoose.model('loginuser', loginSchema);
//Creating the Model for Log-in Schema
const Question = mongoose.model('Question', questionSchema  );


//Route to handle form submission.  
app.post('/signup', async function (req, res) {
    const { name, email, password } = req.body; // Destructure the request body

    //Check if the email already exists
    const existingUser = await Cmzuser.findOne({ email: email });
    if (existingUser) {
        res.sendFile(__dirname + "/failure.html");
        
    } else {
        //If email is unique, create a new User instance and save the user's information into the database
        const newUser = new Cmzuser({
            name: name, 
            email: email,
            password: password
        });
        newUser.save();
        console.log("The data is Saved");
        res.sendFile(__dirname + "/success.html"); // Replace with the actual name of your successful page
    }
});

// <-- Log-in Logic -->
app.post("/login", async function(req,res){

const {mail , password2 } = req.body;

 Check = await Cmzuser.findOne({ email: mail });
if(Check.password === password2){
    try {
        const questions = await Question.find(); // Fetch all questions
        res.redirect("/")// Pass questions to the template
      } catch (err) {
        console.error('Error fetching questions:', err);
        res.status(500).send('Internal Server Error');
      }
}else{
    res.send("<h1> Wrong Details </h1>");
}
}); 


app.get("/", async function(req, res) {
    const page = parseInt(req.query.page) || 1; // Get the current page from query params, default to 1
    const perPage = 18; // Number of questions per page
    try {
        const totalQuestions = await Question.countDocuments();
        const totalPages = Math.ceil(totalQuestions / perPage);

        const questions = await Question.find()
            .skip((page - 1) * perPage) // Skip the correct number of documents
            .limit(perPage); // Limit the number of documents

        // Render the try.ejs file with the necessary variables
        res.render('try', {
            username: Check.name, // Pass the username here
            questions: questions,
            totalPages: totalPages,
            currentPage: page
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
    console.log(query);
    const page = parseInt(req.query.page) || 1; // Get the current page from query params, default to 1
    const perPage = 18; // Number of questions per page
    // Build the query based on provided parameters
    if (difficulty) {
        query.difficulty = difficulty;
    }
    if (topic) {
        query.topic = topic;
    }
    
    console.log(query);
    try {
        const totalQuestions = await Question.countDocuments();
        const totalPages = Math.ceil(totalQuestions / perPage);

        const questions1 = await Question.find(query)
            .skip((page - 1) * perPage) // Skip the correct number of documents
            .limit(perPage); // Limit the number of documents
        
        res.render('try', {
            username: Check.name, // Pass the username here
            questions: questions1,
            totalPages: totalPages,
            currentPage: page
        });
        


    } catch (err) {
        console.error('Error fetching questions:', err);
        res.status(500).send('Internal Server Error');
    }
});






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