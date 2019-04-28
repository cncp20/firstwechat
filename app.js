var koa = require("koa");
var config = require("./config");
var signature = require("./utils/signature");
var { reply } = require("./wechat/reply");
var { initSchema, connect } = require("./database/init");
(async () => {
    await connect(config.db);
    initSchema();
    const {test} = require("./wechat/index")
    await test();
    var app = new koa();

    app.use(signature(config.wechat, reply));

    app.listen(8081);
    console.log("listen:8081");
})()
