const Wechat = require("./../wechat-lib");
const config = require("./../config");
const mongoose = require("mongoose");
const Token = mongoose.model("Token");
const wechatConfig = {
    wechat: {
        appID: config.wechat.appID,
        appsecret: config.wechat.appsecret,
        token: config.wechat.token,
        getAccessToken: async () => {
            const res = await Token.getAccessToken();
            return res;
        },
        saveAccessToken: async (data) => {
            const res = await Token.saveAccessToken(data);
            return res;
        }
    }
}

exports.test = async () => {
    const client = new Wechat(wechatConfig.wechat);
    const data = await client.fecthAccessToken;
}

exports.getWechat = () => new Wechat(wechatConfig.wechat);