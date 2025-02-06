
module.exports = ((err, req, res, next) => {

    console.log(err.stack);
    console.log(`** Inside ErrorController.js **`);
    
    console.log(`message: ${err.message}`);

    err.statusCode = err.statusCode || 500; 
    err.status = err.status || 'error'; 

    return res.status(err.statusCode).json({
        status: err.status,   
        message: err.message   
    })

});