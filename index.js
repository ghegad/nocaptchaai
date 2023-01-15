import request from 'request';
import axios from 'axios';
import puppeteer from 'puppeteer';

class nocaptchaai {
    sitekey = null;
    host = null;
    apikey = null;
    c_req = null;
    hsw = null;
    cookie = null;
    page = null;

    sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    randomFromRange(start, end) {
        return Math.round(Math.random() * (end - start) + start);
    }

    getMouseMovements(timestamp) {
        let lastMovement = timestamp;
        const motionCount = this.randomFromRange(1000, 10000);
        const mouseMovements = [];
        for (let i = 0; i < motionCount; i++) {
            lastMovement += this.randomFromRange(0, 10);
            mouseMovements.push([this.randomFromRange(0, 500), this.randomFromRange(0, 500), lastMovement]);
        }
        return mouseMovements;
    }
    async hsw_slove(req) {

        const code = `
    
                ${this.hsw}
    
                hsw('${req}');
                `;

        var resp = await this.page.evaluate(code);
        return resp;
    }


    constructor(host, sitekey, api) {
        this.apikey = api;
        this.sitekey = sitekey;
        this.host = host;
        this.get_hsw();
    }

    async checksiteconfig() {
        let options = {
            url: "https://hcaptcha.com/checksiteconfig?v=48ebaaf&host=" + this.host + "&sitekey=" + this.sitekey + "&sc=1&swa=1",
            method: "POST",
            gzip: true,
            headers: {
                'Host': 'hcaptcha.com',
                'Content-Length': '0',
                'Sec-Ch-Ua': '"Not?A_Brand";v="8", "Chromium";v="108"',
                'Accept': 'application/json',
                'Content-Type': 'text/plain; charset=utf-8',
                'Sec-Ch-Ua-Mobile': '?0',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.125 Safari/537.36',
                'Sec-Ch-Ua-Platform': '"Windows"',
                'Origin': 'https://newassets.hcaptcha.com',
                'Sec-Fetch-Site': 'same-site',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Referer': 'https://newassets.hcaptcha.com/',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7'
            }
        }
        let checksiteconfig = null;
        await request(options, function (error, response, body) {
            checksiteconfig = JSON.parse(body);
        });
        while (checksiteconfig == null) {
            await this.sleep(10);
        }
        this.c_req = checksiteconfig.c;
        return (checksiteconfig);
    }

    async get_hsw() {
        let hsw_get = null;
        let options = {
            url: "https://newassets.hcaptcha.com/c/2027f8c/hsw.js",
            method: "GET",
            gzip: true,
            headers: {
                'Host': 'newassets.hcaptcha.com',
                'Sec-Ch-Ua': '"Not?A_Brand";v="8", "Chromium";v="108"',
                'Sec-Ch-Ua-Mobile': '?0',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.125 Safari/537.36',
                'Sec-Ch-Ua-Platform': '"Windows"',
                'Accept': '*/*',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Mode': 'no-cors',
                'Sec-Fetch-Dest': 'script',
                'Referer': 'https://newassets.hcaptcha.com/captcha/v1/48ebaaf/static/hcaptcha.html',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
                'Content-Type': 'application/json'
            }
        }
        await request(options, async function (error, response, body) {
            hsw_get = body;
        });
        while (hsw_get == null) {
            await this.sleep(10);
        }
        this.hsw = hsw_get;
    }

    async getcaptcha(hsw_result) {
        let timestamp = Date.now() + this.randomFromRange(30, 120);
        let options = {
            url: "https://hcaptcha.com/getcaptcha/" + this.sitekey,
            method: "POST",
            gzip: true,
            json: true,
            rejectUnauthorized: false,
            form: {
                v: '48ebaaf',
                sitekey: this.sitekey,
                host: this.host,
                hl: "en",
                n: hsw_result,
                c: JSON.stringify(this.c_req),
                motionData: JSON.stringify({
                    st: timestamp,
                    dct: timestamp,
                    mm: this.getMouseMovements(timestamp)
                })
            },
            headers: {
                'Host': 'hcaptcha.com',
                'Sec-Ch-Ua': '"Not?A_Brand";v="8", "Chromium";v="108"',
                'Accept': 'application/json',
                'Content-Type': 'text/plain; charset=utf-8',
                'Sec-Ch-Ua-Mobile': '?0',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.125 Safari/537.36',
                'Sec-Ch-Ua-Platform': '"Windows"',
                'Origin': 'https://newassets.hcaptcha.com',
                'Sec-Fetch-Site': 'same-site',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Referer': 'https://newassets.hcaptcha.com/',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7'
            }
        }
        let getcaptcha = null;
        let cookie_get = null;

        await request(options, function (error, response, body) {
            try {
                cookie_get = response.headers['set-cookie'][0].split(';')[0];
            } catch { } getcaptcha = body;
        });
        while (getcaptcha == null) {
            await this.sleep(10);
        }
        if (cookie_get == null) {
            return await this.getcaptcha(hsw_result);
        }
        this.cookie = cookie_get;
        this.c_req = getcaptcha.c;
        return getcaptcha;
    }

    async get_img(captcha) {
        let base64_json = {
            images: {
            },
            target: captcha.requester_question.en,
            method: "hcaptcha_base64",
            sitekey: this.sitekey,
            site: this.host,
        };
        for (var i = 0; i <= captcha.tasklist.length - 1; i++) {
            var img = null;
            let options = {
                url: captcha.tasklist[i].datapoint_uri,
                method: "GET",
                gzip: true,
                encoding: null,
                headers: {
                    'Host': 'imgs.hcaptcha.com',
                    'Sec-Ch-Ua': '"Not?A_Brand";v="8", "Chromium";v="108"',
                    'Sec-Ch-Ua-Mobile': '?0',
                    'Sec-Ch-Ua-Platform': '"Windows"',
                    'Upgrade-Insecure-Requests': '1',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.125 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                    'Sec-Fetch-Site': 'none',
                    'Sec-Fetch-Mode': 'no-cors',
                    'Sec-Fetch-Dest': 'document',
                    'Sec-Fetch-User': '?1',
                    'Referer': 'https://' + this.host,
                    'Accept-Encoding': 'gzip, deflate',
                    'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
                    'Content-Type': 'image/jpeg'
                }
            }
            await request(options, async function (error, response, body) {
                img = body.toString('base64');
            });
            while (img == null) {
                await this.sleep(10);
            }
            base64_json.images[i] = img;
        }
        return base64_json;
    }

    async slove_img(base64_json) {
        let res = await axios({
            method: "post",
            url: "https://pro.nocaptchaai.com/solve",
            headers: {
                "Content-type": "application/json",
                apikey: this.apikey,
            },
            data: base64_json,
        });
        return res;
    }

    async try_slove(res, getcaptcha) {
        let options = {
            url: "https://hcaptcha.com/checkcaptcha/" + this.sitekey + "/" + getcaptcha.key,
            method: "OPTIONS",
            gzip: true,
            json: true,
            rejectUnauthorized: false,
            headers: {
                'Host': 'hcaptcha.com',
                'Accept': '*/*',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'content-type',
                'Origin': 'https://newassets.hcaptcha.com',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.125 Safari/537.36',
                'Sec-Fetch-Site': 'same-site',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Referer': 'https://newassets.hcaptcha.com/',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
            }
        }

        var wait = null;
        await request(options, async function (error, response, body) {
            wait = true;
        });
        while (wait == null)
            await this.sleep(10);



        let timestamp = Date.now() + this.randomFromRange(30, 120);
        options = {
            url: "https://hcaptcha.com/checkcaptcha/" + this.sitekey + "/" + getcaptcha.key,
            method: "POST",
            gzip: true,
            json: true,
            rejectUnauthorized: false,
            json: {
                v: '48ebaaf',
                job_mode: "image_label_binary",
                answers:
                {

                },
                serverdomain: this.host,
                sitekey: this.sitekey,
                n: await this.hsw_slove(this.c_req.req),
                c: JSON.stringify(this.c_req),
                motionData: JSON.stringify({
                    st: timestamp,
                    dct: timestamp,
                    mm: this.getMouseMovements(timestamp)
                })
            },
            headers: {
                'Host': 'hcaptcha.com',
                'Cookie': this.cookie,
                'Sec-Ch-Ua': '"Not?A_Brand";v="8", "Chromium";v="108"',
                'Sec-Ch-Ua-Platform': '"Windows"',
                'Sec-Ch-Ua-Mobile': '?0',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.125 Safari/537.36',
                'Content-Type': 'application/json;charset=UTF-8',
                'Accept': '*/*',
                'Origin': 'https://newassets.hcaptcha.com',
                'Sec-Fetch-Site': 'same-site',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Referer': 'https://newassets.hcaptcha.com/',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7'
            }
        }
        for (var i = 0; i <= getcaptcha.tasklist.length - 1; i++) {
            if (res.data.solution.includes(i))
                options.json.answers[getcaptcha.tasklist[i].task_key] = "true";
            else
                options.json.answers[getcaptcha.tasklist[i].task_key] = "false";
        }


        let gethcap = null;
        await request(options, function (error, response, body) {
            gethcap = body;
        });
        while (gethcap == null) {
            await this.sleep(100);
        }
        if (typeof (gethcap.generated_pass_UUID) != "undefined")
            this.c_req = gethcap.c;
        return gethcap.generated_pass_UUID;
    }

    async slove() {

        const browser = await puppeteer.launch();

        this.page = await browser.newPage();

        await this.checksiteconfig();

        var hcaptcha_uuid = null;


        var hsw_result = await this.hsw_slove(this.c_req.req)
        var captcha = await this.getcaptcha(hsw_result);

        var nocaptchaai_request = await this.get_img(captcha);

        var res = await this.slove_img(nocaptchaai_request);

        hcaptcha_uuid = await this.try_slove(res, captcha);

        if (typeof (hcaptcha_uuid) == "undefined") {
            hcaptcha_uuid = "error";
        }

        await browser.close();
        return hcaptcha_uuid
    }

    async test(key,hcaptcha)
    {
        let options = {
            url: "https://hcaptcha.com/siteverify",
            method: "POST",
            gzip: true,
            json: true,
            rejectUnauthorized: false,
            body:"response="+hcaptcha+"&secret="+key,
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        let resualt = null;
        await request(options, function (error, response, body) {
            resualt = body;
        });
        while (resualt == null) {
            await this.sleep(100);
        }
        return resualt;
    }

}

async function main() {
    var hcaptcha = new nocaptchaai('fares.ghegad.com', 'de83f4cb-f9f0-4121-a296-df22dec584d3', 'fghegad-d9e9c1c6-4475-151f-c564-c85365a5ac35');

    var db=Date.now();
    var captcha = await hcaptcha.slove();
    var de=Date.now();
    console.log(captcha);
    console.log(de-db);
    console.log(await hcaptcha.test("0x3f31Fcbe04C2c8dFaC5b5F94f553B7875dc80C96",captcha))
}

main();