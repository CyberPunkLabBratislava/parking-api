/* Module containing error handlers */
const myErrors = {}

// Load configuration
const port = process.env.PORT

// Load loggers
const logger = require("./logger")

/**
 * Event listener for HTTP server "error" event.
 */
myErrors.serverError = function (error) {
    if (error.syscall !== "listen") {
        throw error
    }

    const bind = typeof port === "string"
        ? "Pipe " + port
        : "Port " + port

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            logger.error(bind + " requires elevated privileges")
            process.exit(1)
            break
        case "EADDRINUSE":
            logger.error(bind + " is already in use")
            process.exit(1)
            break
        default:
            throw error
    }
}

// Make functions public
module.exports = myErrors
