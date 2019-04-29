var koa = require("koa");
const Router = require("koa-router");
const router = new Router();
const axios = require("axios");

router.get("/outh", async ctx => {
    // let res = await axios.get('https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx3ce6367e9f840252&secret=b378aa928adc010dab03a9e118a7c43b&code=0218bvJ61VA1lL1HPSH61OqBJ618bvJK&grant_type=authorization_code');
    // let openid = res.data.openid;
    // let access_token = res.data.access_token;
    // console.log(res.data);
    let access_token = "21_F_BFVXtES6CAo7WdS8KGALNxZp7SPXabzTxeFxw1eLIR_ELZHxx0PAPfQXQcEhlMTU4zeIme9u428ouLlNnDKA";
    let openid = 'ofCD21NX_wrB-App10WftdRDZXUM';
    let url = `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`;
    let r = await axios.get(url);
    let data = r.data;
    console.log(data);
    await ctx.render('outh', {
        title: "info",
        nickname: data.nickname
    });
});

module.exports = router;