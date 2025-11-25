const express = require("express");

const app = express();

users =[
    {
        "id":1,
        "name":"abi"
    },
    {
        "id":2,
        "name":"shek"
    }
]

//GET ROUTE -> create user
app.get('/',(req,res)=>{
    res.json(users);
})

//PUT ROUTE 
app.

//server
app.listen(3000 , ()=>{
    console.log("server running ")
})