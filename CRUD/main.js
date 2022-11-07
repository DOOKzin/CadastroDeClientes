'use strict'

function openModal() {
    return document.getElementById('modal')
        .classList.add('active')
}

function closeModal() {
    clearField()
    return document.getElementById('modal').classList.remove('active')
}

function getLocalStorage() { return JSON.parse(localStorage.getItem('db_client')) ?? [] }
function setLocalStorage(dbClient) { return localStorage.setItem("db_client", JSON.stringify(dbClient)) }

// CRUD - Create read update delete    

function deleteClient(index){
    const dbClient = readClient()
    dbClient.splice(index, 1)
    setLocalStorage(dbClient)
}

function updateClient(index, client){
    const dbClient = readClient()
    dbClient[index] = client
    setLocalStorage(dbClient)
}

function readClient() {
    return getLocalStorage()
}

function createCliente(client) {
    const dbClient = getLocalStorage()
    dbClient.push(client)
    setLocalStorage(dbClient)
}

function isValidFields (){
    return document.getElementById('form').reportValidity()
}


//Interação com o layout

function clearField(){
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('nome').dataset.index = "new"
}

function saveClient(){
    if(isValidFields()){
        const client = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value
        }
        const index = document.getElementById('nome').dataset.index
        if(index == 'new'){
            createCliente(client)
            updateTable()
            closeModal()
        }else{
            updateClient(index, client)
            updateTable()
            closeModal()
        }
        
    }
}

function createRow(client, index) {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>${client.celular}</td>
        <td>${client.cidade}</td>
        <td>
            <button type="button" class="button green" id="editar-${index}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                </svg>
            </button>
            <button type="button" class="button red" id="excluir-${index}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                </svg>
            </button>
        </td>
    `   
    document.querySelector('#tableClient>tbody').appendChild(newRow) 
}

function clearTable(){
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

function updateTable(){
    const dbClient = readClient()
    clearTable()
    dbClient.forEach(createRow)
}

function fillFields(cliente){
    document.getElementById('nome').value = cliente.nome
    document.getElementById('email').value = cliente.email
    document.getElementById('celular').value = cliente.celular
    document.getElementById('cidade').value = cliente.cidade
    document.getElementById('nome').dataset.index = cliente.index
}

function editCliente(index){
    const cliente = readClient()[index]
    cliente.index = index
    fillFields(cliente)
    openModal()

}


const editDelete = (evento) => {
    if (evento.target.type == 'button') {

        const [action, index] = evento.target.id.split('-')

        if (action == 'editar') {
            editCliente(index)
        } else {
            const client = readClient()[index]
            const response = confirm(`Deseja realmente excluir o cliente ${client.nome}`)
            if (response) {
                deleteClient(index)
                updateTable()
            }
            
        }
    }


}

updateTable()
 
// EVENTOS
document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveClient)

document.querySelector('#tableClient>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)