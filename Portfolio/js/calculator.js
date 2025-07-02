const body = document.getElementById('body');
let isBad = false;

// Agregar items a la calculadora
function Add(num) 
{
    body.style.color = '#1a237e';
    if (body.innerText === '0' || body.innerText === 'Error') body.innerText = num;
    else 
    { 
        if (isBad) // Si el EASTER EGG se activó, reemplazo el texto por el número y luego sigo agregando números normalmente
        {
            body.innerText = num;
            isBad = false;
        }
        else body.innerText += num;
    }

    if (body.innerText === '43954723') //EASTER EGG
    { 
        isBad = true;
        body.innerText = 'QUE HACES FLACO';
        body.style.color = 'red';
    }
}

// Limpiar el resultado
function Clear() { body.innerText = '0'; }

// Hacer el calculo
function Calc() 
{
    try { body.innerText = eval(body.innerText); }
    catch { body.innerText = 'Error'; }
}

// Hacer la potencia en base 2
function Pot() 
{
    try { body.innerText = Math.pow(eval(body.innerText), 2); }
    catch { body.innerText = 'Error'; }
}

// Hacer la raiz cuadrada
function Raiz() 
{
    try { body.innerText = Math.sqrt(eval(body.innerText)).toFixed(4); }
    catch { body.innerText = 'Error'; }
}