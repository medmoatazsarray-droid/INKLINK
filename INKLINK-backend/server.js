//server.js
const express= require('express');
const cors= require('cors');
const bodyParser = require('body-parser');

const app=express();
const PORT = process.env.PORT || 3000;
//middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend : true}));
//test-route
app.get('/',(req,res)=>
{
    res.json({
        message:'INKLINK API is running',
        project : 'Étincelle Design Agency'
    });
});
//start server
app.listen(PORT,()=>
{
    console.log(`serveur running on http://localhost:${PORT}`);
})