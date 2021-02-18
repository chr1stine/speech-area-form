const PORT = process.env.PORT || 80;

const express = require('express');
const app = express();

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/form.html');
});

app.get('/admin.html',(req,res)=>{
    res.sendFile(__dirname+'/login.html');
});

app.use(express.static('.'));

app.listen(PORT, () => {console.log('Server has been started at port '+PORT)});