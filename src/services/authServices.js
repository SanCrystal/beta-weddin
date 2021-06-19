//require jwt
const jwt = require('jsonwebtoken');
//require bcrypt 
const bcrypt = require('bcrypt');
// require path
const path = require('path');
//requre env
require('dotenv').config({ path: path.dirname(__dirname).split(path.sep).slice(0, -1).join('/') + '/.env' });


//encrypts data parsed

module.exports.encrypt = async(data) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(data, salt);
    return hash;

};

//validate password
module.exports.decrypt = async(unencrpted, encrpted) => {
    const result = await bcrypt.compare(unencrpted, encrpted)
    return result;
};

//generate jwt token
//with default time set to 3 days
module.exports.genToken = async(payload, validTime = 3 * 24 * 60 * 60) => {
    return await jwt.sign({ payload }, process.env.SECRET, {
        expiresIn: validTime
    });

};
//decode token
module.exports.decodeToken = async(token) => {
    return await jwt.verify(token, process.env.SECRET);

};