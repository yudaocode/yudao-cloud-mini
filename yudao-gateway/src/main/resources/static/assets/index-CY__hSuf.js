import{bz as t}from"./index-BaY5TDP-.js";const e=async a=>await t.get({url:"/system/mail-template/page",params:a}),s=async a=>await t.get({url:"/system/mail-template/get?id="+a}),m=async a=>await t.post({url:"/system/mail-template/create",data:a}),l=async a=>await t.put({url:"/system/mail-template/update",data:a}),i=async a=>await t.delete({url:"/system/mail-template/delete?id="+a}),p=a=>t.post({url:"/system/mail-template/send-mail",data:a});export{e as a,m as c,i as d,s as g,p as s,l as u};
