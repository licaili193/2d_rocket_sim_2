if(!self.define){let e,s={};const r=(r,i)=>(r=new URL(r+".js",i).href,s[r]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=r,e.onload=s,document.head.appendChild(e)}else e=r,importScripts(r),s()})).then((()=>{let e=s[r];if(!e)throw new Error(`Module ${r} didn’t register its module`);return e})));self.define=(i,o)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let t={};const n=e=>r(e,c),d={module:{uri:c},exports:t,require:n};s[c]=Promise.all(i.map((e=>d[e]||n(e)))).then((e=>(o(...e),t)))}}define(["./workbox-2d118ab0"],(function(e){"use strict";e.setCacheNameDetails({prefix:"2d_rocket_sim_2"}),self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"/2d_rocket_sim_2/css/app.7c9653d1.css",revision:null},{url:"/2d_rocket_sim_2/css/chunk-vendors.37b220d9.css",revision:null},{url:"/2d_rocket_sim_2/index.html",revision:"18c3ccf405f02d9696c0d887765db13b"},{url:"/2d_rocket_sim_2/js/app.20ef5cae.js",revision:null},{url:"/2d_rocket_sim_2/manifest.json",revision:"83a268db7153b7c2b418dbf1535435ac"},{url:"/2d_rocket_sim_2/robots.txt",revision:"b6216d61c03e6ce0c9aea6ca7808f7ca"}],{})}));
//# sourceMappingURL=service-worker.js.map
