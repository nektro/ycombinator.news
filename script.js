//
"use strict";
//
import { create_element } from "https://rawgit.com/nektro/basalt/9d37651/src/create_element.js";
//
const json = (url) => Promise.resolve(url).then(a => fetch(a)).then(a => a.json());
const api = (endpoint) => json(`https://hacker-news.firebaseio.com/v0${endpoint}.json`);
const dcTN = (text) => document.createTextNode(text);

//
const links = document.querySelectorAll("a[data-href]");
const main = document.querySelector("main");

//
let active_page = null;

//
async function load_page(page) {
    return api(links[page].getAttribute("data-href"))
    .then(a => a.reduce((ac,cv) => {
        return ac.then(api(`/item/${cv}`).then(b => {
            const {id, title, url, score, by, time} = b;
            const el = create_post(id, title, url, score, by, time);
            main.appendChild(el);
        }));
    }, Promise.resolve()))
    .then(a => {
        console.log(a);
    });
}
function create_post(id, title, url, score, by, time) {
    return (create_element("div", new Map().set("class","post"), [
        create_post_top(id, title, url),
        create_element("div", undefined, [
            dcTN(`${score} points by `),
            create_element("a", new Map().set("data-href", `/user/${by}`), [dcTN(by)]),
            dcTN(" " + moment(new Date(time*1000)).fromNow())
        ])
    ]));
}
function create_post_top(id, title, url) {
    if (url !== undefined) {
        return create_element("div", undefined, [
            create_element("a", new Map().set("href", url), [dcTN(title)]),
            create_element("span", undefined, [
                dcTN("("),
                create_element("span", undefined, [dcTN(new URL(url).hostname)]),
                dcTN(")")
            ])
        ]);
    }
    else {
        return create_element("div", undefined, [
            create_element("a", new Map().set("data-href", `/item/${id}`), [dcTN(title)])
        ]);
    }
}

//
Promise.resolve()
.then(() => load_page(0));
