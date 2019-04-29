var sha1 = require("sha1");
const getRawBody = require("raw-body");
const utils = require("./../utils");

module.exports = (config, reply) => {
    return async (ctx, next) => {
        let token = config.token;
        let { signature, nonce, timestamp, echostr } = ctx.query;
        var str = [token, timestamp, nonce].sort().join("");
        var sha = sha1(str);
        if (ctx.method === "GET") {
            if (sha === signature) {
                ctx.body = echostr
            } else {
                ctx.body = "wrong";
            }
        } else if (ctx.method === "POST") {
            if (sha !== signature) {
                ctx.body = "wrong";
                return;
            }
            const data = await getRawBody(ctx.req, {
                length: ctx.length,
                limit: "1mb",
                encoding: ctx.charset
            });
            const content = await utils.parseXML(data);
            const message = utils.formatMessage(content.xml);
            ctx.weixin = message;
            await reply.call(ctx, ctx, next);
            const replyBody = ctx.body;
            const xml = utils.tpl(replyBody, message);
            ctx.status = 200;
            ctx.type = "application/xml";
            ctx.body = xml;
        }
        next();
    }
}