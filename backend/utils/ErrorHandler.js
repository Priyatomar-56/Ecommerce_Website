// Error is a default node class , from that we are inheriting Errorhander class
class ErrorHander extends Error { 
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);

    }
}
module.exports = ErrorHander;