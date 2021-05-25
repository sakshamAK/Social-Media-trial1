const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
    //get token from header
    const token = req.header('x-auth-token');

    if (!token) return res.status(401).json({ msg: "Token not found: Authentication denied" }); //check token is there or not

    //check token's validity
    try {
        const decode = jwt.verify(token, config.get('jwtSecret'));  //decode token by taking in the token iteself and the secret key
        req.user = decode.user;    // request user object and assign it a value to the decoded value with user as payload (ID)
        next();
    }
    catch (err) {
        res.status(401).json({ msg: "Token is not valid" });
    }
}