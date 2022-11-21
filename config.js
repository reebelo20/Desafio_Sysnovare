var crypto = require("crypto")

module.exports = {
    jwt: {
        key: "staticKey",
        aud: "urn:audience:test",
        iss: "urn:issuer:test",
        maxAgeSec: 14400
    }
    
}