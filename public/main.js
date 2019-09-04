window.onload = getToDoList;

function getToDoList() {
    axios
      .get("/getToDoList")
      .then(res =>{
          let list = res.data;
          list.forEach(element => {
              addToList(element.text,element._id);
          });
      })
      .catch(err => console.error(err));
}

function addToList(value,dataId) {
    let ul = document.getElementById('toDoList');
    let li = document.createElement('li');
    li.appendChild(getSpanElement(value,dataId));
    li.appendChild(getButtonElement('remove','Remove'));
    li.appendChild(getButtonElement('edit','Edit'));
    ul.appendChild(li);
}

function getButtonElement(cls,value) {
    let btn =  document.createElement('button');
    btn.classList.add(cls);
    btn.textContent = value;
    return btn;
}

function getSpanElement(value,dataId) {
    let spn = document.createElement('span');
    spn.textContent = value;
    spn.setAttribute("data-id",dataId);
    spn.setAttribute("contenteditable",false);
    return spn;
}

document.addEventListener("click",function(event) {
    if(event.target.classList.contains("add-btn")) {
        addNewItem(event);
    }

    if(event.target.classList.contains("remove")) {
        removeItem(event);
    }

    if(event.target.classList.contains("edit")) {
        editItem(event);
    }
})

function editItem(event) {
    let liElement = event.target.parentNode;
    let editBtn = event.target;
    editBtn.textContent = "Save Changes"
    let spanElement = liElement.firstElementChild;
    let flag = spanElement.getAttribute("contenteditable");
    let initValue = spanElement.textContent;
    let dataId = spanElement.getAttribute("data-id");
    spanElement.setAttribute("contenteditable",true);
    spanElement.focus();

    spanElement.onblur = function() {
        spanElement.setAttribute("contenteditable",false);
        let finalValue = spanElement.textContent;
        editBtn.textContent = "Edit"
        axios
            .post("/update-item",{value:finalValue,_id:dataId})
            .then(res => spanElement.textContent = finalValue)
            .catch(err => console.error(err));
    }
    
}

function removeItem(event) {
    let liElement = event.target.parentNode;
    let item = liElement.firstElementChild.textContent;
    axios
      .post("/removeItem",{value:item})
      .then(res => {
        liElement.parentNode.removeChild(liElement);
      })
      .catch(err => console.error(err));
}

function addNewItem(event) {
    let userInput = document.getElementById("inputField").value;
    axios
        .post("/addToList",{value:userInput})
        .then(res => {
              addToList(userInput,res.data.insertedId);
        })
        .catch(err => console.error(err));
}