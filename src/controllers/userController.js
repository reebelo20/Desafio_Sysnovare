'use strict';


const {checkEmail, authUser, getFunds, updateFunds} = require("../models/userModel");
const {insertUser} = require ("../models/userModel");
const {generateToken} = require("../../auth");
const {token} = require("@hapi/jwt");




//Regista o Utilizador
exports.registarUtilizador = async (request, h) => {
    const rb = request.payload
    const todosParams = rb.email && rb.password;
    //Verifica se o email inserido já existe entre os Utilizadores registado
    const emailExiste = await checkEmail(rb.email);
    //Verifica se todos os parâmetros necessários para criar conta foram inseridos
    if (!todosParams) {
        //Retorna uma mensagem a informar que os campos necessários não foram preenchidos
        return h
            .response({"message": "É necessário preencher todos os campos!"})
            .code(400)
    }
    try {
        //Se o email já existir retorna uma mensagem a avisar que o email já existe
        if (emailExiste) {
                return h.response({message: "Email já registado!"}).code(400)
        } else {
            //Se o email não existir regista o Utilizador e retorna uma mensagem a dizer que o Utilizador foi registado
            await insertUser(rb.email, rb.password)
            return h
                .response({message: "Utilizador criado com sucesso!"})
                .code(201)
        }
    }catch (e){
        //Se ocorrer um erro retorna a informação ao Utilizador a dizer que ocorreu um erro inesperado
        return h.response({message: "Erro inesperado!"})
            .code(500)
    }
}

//Autentica o Utilizador quando este faz login
exports.autenticar = async (request, h) => {
    const rb = request.payload
    const todosParams = rb.email && rb.password;

    //Verifica se todos os parâmetros necessários para criar conta foram inseridos
    if (!todosParams) {
        //Retorna uma mensagem a informar que os campos necessários não foram preenchidos
        return h
            .response({"message": "É necessário preencher todos os campos!"})
            .code(400)
    }
    try {
        //Autentica o utilizador
        const utilizadorValido = await authUser(rb.email, rb.password)
        //Se as informações fornecidas forem válidas gera um token e retorna o mesmo
        if(utilizadorValido){
           return h.response({ token: generateToken(rb.email) }).code(200)
        }else {
            //Se as informações fornecidas forem inválidas retorna uma mensagem a dizer que as Credenciais são inválidas
            return h.response({message: "Credenciais invalidas!"})
                .code(400)
        }
    }catch (e){
        //Se ocorrer um erro retorna a informação ao Utilizador a dizer que ocorreu um erro inesperado
        return h.response({message: "Erro inesperado!"})
            .code(500)
    }

}

//Retornar o saldo do Utilizador
exports.verificarSaldo = async (request, h) => {
    try {
        //Se o utilizador fornecer o token válido o servidor retorna o saldo deste mesmo Utilizador
        const email = request.auth.credentials.email
        const saldo = await getFunds(email)
        return h.response({ saldo }).code(200)
    }
    catch (error) {
        //Se ocorrer um erro retorna a informação ao Utilizador a dizer que ocorreu um erro inesperado
        return h.response({ mensagem: "Erro Inesperado" }).code(500)
    }
};

//Adicionar saldo a um Utilizador
exports.adicionarSaldo = async (request, h) => {
    try {
        const email = request.auth.credentials.email
        const { valorMovimento } = request.payload
        //Se as informações de saldo para adicionar não forem válidas retorna ao Utilizador que o movimento não é válido
        if (!valorMovimento || typeof valorMovimento!== "number") {
            return h.response({ mensagem: "Movimento Inválido!" }).code(422)
        }
        //Se as informações forem válidas adiciona o saldo ao Utilizador
        await updateFunds(email, valorMovimento)
        return h.response({ menagem: "Saldo Atualizado!" }).code(200)
    }
    catch (error) {
        //Se ocorrer um erro retorna a informação ao Utilizador a dizer que ocorreu um erro inesperado
        return h.response({ mensagem: "Erro Inesperado!" }).code(500)
    }
};

//Retirar saldo de um Utilizador
exports.retirarSaldo = async (request, h) => {
    try {
        const email = request.auth.credentials.email
        const { valorMovimento } = request.payload
        //Se as informações de saldo para retirar não forem válidas retorna ao Utilizador que o movimento não é válido
        if (!valorMovimento || typeof valorMovimento!== "number") {
            return h.response({ mensagem: "Movimento Inválido!" }).code(422)
        }
        //Se as informações forem válidas retira o saldo ao Utilizador
        await updateFunds(email, -valorMovimento)
        return h.response({ menagem: "Saldo Atualizado!" }).code(200)
    }
    catch (error) {
        //Se ocorrer um erro retorna a informação ao Utilizador a dizer que ocorreu um erro inesperado
        return h.response({ mensagem: "Erro Inesperado!" }).code(500)
    }
};