const mongoose = require("mongoose");
const glob = require("glob");
const { resolve } = require("path")
mongoose.Promise = global.Promise;
exports.initSchema = () => {
    glob.sync(resolve(__dirname, "./schema", "**/*.js")).forEach(require)
}
exports.connect = (db) => {
    return new Promise((resolve) => {
        mongoose.connect(db, { useNewUrlParser: true });
        mongoose.connection.on("error", err => {
            console.log(err);
        })
        mongoose.connection.on("disconnect", () => {
            console.log("disconnect");
        })
        mongoose.connection.on("open", () => {
            resolve();
            console.log("mongodb connect");
        })
    })
}