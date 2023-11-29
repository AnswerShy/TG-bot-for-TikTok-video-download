const fetch = require("node-fetch");
const {Headers} = require('node-fetch');
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');


const token = '6125394222:AAG1T73YkFtqL1uAc3mz47tQ17luYSocFLc';
const bot = new TelegramBot(token, {polling: true});

const headers = new Headers();
headers.append('User-Agent', 'TikTok 26.2.0 rv:262018 (iPhone; iOS 14.4.2; en_US) Cronet');

function getId(chatId, url) {
    if (url.match("/video/")) {
        var txt = String(url)
        var startIndex = txt.indexOf("/video/")
        let resultString = txt.substring(startIndex+7, startIndex+26)
        videoShare(chatId, resultString)
    }
    else { 
        redirect(chatId, url) 
    }
}

const redirect = async (chatId, url) => {
    if (url.match("vm.tiktok.com") || url.match("vt.tiktok.com")) {
        var newUrl = await fetch(url, {
            redirect: "follow"
        })
        url = newUrl.url
        getId(chatId, url)
    }
}

const videoShare = async (chatId, idOfVideo) => {
    const api_url = `https://api16-normal-c-useast1a.tiktokv.com/aweme/v1/feed/?aweme_id=${idOfVideo}`
    
    const request =  await fetch(api_url, {
        method: "GET",
        headers: headers
    })
    const body = await request.text()
    var resu = JSON.parse(body)
    urlMedia = resu.aweme_list[0].video.play_addr.url_list[0]

    console.log(urlMedia)

    bot.sendVideo(chatId, urlMedia)

    // const currVideo = await fetch(urlMedia)
    // const nameFile = 'downloaded.mp4'
    // console.log("downloading...")
    // const fileStream = fs.createWriteStream(nameFile);

    // currVideo.body.pipe(fileStream)

    // fileStream.on('finish', () => {
    //     console.log("sending...")
    //     bot.sendVideo(chatId, nameFile).then(() => {
    //         fs.unlinkSync(nameFile);
    //     })
    // })
}


bot.on("text", (msg) => {
    getId(msg.chat.id, msg.text)
})