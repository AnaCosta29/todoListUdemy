//Armazenar o dom em variavel
const inputItem = document.getElementById('item-input')
const todoaddForm = document.getElementById('todo-add')
const ul = document.getElementById('todo-list')
const lis = ul.getElementsByTagName('li')

//Criar uma funçao para armazenar localStorage
let arrTasks = getSavedData()

function getSavedData() {
    let tasksData = localStorage.getItem("tasks")
    tasksData = JSON.parse(tasksData)
    return tasksData && tasksData.length ? tasksData : [{
        name: 'example',
        createAt: Date.now(),
        completed: false
    }, ]
}

function setNewData() {
    localStorage.setItem('tasks', JSON.stringify(arrTasks))
}

setNewData()

function clickedUl(e) {
    const dataAction = e.target.getAttribute('data-action')
    if (!dataAction) return

    //identificar li clicada 
    let currentLi = e.target
    while (currentLi.nodeName !== 'LI') {
        currentLi = currentLi.parentElement
    }

    //para saber o indice do elemento clicado da LI
    const currentLiIndex = [...lis].indexOf(currentLi)

    //criar um objeto  de funções 
    const actions = {
        editButton: function () {
            [...ul.querySelectorAll('.editContainer')].forEach(container => container.removeAttribute('style'))
            const editContainer = currentLi.querySelector('.editContainer')
            editContainer.style.display = 'flex'

        },
        deleteButton: function () {
            arrTasks.splice(currentLiIndex, 1)
            renderTasks()
            setNewData()
        },
        containerEditButton: function () {
            const val = currentLi.querySelector(".editInput").value
            arrTasks[currentLiIndex].name = val
            renderTasks()
            setNewData()
        },
        cancelButton: function () {
            currentLi.querySelector('.editContainer').removeAttribute('style')
            currentLi.querySelector('.editInput').value = arrTasks[currentLiIndex].name
        },
        checkButton: function () {
            arrTasks[currentLiIndex].completed = !arrTasks[currentLiIndex].completed
            if(arrTasks[currentLiIndex].completed){
                currentLi.querySelector('.fa-check').classList.remove('displayNone')
            }else{
                currentLi.querySelector('.fa-check').classList.add('displayNone')
            }
            setNewData()
            renderTasks()
        }
    }

    if (actions[dataAction]) {
        actions[dataAction]()
    }
}

function generateLiTask(obj) {
    const li = document.createElement('li')
    const p = document.createElement('p')
    const checkButton = document.createElement('button')
    const editButton = document.createElement('i')
    const deleteButton = document.createElement('i')

    li.className = 'todo-item'

    checkButton.className = 'button-check'
    checkButton.innerHTML =`
        <i class="fas fa-check ${obj.completed ? "" : "displayNone"}" data-action ="checkButton"></i>`
        checkButton.setAttribute("data-action", "checkButton");

    li.appendChild(checkButton)

    p.className = 'task-name'
    p.textContent = obj.name
    li.appendChild(p)

    editButton.className = "fas fa-edit"
    editButton.setAttribute('data-action', 'editButton')
    li.appendChild(editButton)

    const editContainer = document.createElement('div')
    editContainer.className = 'editContainer'

    const editInput = document.createElement('input')
    editInput.className = 'editInput'
    editInput.setAttribute('type', 'text')
    editInput.value = obj.name
    editContainer.appendChild(editInput)

    const containerEditButton = document.createElement('button')
    containerEditButton.className = 'editButton'
    containerEditButton.textContent = 'Edit'
    containerEditButton.setAttribute('data-action', 'containerEditButton')
    editContainer.appendChild(containerEditButton)

    const cancelButton = document.createElement('button')
    cancelButton.className = 'cancelButton'
    cancelButton.textContent = 'Cancel'
    cancelButton.setAttribute('data-action', 'cancelButton')
    editContainer.appendChild(cancelButton)

    li.appendChild(editContainer)

    deleteButton.className = "fas fa-trash-alt"
    deleteButton.setAttribute('data-action', 'deleteButton')
    li.appendChild(deleteButton)

    // addEventLi(li)
    return li
}

function renderTasks() {
    ul.innerHTML = ""
    arrTasks.forEach(taks => {
        ul.appendChild(generateLiTask(taks))
    })
}

function addTaks(task) {
    arrTasks.push({
        name: task,
        createAt: Date.now(),
        completed: false
    })
    setNewData()
}

todoaddForm.addEventListener('submit', function (e) {
    e.preventDefault();
    addTaks(inputItem.value)
    renderTasks()
    inputItem.value = ""
    inputItem.focus()
});
ul.addEventListener('click', clickedUl)
renderTasks()