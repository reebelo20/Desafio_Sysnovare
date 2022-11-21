const fs = require("fs/promises")
var crypto = require("crypto")

// Define o ficheiro JSON que contém as informações dos utilizadores
const USERS = "utilizadores.json"

//Define o hash da passowrd criptografada utilizado o algoritmo md5
const hashPassword = (password) => crypto.createHash("md5").update(password).digest("hex")

//Cria um novo Utilizador
exports.insertUser = async (email, password) => {
    const rawData = await fs.readFile(USERS)
    const users = JSON.parse(rawData)
    const newUser = { email, password: hashPassword(password), saldo: 0 }
    users.push(newUser)
    await fs.writeFile(USERS, JSON.stringify(users, null, 4))
}

//Verifica se o email ainda não é existente entre os Utilizadores já criados
exports.checkEmail = async (email) => {
    const rawData = await fs.readFile(USERS)
    const users = JSON.parse(rawData)
    const filteredUsers = users.filter(item => item.email === email)
    return filteredUsers.length > 0
    console.log(email)
}

//Autentica o utilizador
exports.authUser = async (email, password) => {
    const rawData = await fs.readFile(USERS)
    const users = JSON.parse(rawData)
    const filteredUsers = users.filter(item => item.email === email && item.password === hashPassword(password))
    return filteredUsers.length > 0
}

//Retorna o saldo do Utilizaodr já logado
exports.getFunds = async (email) => {
    const rawData = await fs.readFile(USERS)
    const users = JSON.parse(rawData)
    const filteredUsers = users.filter(item => item.email === email)
    return filteredUsers[0]?.saldo
}

//Atualiza o saldo do Utilizador já logado
exports.updateFunds = async (email, valor) => {
    const rawData = await fs.readFile(USERS)
    const users = JSON.parse(rawData)
    const newUsers = users.map(item => item.email === email ? ({ ...item, saldo: item.saldo + valor }) : item)
    await fs.writeFile(USERS, JSON.stringify(newUsers, null, 4))
}
