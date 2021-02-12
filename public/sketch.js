var spheres = {
  "Когнитивные навыки":0,
  "Моторные навыки":1,
  "Понимание речи":2,
  "Навыки просьбы":3,
  "Совместное понимание":4,
  "Имитация":5,
  "Навыки артикуляции":6,
  "Лингвистические навыки":7
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

var divs = [];

function check_if_all(){
    answers = $('input[type=radio]:checked');
    console.log(answers.length);
    if (answers.length == questions.length){
        let btn = document.getElementById("infoBtn");
        btn.disabled = false;
    }
}


function addQuestion(question){  
    //находим родителя 
    let parent = document.getElementById("form");
  
    //блок вопроса с ответами
    let div = document.createElement("div");
    
    div.setAttribute("id",spheres[question["sphere"]]+ages[question["age"]]);
    div.setAttribute("class","mx-5");
    //внутри блока тело вопроса
    let p = document.createElement("p");
    // h5.setAttribute("id",question["sphere"]+question["age"]);
    p.setAttribute("class","fs-5 fw-3");
    p.setAttribute("style","font-family: 'Nunito', Arial;");
    p.innerHTML = question["text"];
    div.appendChild(p);
  
    //варианты ответов
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
      button.addEventListener('change', check_if_all);
      radio_group_div.appendChild(button);
      // по умолчанию все ответы - Нет
    //   if (j==2){
    //       button.checked = true;
    //   }else{

    //   }
      label.setAttribute("for","answer"+spheres[question["sphere"]]+ages[question["age"]]+j);
      label.setAttribute("class","mx-3 fs-5");
      label.setAttribute("style","font-family: 'Nunito', Arial;");
      label.innerHTML = answers[j];
    
      radio_group_div.appendChild(label);
      radio_group_div.appendChild(document.createElement("br"));
    }
    div.appendChild(radio_group_div);
  
      //добавляем блок вопроса-ответов к родителю
      parent.appendChild(div);
  }


function getAllQuestions( ) {
    return $.getJSON("questions.json").then(function (data) {
        return data.items;
    });
}

$(document).ready(function() {

    getAllQuestions().done(function (questions) {
        questions.forEach(question => {
            console.log(typeof question);
            addQuestion(question);
        });
    });

});

function authorize(){
    //redirect on auth page
}

var size = 700;
function setup(){
  var myCanvas = createCanvas(size, size);
  myCanvas.parent("container");
}

var M = Array(8).fill(0).map(x=>Array(7).fill(0));

function infoGraphic(){

  for(i=0;i<Object.keys(spheres).length;i++){
      for(j=0;j<Object.keys(ages).length;j++){
        //в каждом div блоке выбрать только checked кнопка
        selected_answer = $('input[name=answer'+i+j+']:checked').val();
        console.log("value="+selected_answer);
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

function draw() {
    // let r = [140,120,100,80,60,40,20];
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
    let offset = size/2 - 0.07*size;
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
        text(str,x0-offset*sin(a), x0+offset*cos(a));
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
        // fill(255);

        //начальный угод и шаг угла
        a = 0;
        step = 2*PI/8;

        //заполняем необходимые ячейки
        for(i=0;i<Object.keys(spheres).length;i++){
            // console.log('arc TO BE drawn at sphere '+i+' age '+j);
            switch(M[i][j]){
            case 2:
                // console.log('weak arc drawn at sphere '+i+' age '+j);
                fill(0,220,0);
                arc(x0,y0,r[j],r[j],PI/2+step*(i),PI/2+step*(i+1));
                fill(255);
                break;
            case 3:
                // console.log('strong arc drawn at sphere '+i+' age '+j);
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