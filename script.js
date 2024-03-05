
// Elementos
const input_task = document.getElementsByClassName('input_task')[0] 
const input_modal = document.getElementById('input_modal')
const button_modal = document.getElementById('button_modal')
const modal = document.getElementById('modal1') 
const container_task = document.getElementById('container_task') 
const options_limpar = document.getElementById('limpar_concluidos') 
const quant_tasks = document.getElementsByClassName('quant_itens')[0] 
const button_todos = document.getElementById('button_todos') 
const button_ativo = document.getElementById('button_ativo') 
const button_concluido = document.getElementById('button_concluido') 
const quant_itens = document.getElementById('quant_itens')  
const button_theme = document.getElementById('theme') 
const body = document.getElementsByTagName('body')[0] 
const foto_back = document.getElementById('foto_back')  
const container_geral_task = document.getElementById('container_geral_task')  
const tasks = document.getElementsByClassName('task') 
const caixa_header_task = document.getElementsByClassName('caixa_header_task')[0] 
const button_check = document.getElementsByClassName('button_check')   
const caixa_task = document.getElementsByClassName('caixa_task')  
const options = document.getElementsByClassName('options') 
const container_options = document.getElementById('container_options')

// Funções

///Mudando de tema
button_theme.addEventListener('click', function(){
    ///  Mudando de tema para claro
    if(button_theme.classList.contains('escuro')){
        button_theme.classList.remove('escuro')
        button_theme.classList.add('claro')
        body.style.backgroundColor = 'hsl(0, 0%, 98%)'
        container_geral_task.style.backgroundColor = 'white'
        caixa_header_task.style.backgroundColor = 'white' 
        input_task.style.color = 'black'
        quant_itens.style.color = 'hsl(236, 9%, 61%)'
        foto_back.style.backgroundImage = 'url("images/bg-desktop-light.jpg")'
        container_options.style.backgroundColor = 'white'
        /// colocando cores nas opções
        for(element of options)  {
            if(element.style.color != 'rgb(58, 123, 253)'){
                element.style.color = 'hsl(236, 9%, 61%)' 
            }
        }
        for(element of caixa_task)  {
            element.style.borderBottomColor = 'hsl(233, 11%, 84%)'
        }
        for(element of tasks){
            element.style.color = 'black'
        }
        for(element of button_check){
            element.style.borderColor = 'hsl(235, 19%, 35%)'
        }
        
        /// Mudando de tema para escuro
    }else{
        button_theme.classList.remove('claro')
        button_theme.classList.add('escuro')
        body.style.backgroundColor = 'hsl(235, 21%, 11%)'
        container_geral_task.style.backgroundColor = 'hsl(237, 14%, 26%)'
        caixa_header_task.style.backgroundColor = 'hsl(237, 14%, 26%)'
        input_task.style.color = 'white'
        quant_itens.color = 'rgba(255, 255, 255, 0.253)'
        foto_back.style.backgroundImage = 'url("images/bg-desktop-dark.jpg")'
        container_options.style.backgroundColor = 'hsl(237, 14%, 26%)'
        for(element of options)  {
            if(element.style.color != 'rgb(58, 123, 253)'){
                element.style.color = 'rgba(255, 255, 255, 0.253)' 
            }
        }
        for(element of caixa_task)  {
            element.style.borderBottomColor = 'rgba(255, 255, 255, 0.192)'
        }
        for(element of tasks){
            element.style.color = 'white'
        }
        for(element of button_check){
            element.style.borderColor = 'white'
        }
        
    }
 })
// Verificando se o usuário digitou algum nome, caso tenha digitado, trazer as informações do banco.
var tasks_ativas = [];
button_modal.addEventListener('click', function(){
    if(input_modal.value == ''){
        alert('Digite algum nome para sua lista!')
    }else{
        modal.style.display = 'none'
        fetch(`https://banco-d861c-default-rtdb.firebaseio.com/${input_modal.value}.json`)
        .then(resolve => resolve.json())
        .then(dados =>{
            if(dados != null){
                var valores = Object.values(dados)
                valores.forEach((objeto)=>{
                    tasks_ativas.push(`${objeto.task}`)
                    container_task.innerHTML += `<div id="caixa_geral_task"  >
                    <label class="caixa_task"  >
                      <span class="button_check" id="${objeto.task}" onclick="verificar(event)"> 
                      <img src="images/icon-check.svg" alt="" class="img_check">
                      </span>
                      <span class="task"> ${objeto.task} </span>
                    </label>
                </div>`
                })
                
                quant_itens.innerHTML = `${valores.length} Itens`
            }
        })
    }
})
// Enviando os dados para o banco Firebase, assim que o usuário clicar na tecla Enter
input_task.addEventListener('keypress',function pressionar(evento) {
    if(evento.keyCode === 13){
        fetch(`https://banco-d861c-default-rtdb.firebaseio.com/${input_modal.value}.json`, {
            method:'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                task:`${input_task.value}`
            })
        })

        // Mostrando ao usuário a informação que ele adicionou na lista
        tasks_ativas.push(`${input_task.value}`)
        if(button_theme.classList.contains('escuro')){
            container_task.innerHTML += `<div id="caixa_geral_task" >
            <label class="caixa_task">
              <span class="button_check" id="${input_task.value}" onclick="verificar(event)">
              <img src="images/icon-check.svg" alt="" class="img_check" >
              </span>
              <span class="task"> ${input_task.value} </span>
            </label>
        </div>`
        input_task.value = ''
        }else{
            container_task.innerHTML += `<div id="caixa_geral_task" >
            <label class="caixa_task">
              <span class="button_check" id="${input_task.value}" onclick="verificar(event)" style="border-color: hsl(235, 19%, 35%)">
              <img src="images/icon-check.svg" alt="" class="img_check" >
              </span>
              <span class="task" style="color: black"> ${input_task.value} </span>
            </label>
        </div>`
        input_task.value = ''
            }
        }
         
    quant_itens.innerHTML = `${tasks_ativas.length + tasks_concluidas.length} Itens`
})

// Criando uma lista de tasks concluídas pelo usuário, a cada seleção de uma task
var tasks_concluidas = []
function verificar(obj){ ///
    var element = obj.target
    var elementospan = element.tagName === 'SPAN' ? element : element.parentNode;
    if (tasks_concluidas.includes(elementospan.id)){
        let indice_do_elemento = tasks_concluidas.indexOf(elementospan.id)
        tasks_concluidas.splice(indice_do_elemento, 1); /// Exclui a task do array de concluídas
        tasks_ativas.push(`${elementospan.id}`)
        
    }else{
        tasks_concluidas.push(`${elementospan.id}`)
        let indice_do_elemento = tasks_ativas.indexOf(elementospan.id)
        tasks_ativas.splice(indice_do_elemento, 1); /// Exclui a task do array de tasks ativas
    }

var task_selecionada = document.getElementById(`${elementospan.id}`)
var firstChild = task_selecionada.children[0]
var elementopai = elementospan.parentNode

if (button_theme.classList.contains('escuro')){
    if (task_selecionada.style.opacity != 1){
        firstChild.style.display = 'block'
        task_selecionada.style.background = 'linear-gradient(to right, hsl(192, 100%, 67%), hsl(280, 87%, 65%))'
        task_selecionada.style.opacity = 1
        elementopai.children[1].style.textDecoration = "line-through"
        elementopai.children[1].style.color = 'rgba(255, 255, 255, 0.253)'
    }else{
        firstChild.style.display = 'none'
        task_selecionada.style.background = 'none' 
        task_selecionada.style.opacity = 0.1 
        elementopai.children[1].style.textDecoration = "none"
        elementopai.children[1].style.color = 'white'
    }
    
}else{
    if (task_selecionada.style.opacity != 1){
        firstChild.style.display = 'block'
        task_selecionada.style.background = 'linear-gradient(to right, hsl(192, 100%, 67%), hsl(280, 87%, 65%))'
        task_selecionada.style.opacity = 1
        task_selecionada.style.borderColor = 'white'
        elementopai.children[1].style.textDecoration = "line-through"
        elementopai.children[1].style.color = 'hsl(233, 11%, 84%)'
    }else{
        firstChild.style.display = 'none'
        task_selecionada.style.background = 'none' 
        task_selecionada.style.opacity = 0.1 
        task_selecionada.style.borderColor = 'hsl(235, 19%, 35%)'
        elementopai.children[1].style.textDecoration = "none"
        elementopai.children[1].style.color = 'black'
        
    }
 
}

    
}

options_limpar.addEventListener('click', function() {
// Vinculando cada ID com a sua respectiva Task
    var meusid = [];
    var minhas_tasks = [];
    var  options = document.getElementById('container_options')
    var filhos_options = options.children
    
    
    fetch(`https://banco-d861c-default-rtdb.firebaseio.com/${input_modal.value}.json`)
        .then(resolve => resolve.json())
        .then(dados => {
            /// Cria o array com todos os ID's das tasks selecionadas pelo usuário
            valores = Object.values(dados);
            for (let key in dados) {
                meusid.push(`${key}`);
            }
            /// Cria o array com o nome de todas as tasks selecionadas pelo usuário
            valores.forEach(objeto => {
                minhas_tasks.push(`${objeto.task}`);
            });

            // Excluindo do banco as task's que foram selecionadas como concluídas
            const deleteRequests = tasks_concluidas.map(elemento => {
                var indice_task = minhas_tasks.indexOf(elemento);
                return fetch(`https://banco-d861c-default-rtdb.firebaseio.com/${input_modal.value}/${meusid[indice_task]}.json`, {
                    method: 'DELETE',
                    headers: {
                        'content-type': 'application/json'
                    }
                });
            });

            // Aguardando todas as requisições de exclusão serem concluídas
            Promise.all(deleteRequests)
                .then(() => {
                    // Após deletar as tarefas concluídas, renderiza as tarefas restantes na tela
                    return fetch(`https://banco-d861c-default-rtdb.firebaseio.com/${input_modal.value}.json`);
                })
                .then(resolve => resolve.json())
                .then(dados => {
                    container_task.innerHTML = '';
                    var valores = Object.values(dados);
                    tasks_concluidas = []
                    tasks_ativas=[]
                    if(button_theme.classList.contains('escuro')){
                        
                        valores.forEach(objeto => {
                            tasks_ativas.push(`${objeto.task}`)
                            container_task.innerHTML += `<div id="caixa_geral_task">
                                <label class="caixa_task">
                                    <span class="button_check" id="${objeto.task}" onclick="verificar(event)">
                                    <img src="images/icon-check.svg" alt="" class="img_check">
                                    </span>
                                    <span class="task">${objeto.task}</span>
                                </label>
                            </div>`;
                        });
                        for ( let element of filhos_options){
                            element.style.color = 'rgba(255, 255, 255, 0.253)'
                        }
                        button_todos.style.color = 'hsl(220, 98%, 61%)'
                        
                    }else{

                        valores.forEach(objeto => {
                            tasks_ativas.push(`${objeto.task}`)
                            container_task.innerHTML += `<div id="caixa_geral_task">
                                <label class="caixa_task" style="border-bottom-color: rgb(210, 211, 219)">
                                    <span class="button_check" id="${objeto.task}" onclick="verificar(event)" style="border-color: hsl(235, 19%, 35%)">
                                    <img src="images/icon-check.svg" alt="" class="img_check">
                                    </span>
                                    <span class="task" style="color: black">${objeto.task}</span>
                                </label>
                            </div>`;
                        });
                        for ( let element of filhos_options){
                            element.style.color = 'rgb(147, 148, 165)'
                        }
                        button_todos.style.color = 'hsl(220, 98%, 61%)'
                    }
                  
                    /// Mostrando o valor de tasks
                    quant_itens.innerHTML = `${tasks_ativas.length} Itens`
                    /// Deixando o botão todos ativo com a cor azul
            });
        })
        .catch(error => {
            console.error('Erro:', error);
        });
        
});

 button_ativo.addEventListener('click',function ativo(){
    
    var minhas_tasks = [];
    fetch(`https://banco-d861c-default-rtdb.firebaseio.com/${input_modal.value}.json`)
        .then(resolve => resolve.json())
        .then(dados => {
            valores = Object.values(dados);
            /// Cria o array com o nome de todas as tasks selecionadas pelo usuário
            valores.forEach(objeto => {
                minhas_tasks.push(`${objeto.task}`);
            });
            
            /// Gerando quais tasks são ativas
            var tasks_ativas = minhas_tasks.filter(function(elemento){
                return !tasks_concluidas.includes(elemento)
            })
            container_task.innerHTML = '';
            var  options = document.getElementById('container_options')
            var filhos_options = options.children
            if(button_theme.classList.contains('escuro')){
                tasks_ativas.forEach(objeto => {
                    container_task.innerHTML += `<div id="caixa_geral_task">
                        <label class="caixa_task">
                            <span class="button_check" id="${objeto}" onclick="verificar(event)">
                            <img src="images/icon-check.svg" alt="" class="img_check">
                            </span>
                            <span class="task">${objeto}</span>
                        </label>
                    </div>`;
                });
                for ( let element of filhos_options){
                    element.style.color = 'rgba(255, 255, 255, 0.253)'
                }
                button_ativo.style.color = 'hsl(220, 98%, 61%)'
            }else{
                tasks_ativas.forEach(objeto => {
                    container_task.innerHTML += `<div id="caixa_geral_task">
                        <label class="caixa_task" style="border-bottom-color: rgb(210, 211, 219)">
                            <span class="button_check" id="${objeto}" onclick="verificar(event)" style="border-color: hsl(235, 19%, 35%)">
                            <img src="images/icon-check.svg" alt="" class="img_check">
                            </span>
                            <span class="task" style="color: black">${objeto}</span>
                        </label>
                    </div>`;
                });
                for ( let element of filhos_options){
                    element.style.color = 'rgb(147, 148, 165)'
                }
                button_ativo.style.color = 'hsl(220, 98%, 61%)'
            }
           
            quant_itens.innerHTML = `${tasks_ativas.length} Itens`
        })
    
 })

 button_concluido.addEventListener('click',function(){
    container_task.innerHTML = ''
    var  options = document.getElementById('container_options')
    var filhos_options = options.children
    if(button_theme.classList.contains('escuro')){
        tasks_concluidas.forEach(objeto => {
            container_task.innerHTML += `<div id="caixa_geral_task">
                <label class="caixa_task">
                    <span class="button_check" id="${objeto}" onclick="verificar(event)" style="background-image: linear-gradient(to right, hsl(192, 100%, 67%), hsl(280, 87%, 65%));opacity: 1">
                    <img src="images/icon-check.svg" alt="" class="img_check" style="display: block">
                    </span>
                    <span class="task" style="text-Decoration:line-through; color: rgba(255, 255, 255, 0.255)">${objeto}</span >
                </label>
            </div>`;
        });
        for ( let element of filhos_options){
            element.style.color = 'rgba(255, 255, 255, 0.253)'
        }
        button_concluido.style.color = 'hsl(220, 98%, 61%)'
    }else{
        tasks_concluidas.forEach(objeto => {
            container_task.innerHTML += `<div id="caixa_geral_task">
                <label class="caixa_task" style="border-bottom-color: rgb(210, 211, 219)">
                    <span class="button_check" id="${objeto}" onclick="verificar(event)" style="background-image: linear-gradient(to right, hsl(192, 100%, 67%), hsl(280, 87%, 65%));opacity: 1">
                    <img src="images/icon-check.svg" alt="" class="img_check" style="display: block">
                    </span>
                    <span class="task" style="text-Decoration:line-through; color: hsl(233, 11%, 84%)">${objeto}</span >
                </label>
            </div>`;
        });
        for ( let element of filhos_options){
            element.style.color = 'rgb(147, 148, 165)'
        }
        button_concluido.style.color = 'hsl(220, 98%, 61%)'
    }
 
    quant_itens.innerHTML = `${tasks_concluidas.length} Itens`
 })

 button_todos.addEventListener('click',function(){
        container_task.innerHTML = '';
        var  options = document.getElementById('container_options')
        var filhos_options = options.children
        if(button_theme.classList.contains('escuro')){
            tasks_ativas.forEach(objeto => {
                container_task.innerHTML += `<div id="caixa_geral_task">
                    <label class="caixa_task">
                        <span class="button_check" id="${objeto}" onclick="verificar(event)">
                        <img src="images/icon-check.svg" alt="" class="img_check">
                        </span>
                        <span class="task">${objeto}</span>
                    </label>
                </div>`;
            });
            tasks_concluidas.forEach(objeto => {
                container_task.innerHTML += `<div id="caixa_geral_task">
                    <label class="caixa_task">
                        <span class="button_check" id="${objeto}" onclick="verificar(event)" style="background-image: linear-gradient(to right, hsl(192, 100%, 67%), hsl(280, 87%, 65%));opacity: 1">
                        <img src="images/icon-check.svg" alt="" class="img_check" style="display: block">
                        </span>
                        <span class="task" style="text-Decoration:line-through; color: rgba(255, 255, 255, 0.255)">${objeto}</span >
                    </label>
                </div>`;
            });
            for ( let element of filhos_options){
                element.style.color = 'rgba(255, 255, 255, 0.253)'
            }
            button_todos.style.color = 'hsl(220, 98%, 61%)'
        }else{
            tasks_ativas.forEach(objeto => {
                container_task.innerHTML += `<div id="caixa_geral_task">
                <label class="caixa_task" style="border-bottom-color: rgb(210, 211, 219)">
                <span class="button_check" id="${objeto}" onclick="verificar(event)" style="border-color: hsl(235, 19%, 35%)">
                <img src="images/icon-check.svg" alt="" class="img_check">
                </span>
                <span class="task" style="color: black">${objeto}</span>
            </label>
        </div>`;
        
            });
            tasks_concluidas.forEach(objeto => {
                container_task.innerHTML += `<div id="caixa_geral_task">
                <label class="caixa_task" style="border-bottom-color: rgb(210, 211, 219)">
                    <span class="button_check" id="${objeto}" onclick="verificar(event)" style="background-image: linear-gradient(to right, hsl(192, 100%, 67%), hsl(280, 87%, 65%));opacity: 1">
                    <img src="images/icon-check.svg" alt="" class="img_check" style="display: block">
                    </span>
                    <span class="task" style="text-Decoration:line-through; color: hsl(233, 11%, 84%)">${objeto}</span >
                </label>
            </div>`;
            });

            for ( let element of filhos_options){
                element.style.color = 'rgb(147, 148, 165)'
            }
            button_todos.style.color = 'hsl(220, 98%, 61%)'
        }

      
    
 quant_itens.innerHTML = `${tasks_ativas.length + tasks_concluidas.length} Itens`
 })



 
 