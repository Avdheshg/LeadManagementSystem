
class AppError extends Error
{
    constructor(message, statusCode)
    {
        super(message);

        console.log(`Inside AppError.js: statusCode: ${statusCode}`);
        
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
 
        Error.captureStackTrace(this, this.contructor);
    }
}

module.exports = AppError;
 
 






  







