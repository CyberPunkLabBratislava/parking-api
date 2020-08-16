// Load third party packages
const stoppable = require('stoppable');
const dotenv = require('dotenv');

// Read Environmental Variables      
dotenv.config();

// Load server
const app = require('./src/server');

// Load loggers
const logger = require('./src/utils/logger');

// Load error handlers
const errorHandler = require('./src/utils/errorHandler');

/* WEB SERVER lifecycle
  Start server
  Connection manager wrapping to end connections gracefully
  Control kill signals
  Control HTTP server errors
*/
let server; // Initialize in higher scope
function startServer() {
    server = stoppable(app.listen(process.env.PORT, process.env.HOST, function () {
        // Server started
        logger.info('Webserver is ready in port: ' + process.env.PORT);
        bootstrap(); // Initialize everything else
    }), 3000);
    // Listening for HTTP server errors
    server.on('error', errorHandler.serverError);
}

// quit on ctrl-c when running docker in terminal
process.on('SIGINT', function onSigint() {
    logger.warn('Got SIGINT (aka ctrl-c in docker). Graceful shutdown ');
    shutdown();
})

// quit properly on docker stop
process.on('SIGTERM', function onSigterm() {
    logger.warn('Got SIGTERM (docker container stop). Graceful shutdown ');
    shutdown();
})

// gracefully shut down server
function shutdown() {
    server.stop(function onServerClosed(err) {
        if (err) {
            logger.error(err);
            process.exitCode = 1;
        }
        process.exit();
    }); //decorated by stoppable module to handle keep alives 
}
/*
END SERVER LIFECYCLE
*/

/*
Area to start services
*/
async function bootstrap() {
    try {
        logger.info("All services initialized");

    } catch (err) {
        logger.error("Service initialization halted due to errors, check previous logs for more info");
    }
}
/*
END AREA to start services
*/

// Start server
startServer();

// Export server module
module.exports = server;
