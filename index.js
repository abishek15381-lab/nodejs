const express = require("express");

const app = express();
app.use(express.json());

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