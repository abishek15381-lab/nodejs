const express = require("express");

const app = express();
app.use(express.json());


//logging middleware that logs the users requests
app.use((req,res,next) =>{
    console.log(`${req.method} ${req.url}`);
    next();
});

let users =[
    {
        "id":1,
        "name":"abi"
    },
    {
        "id":2,
        "name":"shek"
    }
]

//GET ROUTE -> get user
app.get("/users",(req,res)=>{
    res.json(users);
})

//Post ROUTE -> create user
app.post("/users" , (req,res) => {
    const newUser = {
        id: users.length+1 ,
        name: req.body.name
    };

    users.push(newUser);
    res.json(newUser);

});

//Put ROUTE -> update user
app.put("/users/:id",(req,res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);

    if(!user){
        res.status(404).json({message:"user not found"})
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

//server    
app.listen(3000 , ()=>{
    console.log("server running ")
})