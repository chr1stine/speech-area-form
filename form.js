$(document).ready(function() {

    getAllQuestions('questions.json').done(function (questions) {
        questions.forEach(question => {
            console.log(typeof question);
            addQuestion(question);
        });
    });

});

var spheres = {
    "Имитация":0,
    "Моторные навыки":1,
    "Когнитивные навыки":2,
    "Навыки просьбы":3,
    "Совместное внимание":4,
    "Понимание речи":5,
    "Лингвистические навыки":6,
    "Навыки артикуляции":7
};

var ages = {
  "0-3":6,
  "3-6":5,
  "6-9":4,
  "9-12":3,
  "12-15":2,
  "15-18":1,
  "18-21":0
};

//матрица данных
var M = Array(8).fill(0).map(x=>Array(7).fill(0));

//размер холста под график
var size = 500;

//выведеление одного блока с вопросом и ответами на экран
function addQuestion(question){  

    let div = document.createElement("div");
    
    div.setAttribute("id",spheres[question["sphere"]]+ages[question["age"]]);
        
    let p = document.createElement("p");
    p.innerHTML = question["text"];
    div.appendChild(p);
  
    let radio_group_div = document.createElement("div");
    radio_group_div.setAttribute("class","input_group mb-5");
    answers = ["Да","50/50","Нет"];  
  
    for(j = 0; j < 3; j++){
        let label = document.createElement("label");
        let button = document.createElement("input");
        button.setAttribute("type","radio");
        button.setAttribute("name","answer"+spheres[question["sphere"]]+ages[question["age"]]);
        button.setAttribute("id","answer"+spheres[question["sphere"]]+ages[question["age"]]+j);
        button.setAttribute("class","form-check-input");
        button.setAttribute("value",answers[j]);
        button.addEventListener('change', function(){
        answers = $('input[type=radio]:checked');
        if (answers.length == questions.length){
            let btn = document.getElementById("infoBtn");
            btn.disabled = false;
        }
        });
   
        label.setAttribute("for","answer"+spheres[question["sphere"]]+ages[question["age"]]+j);
        label.setAttribute("class","mx-3");
        label.innerHTML = answers[j];
        
        radio_group_div.appendChild(button);
        radio_group_div.appendChild(label);
        radio_group_div.appendChild(document.createElement("br"));
    }

    div.appendChild(radio_group_div);

    document.getElementById("form").appendChild(div);
}

//загрузка вопросов из внешнего файла
function getAllQuestions(questionsFile) {
    return $.getJSON(questionsFile).then(function (data) {
        return data.items;
    });
}

//настройка холста под график
function setup(){
    var myCanvas = createCanvas(size, size);
    myCanvas.parent('plot');
}

//заполнение матрицы ответов для графика данными с формы
function infoGraphic(){

    for(i=0;i<Object.keys(spheres).length;i++){
        for(j=0;j<Object.keys(ages).length;j++){
            //в каждом div блоке выбрать только checked кнопку
            selected_answer = $('input[name=answer'+i+j+']:checked').val();
            if (selected_answer=='Да') 
                M[i][j] = 3;
            else if (selected_answer=='50/50')
                M[i][j] = 2;
            else if (selected_answer=='Нет')
                M[i][j] = 1;
        }
    }

    draw();
}

//отрисовка графика
function draw() {
    clear();
    let r = [];
    for (j=6;j>=0;j--)
        r[6-j] = 0.05*size*(1+j);
    // i - сектора и сферы
    // j - радиусы и возраста
    // h - разделители сфер( ~i)
    // M - матрица значений от 0 до 2, строки - круговая ось, столбцы - ось от центра "наружу"
    // radius of age = 20+age*20
    x0 = size/2;
    y0 = size/2;

    //метки сфер
    let a = PI/8;
    let step = 2*PI/8;
    let offset = size/2 - 0.06*size;
    textFont('Nunito');
    textSize(size/40);
    textStyle(BOLD);
    strokeWeight(0);
    textAlign(CENTER,CENTER);

    for (const [key, value] of Object.entries(spheres)) {
        let str = key.toString();
        if (str.toString().includes(' ')){
            str = str.replace(' ','\n');
        }
        fill(0, 100, 150);

        //костыль, чтоб надпись влезла
        if (key=='Лингвистические навыки'){
            text(str,x0-(offset-7)*sin(a), x0+35+offset*cos(a));
        }else{
            text(str,x0-offset*sin(a), x0+offset*cos(a));
        }
        a += step;
    }

    //цикл по радиусам(=возрастам) от большего к меньшему
    ellipseMode(RADIUS);
    fill(255);
    strokeWeight(2);
    stroke(0);
    for(j=0;j<Object.keys(ages).length;j++){ 

        //белый круг
        ellipse(x0,y0,r[j],r[j]);

        //начальный угод и шаг угла
        a = 0;
        step = 2*PI/8;

        //заполняем необходимые ячейки
        for(i=0;i<Object.keys(spheres).length;i++){
            switch(M[i][j]){
            case 2:
                fill(0,220,0);
                arc(x0,y0,r[j],r[j],PI/2+step*(i),PI/2+step*(i+1));
                fill(255);
                break;
            case 3:
                fill(0,120,10);
                arc(x0,y0,r[j],r[j],PI/2+step*(i),PI/2+step*(i+1));
                fill(255);
                break;
            //для не отвеченных/неотображаемых вопросов
            case 0:
                fill(230);
                arc(x0,y0,r[j],r[j],PI/2+step*(i),PI/2+step*(i+1));
                fill(255);
            }
        }

        //линии-разделители
        for(h=0;h<Object.keys(spheres).length;h++){
            line(x0, y0, x0-r[j]*sin(a), x0+r[j]*cos(a));
            a += step;
        }

    //переход к след радиусу
    }
    noLoop();
}