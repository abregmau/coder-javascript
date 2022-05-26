//Se definen variables
let mem = 0;
let operando = 0;
let operador = "";

debugger
//Eventos de click
uno.onclick = function(e){
    resultado.textContent = resultado.textContent  + "1";
}
dos.onclick = function(e){
    resultado.textContent = resultado.textContent  + "2";
}
tres.onclick = function(e){
    resultado.textContent = resultado.textContent  + "3";
}
cuatro.onclick = function(e){
    resultado.textContent = resultado.textContent  + "4";
}
cinco.onclick = function(e){
    resultado.textContent = resultado.textContent  + "5";
}
seis.onclick = function(e){
    resultado.textContent = resultado.textContent  + "6";
}
siete.onclick = function(e){
    resultado.textContent = resultado.textContent  + "7";
}
ocho.onclick = function(e){
    resultado.textContent = resultado.textContent  + "8";
}
nueve.onclick = function(e){
    resultado.textContent = resultado.textContent  + "9";
}
cero.onclick = function(e){
    resultado.textContent = resultado.textContent  + "0";
}
coma.onclick = function(e){
    if(resultado.textContent.lastIndexOf('.')==-1)
        resultado.textContent = resultado.textContent  + ".";
}
reset.onclick = function(e){
    resetear();
}
suma.onclick = function(e){
    operando = resultado.textContent;
    resolver();
    operador = "+";
    limpiar();
}
resta.onclick = function(e){
    operando = resultado.textContent;
    resolver();
    operador = "-";
    limpiar();
}
multiplicacion.onclick = function(e){
    operando = resultado.textContent;
    resolver();
    operador = "*";
    limpiar();
}
division.onclick = function(e){
    operando = resultado.textContent;
    resolver();
    operador = "/";
    limpiar();
}
igual.onclick = function(e){
    operando = resultado.textContent;
    resolver();
    resultado.textContent = mem;
    operador = "";
}

//Se definen las funciones

function limpiar(){
    resultado.textContent = "";
}
function resetear(){
    resultado.textContent = "";
    mem = 0;
    operando = 0;
    operador = "";
}

function resolver(){
    let res = 0;
    switch(operador){
    case "+":
        res = parseFloat(mem) + parseFloat(operando);
        break;
    case "-":
        res = parseFloat(mem) - parseFloat(operando);
        break;
    case "*":
        res = parseFloat(mem) * parseFloat(operando);
        break;
    case "/":
        res = parseFloat(mem) / parseFloat(operando);
        break;
    case "":
        res = parseFloat(operando)
        break;
    }
    mem = res;
}