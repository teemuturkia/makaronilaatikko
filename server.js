const settings = require('./settings.js'),
    fetch = require('node-fetch'),
    cheerio = require('cheerio'),
    regex = new RegExp(settings.search, 'i');

const notify = (message) => {
    const body = {
        content: message,
        external_user_name: 'Makaroni-Mario'
    };

    const notifyUrl = 'https://api.flowdock.com/v1/messages/chat/' + settings.token;
    console.log('posting...');
    console.log('body:', body);
    console.log('url:', notifyUrl);
    fetch(notifyUrl, {
        method: 'post',
        body:    JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    });
};

const search = (html, url) => {
    const match = regex.test(html);
    if (match) {
        const message = settings.search + ' bongattu! Katso: ' + url;
        notify(message);
    }
};

const parseRestaurantContent = (restaurantUrl) => {
    var completeUrl = settings.baseUrl + restaurantUrl;
    fetch(completeUrl)
        .then(res => res.text())
        .then(html => {
            search(html, completeUrl);
        });
};

const parseRestaurantListHtml = (html) => {
    const $ = cheerio.load(html);
    const tags = $('.ravintolat a');
    let links = [];
    tags.each((i, tag) => links.push(tag.attribs.href));
    // Remove duplicates
    links = [...new Set(links)];
    links.forEach(parseRestaurantContent);
};

var url = settings.baseUrl + settings.location;
fetch(url)
    .then(res => res.text())
    .then(parseRestaurantListHtml);
