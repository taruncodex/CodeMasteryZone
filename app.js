const express =  require ("express");
const bodyParser = require ("body-parser");
const mongoose = require('mongoose');

const app = express() ;
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

//Creating the mongoose Model for User Sign-up
const Cmzuser  = mongoose.model('Cmzuser', UserSchema);

// Route to handle form submission.
// app.post('/signup', function(req, res){


// });
app.post('/signup', async function (req, res) {
    const { name, email, password } = req.body; // Destructure the request body

    // Check if the email already exists
    const existingUser = await Cmzuser.findOne({ email: email });
    if (existingUser) {
        res.sendFile(__dirname + "/failure.html");
        
    } else {
        // If email is unique, create a new User instance and save the user's information into the database
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





//<--TO SHOW HOMEPAGE -->
app.get("/" , function(req , res){
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

//<-- Failure Post [When email is not Unique -->
app.post("/failure", function (req , res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/success", function (req , res) {
    res.sendFile(__dirname + "/log-in.html");
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
