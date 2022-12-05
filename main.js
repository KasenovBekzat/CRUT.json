const API = "http://localhost:8001/Name"
let name1 = document.querySelector('#name')
let lastName = document.querySelector('#last-name')
let number = document.querySelector('#number')
let image = document.querySelector('#image')
let btnClick = document.querySelector('#btn-click')

let list = document.querySelector('#name-list')

let editName = document.querySelector('#edit-name')
let editLastName = document.querySelector('#edit-last-name')
let editNumber = document.querySelector('#edit-number')
let editImage = document.querySelector('#edit-image')
let editSaveBtn = document.querySelector('#btn-saveEdit')
let exampleModal = document.querySelector('#exampleModal')


btnClick.addEventListener("click", async function () {
    let obj = {
        name1: name1.value,
        lastName: lastName.value,
        number: number.value,
        image: image.value,
    };
    if (
        !obj.name1.trim() ||
        !obj.lastName.trim() ||
        !obj.number.trim() ||
        !obj.image.trim()
    ) {
        alert("Все поля должны быть заполнены");
        return;
    }
    await fetch(API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(obj),
    });

    render();

    name1.value = '';
    lastName.value = '';
    number.value = '';
    image.value = '';
});

render();
async function render() {
    let names = await fetch(API)
        .then((res) => res.json())
        .catch((err) => console.log(err));
    list.innerHTML = '';

    names.forEach((element) => {
        let newElem = document.createElement('div')
        newElem.id = element.id;
        newElem.innerHTML = `
        <div class="card m-5" style="width: 20rem;">
  <img src="${element.image}" class="card-img-top" alt="...">
  <div class="card-body">
    <h2 class="card-title">${element.name1}</h2>
    <p class="card-text" style="font-size: 35px">${element.number}</p>
    <p class="card-text" style="font-size: 35px">${element.lastName}</p>
    <a href="#" class="btn btn-danger btn-delete" id="${element.id}">DELETE</a>
    <a href="#" class="btn btn-primary btn-edit" data-bs-toggle="modal" data-bs-target="#exampleModal" id=${element.id}>EDIT</a>
  </div>
</div>`;
        list.append(newElem);
    });
}

//!
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn-edit')) {
        let id = e.target.id
        fetch(`${API}/${id}`).then((res) => res.json())
            .then((data) => {
                editName.value = data.name1;
                editLastName.value = data.lastName;
                editNumber.value = data.number;
                editImage.value = data.image;
                editSaveBtn.setAttribute('id', data.id)
            })
    }
});

editSaveBtn.addEventListener('click', function () {
    let id = this.id
    let name1 = editName.value;
    let lastName = editLastName.value;
    let number = editNumber.value;
    let image = editImage.value;
    if (!name1 || !lastName || !number || !image) return;
    let editedNames = {
        name1: name1,
        lastName: lastName,
        number: number,
        image: image,
    };
    saveEdit(editedNames, id);
});
async function saveEdit(editedNames, id) {
    await fetch(`${API}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(editedNames),
    });
    render();
    let modal = bootstrap.Modal.getInstance(exampleModal);
    modal.hide();
};
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-delete")) {
        let id = e.target.id;
        fetch(`${API}/${id}`, {
            method: "DELETE",
        }).then(() => {
            list.innerHTML = "";
            render();
        });
    }
});