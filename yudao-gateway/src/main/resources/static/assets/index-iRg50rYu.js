import{bz as e}from"./index-BaY5TDP-.js";const r=async a=>await e.get({url:"/member/group/page",params:a}),t=async a=>await e.get({url:"/member/group/get?id="+a}),s=async a=>await e.post({url:"/member/group/create",data:a}),m=async()=>await e.get({url:"/member/group/list-all-simple"}),u=async a=>await e.put({url:"/member/group/update",data:a}),p=async a=>await e.delete({url:"/member/group/delete?id="+a});export{t as a,r as b,s as c,p as d,m as g,u};
