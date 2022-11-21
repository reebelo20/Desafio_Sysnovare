const { jwt } = require("./config.js")
const { key, aud, iss, maxAgeSec } = jwt
const Jwt = require("@hapi/jwt");
const {checkEmail} = require("./src/models/userModel");


//Gera o json web token relativo a um email
exports.generateToken = (email) => Jwt.token.generate({ aud, iss, user: email }, { key }, { ttlSec: maxAgeSec })

//Valida o email
exports.validate = async (artifacts) => {
    const emailValido = await checkEmail(artifacts.decoded.payload.user)
    if (emailValido) {
        return ({ isValid: true, credentials: { email: artifacts.decoded.payload.user } })
    }
    return ({ isValid: false })
}