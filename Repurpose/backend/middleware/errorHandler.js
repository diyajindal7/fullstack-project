// backend/middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
    console.error(err); // log full error for debugging
  
    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';
  
    res.status(statusCode).json({
      status: 'error',
      message,
    });
  };
  
  module.exports = errorHandler;
  