import{bz as t}from"./index-BaY5TDP-.js";const e=a=>t.post({url:"/mp/tag/create",data:a}),p=a=>t.put({url:"/mp/tag/update",data:a}),s=a=>t.delete({url:"/mp/tag/delete?id="+a}),g=a=>t.get({url:"/mp/tag/get?id="+a}),l=a=>t.get({url:"/mp/tag/page",params:a}),r=()=>t.get({url:"/mp/tag/list-all-simple"}),m=a=>t.post({url:"/mp/tag/sync?accountId="+a});export{l as a,r as b,e as c,s as d,g,m as s,p as u};
