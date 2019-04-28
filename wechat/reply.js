const { resolve } = require("path");
const axios = require("axios");
exports.reply = async (ctx, next) => {
    const message = ctx.weixin;
    let mp = require('./index');
    const client = mp.getWechat();
    if (message.MsgType === "event") {
        if (message.Event === "location_select") {
            ctx.body = `地理位置：${message.SendLocationInfo.Location_X}, ${message.SendLocationInfo.Location_Y}`
        }
        console.log(message);
    } else if (message.MsgType === "text") {
        let content = message.Content;
        if (content.indexOf("天气") > -1) {
            let city = content.split("天气")[0];
            let url = `http://apis.juhe.cn/simpleWeather/query?key=b4bcaa59edc44b59c0e8b6fa1ae1ece6&city=${encodeURIComponent(city)}`;
            let res = await axios.get(url);
            let data = res.data;
            if (data.error_code === 0) {
                let result = data.result.realtime;
                ctx.body = `${city}今天${result.info}，温度${result.temperature}℃，${result.direct}${parseInt(result.wid)}级，空气质量指数为${result.aqi}`;
            } else {
                ctx.body = data.reason;
            }
            return;
        }

        let reply = '';
        switch (content) {
            case '1':
                reply = "11111"
                break;
            case '2':
                reply = "22222"
                break;
            case '3':
                reply = "33333"
                break;
            case '4':
                let data = await client.handle('uploadMaterial', 'image', resolve(__dirname, '../2.jpg'))
                console.log(data);
                reply = {
                    type: "image",
                    mediaId: data.media_id
                }
                break;
            case '19':
                await client.handle('deleteMenu')
                let menu19 = {
                    "button":[
                    {    
                         "type":"click",
                         "name":"今日歌曲",
                         "key":"V1001_TODAY_MUSIC"
                     },
                     {
                          "name":"菜单",
                          "sub_button":[
                          {    
                              "type":"view",
                              "name":"搜索",
                              "url":"http://www.soso.com/"
                           },
                           {
                                "type":"miniprogram",
                                "name":"wxa",
                                "url":"http://mp.weixin.qq.com",
                                "appid":"wx286b93c14bbf93aa",
                                "pagepath":"pages/lunar/index"
                            },
                           {
                              "type":"click",
                              "name":"赞一下我们",
                              "key":"V1001_GOOD"
                           },{    
                            "type":"click",
                            "name":"今日" + Math.random(),
                            "key":"V1001_TODAY_MUSIC"
                        }]
                      }]
                }
                await client.handle('createMenu', menu19)

                reply = "添加菜单成功"
                break;
            case '20':
                await client.handle('deleteMenu')
                let menu20 = {
                    "button":[
                    {    
                         "type":"click",
                         "name":"今日歌曲",
                         "sub_button": [{
                            "name": "地理位置",
                            "type": "location_select",
                            "key": "location"
                         },
                         {
                            "type": "pic_weixin", 
                            "name": "微信相册发图", 
                            "key": "rselfmenu_1_2"
                        }]
                     },
                     {
                          "name":"菜单",
                          "sub_button":[
                          {    
                              "type":"view",
                              "name":"搜索",
                              "url":"http://www.soso.com/"
                           },
                           {
                                "type":"miniprogram",
                                "name":"wxa",
                                "url":"http://mp.weixin.qq.com",
                                "appid":"wx286b93c14bbf93aa",
                                "pagepath":"pages/lunar/index"
                            },
                           {
                              "type":"click",
                              "name":"赞一下我们",
                              "key":"V1001_GOOD"
                           },{    
                            "type":"click",
                            "name":"今日" + Math.random(),
                            "key":"V1001_TODAY_MUSIC"
                        }]
                      }]
                }
                await client.handle('createMenu', menu20)

                reply = "添加菜单成功"
                break;
            default:
                reply = content;
                break;
        }
        ctx.body = reply;
    }
    await next();
}