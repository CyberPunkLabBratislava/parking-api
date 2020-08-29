/*
SERVER configuration module
- Middlewares
- API
- Handling errors
*/

// Global settings and packages
const express = require("express"),
    server = express(),
    bodyParser = require("body-parser"),
    cors = require("cors"),
    helmet = require("helmet")

// Configure express to work with proxy and rate-limit
// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
server.set("trust proxy", 1)

// Load loggers
const logger = require("./utils/logger")

// Load API
const api = require("./api/routes")

// Middlewares
server.use(cors())
    .use(bodyParser.urlencoded({ extended: true, limit: "1mb" }))
    .use(helmet())

// API 
// If status code > 400, forwards to next middleware for handling
// @TODO set up IP rate-limiter for necessary endpoints (NGINX alternative)
server.use("/api/v1", api)

// error handler 
// @TODO Build in separate module

// Not found request response
server.use((req, res) => {
    logger.warn("URL not found " + req.originalUrl, "SERVER")
    res.status(404).send({ error: true, "url": req.originalUrl + " not found" })
})

// Export my server
module.exports = server