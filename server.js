'use strict';

const fs = require ('fs');

const { jwt } = require("./config.js")
const { key, aud, iss, maxAgeSec } = jwt
const Jwt = require("@hapi/jwt");

const { validate } = require('./auth.js');

const Hapi = require('@hapi/hapi')
const userController =  require('./src/controllers/userController');

const init = async () => {
    try {

        //Define as definições do servidor
        const server = new Hapi.Server({
            port: 3000,
            host: 'localhost'
        });

        //Regista o servidor e define a estratégia de autenticação do mesmo
        await server.register(Jwt)
        server.auth.strategy("my_jwt_strategy", "jwt", {
            keys: key,
            verify: { aud, iss, sub: false, maxAgeSec },
            validate
        })

        //Define a rota para registar um novo Utilizador
        server.route({
            method: 'POST',
            path: '/subscribe',
            handler: userController.registarUtilizador
        });

        //Define a rota para Login
        server.route({
            method: 'POST',
            path: '/login',
            handler: userController.autenticar
        });

        //Define a rota para devolver os saldo do Utilizador que esteja logado
        server.route({
            method: 'GET',
            path: '/funds',
            options: {
                auth: "my_jwt_strategy"
            },
            handler: userController.verificarSaldo
        });

        //Define a rota para adicionar fundos à conta do Utilizador que esteja logado
        server.route({
            method: 'PUT',
            path: '/funds',
            options: {
                auth: "my_jwt_strategy"
            },
            handler: userController.adicionarSaldo
        });

        //Define a rota para retirar fundos à conta do Utilizador que esteja logado
        server.route({
            method: 'DELETE',
            path: '/funds',
            options: {
                auth: "my_jwt_strategy"
            },
            handler: userController.retirarSaldo
        });

        //Inicia o servisor
        await server.start();

        //Mostra as informações do servidor
        console.log(`Server running at: ${server.info.uri}`);
    } catch(e){
        console.log(e)
    }
};

//Objeto global que mantém um track e contém toda a informação do processo que está a ser executado
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

//Chama a função init()
init();