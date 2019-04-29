var koa = require("koa");
var config = require("./config");
var signature = require("./utils/signature");
var views = require("koa-views");
var router  = require("./routers");
var { reply } = require("./wechat/reply");
var { initSchema, connect } = require("./database/init");
(async () => {
    await connect(config.db);
    initSchema();
    const {test} = require("./wechat/index")
    await test();
    var app = new koa();
    app.use(signature(config.wechat, reply));
    app.use(views('views',{map:{html:'ejs'}}));
    app.use(router.routes()).use(router.allowedMethods());

    app.listen(8081);
    console.log("listen:8081");
})()
