const errorHandler = (err, req, res, next) => {
    //Show the error details so the developer can debug the problem.
    console.error(err.stack);

    // If the ID is invalid, send a clear error message and stop.
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: "Invalid ID format"
        })
    }

    //If a different status code has already been set, use it.Otherwise, use 500.
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode).json({
        success: false,
        message: err.message
    })

}

export default errorHandler;