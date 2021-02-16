const express = require('express');
const app = express();

const PORT = 3000;

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/form.html');
});

app.get('/admin.html',(req,res)=>{
    res.sendFile(__dirname+'/login.html');
});

app.use(express.static('.'));

app.listen(PORT, () => {console.log('Server has been started at port '+PORT)});