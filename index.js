const express = require("express");
const bcrypt = require("bcryptjs");
const Jwt = require("jsonwebtoken")

const app = express();

app.use(express.json()); 

//--> to read json bodies from clients

//connect with mongo db cloud 
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://abishek:1234abi@cluster0.8l8eojj.mongodb.net/?appName=Cluster0")
  .then(() => console.log(" MongoDB connected"))
  .catch(err => console.log(" MongoDB error:", err));



//logging middleware that logs the users requests
app.use((req,res,next) =>{
    console.log(`${req.method} ${req.url}`);
    next();
});

//validation middleware , validate the post request has the name 
function validateName(req,res,next) {
    if(!req.body.name){
       return res.status(400).json({message:"name is required"})
    }
    next();
}

//AUTH Middleware for protect routes
function auth(req,res,next){
    // take token ->  validate -> save payload in req object
    const token  = req.headers.authorization?.split(" ")[1];

    console.log(token)

    if(!token){
        return res.status(401).json({message:"require token "});
    }

    try {
        const decoded = Jwt.verify(token,"secret");
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({message:"invalid token"});
    }
}
// function auth(req, res, next) {
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ message: "No token provided" });
//   }

//   try {
//     const decoded = Jwt.verify(token, "secret");
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// }

// function auth(req, res, next) {
//   const header = req.headers.authorization;
//   console.log("HEADER:", header);

//   const token = header?.split(" ")[1];
//   console.log("TOKEN:", token);

//   if (!token) {
//     return res.status(401).json({ message: "No token provided" });
//   }

//   try {
//     const decoded = jwt.verify(token, "SECRET123");
//     console.log("DECODED:", decoded);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     console.log("JWT ERROR:", err.message);
//     return res.status(401).json({ message: "Invalid token" });
//   }
// }





// let users =[
//     {
//         "id":1,
//         "name":"abi"
//     },
//     {
//         "id":2,
//         "name":"shek"
//     }
// ]

const User = require("./model/User");

            //------------AUTHENTICATION----------------//

//SIGNUP ROUTE
app.post("/signup", async(req,res) =>{
    const {name , email , password} =req.body;

    const existingUser = await User.findOne({email});

    if (existingUser){
        return res.status(400).json({message:"email already exists"})
    }

    //hash pass
    const hashedPassword = await bcrypt.hash(password,10);

    const user = new User({
        name,
        email,
        password:hashedPassword
    });

    await user.save();

    res.json({message:"user created"});
});

//LOGIN ROUTE
app.post("/login", async(req,res) =>{
    console.log("Body received:", req.body);


    const {email , password} = req.body ;
    
    //check user exists
    const user = await User.findOne({email});
    if(!user){
       return res.status(400).json({message:"invalid username or password "});
    }

    //checks password matches
    const isMatch = await bcrypt.compare(password , user.password);
    if(!isMatch){
        return res.status(400).json({message:"invalid username or password"});
    }

    //generate token
    const token = await Jwt.sign({id:user.id},"secret" , {expiresIn: "1h"});

    res.json({message:"login successful",token});
});

//PROFILE ------ PROTECTED ROUTE 
app.get("/profile",auth,async (req,res) => {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
});


//---------------END----------------------//

//GET ROUTE -> get user
app.get("/users",async (req,res)=>{
    //mongo 
    const users = await User.find();
    res.json(users);
})

//Post ROUTE -> create user
app.post("/users" , validateName , async (req,res) => {
    // const newUser = {
    //     id: users.length+1 ,
    //     name: req.body.name
    // };

    //mongo dd
    const user = new User({
        name:req.body.name
    });
    await user.save(user)

    // users.push(newUser);
    res.json(user);

});

//Put ROUTE -> update user
app.put("/users/:id",(req,res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);

    if(!user){
       return res.status(404).json({message:"user not found"})
    }
    user.name = req.body.name;
    res.json(user)
})

//delete ROUTE -> delete user
app.delete("/users/:id",(req,res) => {
    const id = parseInt(req.params.id);
     users = users.filter(u => u.id !== id);
    res.json({message:"user deleted"});
});

//error handling middleware
app.use((err, req, res, next) => {
    console.error(err.message)
    res.status(500).json({message:"something went wrong"})
})



//server    
app.listen(3000 , ()=>{
    console.log("server running ")
})