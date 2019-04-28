const axios = require("axios")
const request = require("request-promise")
const fs = require("fs")
const base = "https://api.weixin.qq.com/cgi-bin/";

const api = {
    accessToken: base + "token?grant_type=client_credential",
    temporary: {
        upload: base + 'media/upload?',
        fetch: base + 'media/get?'
    },
    permanent: {
        upload: base + 'material/add_material?',
        uploadNews: base + 'material/add_news?',
        uploadNewsPic: base + 'media/uploadimg?',
        fetch: base + 'material/get_material?',
        del: base + 'material/del_material?',
        update: base + 'material/update_news?',
        count: base + 'material/get_materialcount?',
        batch: base + 'material/batchget_material?'
    },
    menu: {
        create: base + 'menu/create?',
        del: base + 'menu/delete?',
        custom: base + 'menu/addconditional?',
        fetch: base + 'menu/get?'
    }
}
module.exports = class Wechat {
    constructor(opts) {
        this.opts = Object.assign({}, opts);
        this.appID = opts.appID;
        this.appsecret = opts.appsecret;
        this.getAccessToken = opts.getAccessToken;
        this.saveAccessToken = opts.saveAccessToken;

        this.fecthAccessToken();
    }
    async fecthAccessToken() {
        let data;
        if (this.getAccessToken) {
            data = await this.getAccessToken();
        }
        if (!this.isValidate(data)) {
            console.log('get new token');
            data = await this.updateAccessToken();
            await this.saveAccessToken(data);
        }
        return data;
    }
    async updateAccessToken() {
        const url = `${api.accessToken}&appid=${this.appID}&secret=${this.appsecret}`;
        const res = await axios.get(url);
        let data = res.data;
        return data;
    }
    isValidate(data) {
        if (!data || !data.expires_in) {
            return false;
        }

        const expires_in = data.expires_in;
        const now = new Date().getTime();
        console.log(11, now, expires_in);
        if (now < expires_in) {
            return true;
        } else {
            return false;
        }
    }
    async request (options) {
        options = Object.assign({}, options, { json: true })
        try {
          const res = await request(options)
    
          return res
        } catch (err) {
          console.log(err)
        }
    }
    uploadMaterial(token, type, material, permanent = false) {
        let form = {};
        let url = api.temporary.upload;
        // 永久素材 form 是个 obj，继承外面传入的新对象
        if (permanent) {
            url = api.permanent.upload
            form = Object.assign(form, permanent)
        }
        if (type === "pic") {
            url = api.permanent.uploadNewsPic
        }
        if (type === "news") {
            url = api.permanent.uploadNews
            form = material
        } else {
            form.media = fs.createReadStream(material)
        }

        let uploadUrl = `${url}access_token=${token}`

        if (!permanent) {
            uploadUrl += `&type=${type}`
        } else {
            if (type !== 'news') {
                form.access_token = token
            }
        }

        const options = {
            method: 'POST',
            url: uploadUrl,
            json: true
        }

        if (type === 'news') {
            options.body = form
        } else {
            options.formData = form
        }
         return options;
    }

    // 封装用来请求接口的入口方法
    async handle(operation, ...args) {
        const tokenData = await this.fecthAccessToken();
        const options = this[operation](tokenData.access_token, ...args);
        const data = await this.request(options);
        return data;
    }

    // 添加菜单
    createMenu(token, menu) {
        const url = api.menu.create + "access_token=" + token;
        return {
            url,
            body: menu,
            method: "POST",
        }
    }
    // 删除菜单
    deleteMenu(token) {
        let url = api.menu.del +  "access_token=" + token;
        return {
            url
        }
    }
}