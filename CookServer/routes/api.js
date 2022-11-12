const express = require("express");

const api = express();

const userRouter = require("./api/user");
const contentRouter = require("./api/content");
const manageRouter = require("./api/manage");
const fileRouter = require("./api/files");

api.use("/user", userRouter);
api.use("/content", contentRouter);
api.use("/manage", manageRouter);
api.use("/file", fileRouter);

module.exports = api;