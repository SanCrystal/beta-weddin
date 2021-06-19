//controller error handler
module.exports.errorHandler = (err, option) => {
    if (err.name === "CastError") {
        return `user with id ${option} not found!`;
    } else if (err.code === 11000) {
        const errMsg = err.message.split(" ");
        return `${errMsg[errMsg.length - 3]} ${errMsg[errMsg.length - 2].slice(1,-1)} already exist!`
    } else if (err.errors) {
        console.log(err.errors)
        return `${err.errors[Object.keys(err.errors)].properties.message}`
    };

};