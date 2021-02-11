$(document).ready(function(){
    document.getElementById("authBtn").addEventListener("click", function(){
        //получить строку пароля
        let password = document.getElementById("password");
        auth(password);
    });
});

function auth(password){
    //todo: запрос к серверу на express, хранение в nedb в захешированном виде
}
