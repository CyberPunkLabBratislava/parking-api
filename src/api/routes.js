const express = require("express"),
    router = express.Router()

// Controllers
const parsers = require("./controllers/parsers")
const actors = require("./controllers/actions")
const loggers = require("./controllers/loggers")

module.exports = router
    .get("", (req, res, next) => {
        res.send("Welcome to cyberlab server")
    })
    .get("/image", loggers.logRequest, actors.getLastImage)
    .get("/metadata", loggers.logRequest, actors.getLastMetadata)
    .post("/image", loggers.logRequest, parsers.parseBinaryImage, actors.storeImage)