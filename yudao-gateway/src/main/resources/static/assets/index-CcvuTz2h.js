import{d as w,D as S,r as s,at as C,f as I,_ as N,X as x,o as U,c as z,k as l,w as o,m as u,I as b,q as V,F as D,L,O as A,z as j,E as F,A as k,N as M,B as O}from"./index-BaY5TDP-.js";import{_ as W}from"./index-avjYFQiD.js";import{_ as B}from"./ContentWrap-DKQn7kZm.js";import{_ as E}from"./index-BAz6Gqim.js";import Q from"./main-DuOfDTOL.js";import X from"./ImageTable-nzI7OPHM.js";import G from"./VoiceTable-Bxlh-N3v.js";import H from"./VideoTable-BuDGvP6r.js";import J from"./UploadFile-eZL5kn9T.js";import K from"./UploadVideo-BboMyeUX.js";import"./upload-PNt56tCi.js";import{g as R,d as Y}from"./index-Ci6jvA8Q.js";import{U as P}from"./useUpload-Dg-sFRn3.js";import"./index-DrSdAlug.js";import"./index-C1v7IUC9.js";import"./tagsView-lnAkwTv2.js";import"./main-BdArqmip.js";import"./formatTime-Dr6TiYYc.js";import"./main-DeQxN6ve.js";const Z=N(w({__name:"index",setup(v,{expose:a}){a();const c=S(),e=s(P.Image),y=s(!1),f=s([]),g=s(0),m=s(-1);C("accountId",m);const n=I({pageNo:1,pageSize:10,accountId:m,permanent:!0}),_=s(!1),p=async()=>{y.value=!0;try{const t=await R({...n,type:e.value});f.value=t.list,g.value=t.total}finally{y.value=!1}},r=()=>{n.pageNo=1,p()},d={message:c,type:e,loading:y,list:f,total:g,accountId:m,queryParams:n,showCreateVideo:_,onAccountChanged:t=>{m.value=t,n.accountId=t,n.pageNo=1,p()},getList:p,handleQuery:r,onTabChange:()=>{f.value=[],g.value=0,r()},handleDelete:async t=>{await c.confirm("\u6B64\u64CD\u4F5C\u5C06\u6C38\u4E45\u5220\u9664\u8BE5\u6587\u4EF6, \u662F\u5426\u7EE7\u7EED?"),await Y(t),c.alertSuccess("\u5220\u9664\u6210\u529F")},get WxAccountSelect(){return Q},ImageTable:X,VoiceTable:G,VideoTable:H,UploadFile:J,UploadVideo:K,get UploadType(){return P}};return Object.defineProperty(d,"__isScriptSetup",{enumerable:!1,value:!0}),d}}),[["render",function(v,a,c,e,y,f){const g=E,m=L,n=A,_=B,p=j,r=F,d=W,t=k,q=M,T=O,h=x("hasPermi");return U(),z(D,null,[l(g,{title:"\u516C\u4F17\u53F7\u7D20\u6750",url:"https://doc.iocoder.cn/mp/material/"}),l(_,null,{default:o(()=>[l(n,{class:"-mb-15px",inline:!0,"label-width":"68px"},{default:o(()=>[l(m,{label:"\u516C\u4F17\u53F7",prop:"accountId"},{default:o(()=>[l(e.WxAccountSelect,{onChange:e.onAccountChanged})]),_:1})]),_:1})]),_:1}),l(_,null,{default:o(()=>[l(T,{modelValue:e.type,"onUpdate:modelValue":a[8]||(a[8]=i=>e.type=i),onTabChange:e.onTabChange},{default:o(()=>[l(t,{name:e.UploadType.Image},{label:o(()=>[l(r,{align:"middle"},{default:o(()=>[l(p,{icon:"ep:picture"}),a[9]||(a[9]=u("\u56FE\u7247 "))]),_:1})]),default:o(()=>[b((U(),V(e.UploadFile,{type:e.UploadType.Image,onUploaded:e.getList},{default:o(()=>a[10]||(a[10]=[u(" \u652F\u6301 bmp/png/jpeg/jpg/gif \u683C\u5F0F\uFF0C\u5927\u5C0F\u4E0D\u8D85\u8FC7 2M ")])),_:1},8,["type"])),[[h,["mp:material:upload-permanent"]]]),l(e.ImageTable,{loading:e.loading,list:e.list,onDelete:e.handleDelete},null,8,["loading","list"]),l(d,{total:e.total,page:e.queryParams.pageNo,"onUpdate:page":a[0]||(a[0]=i=>e.queryParams.pageNo=i),limit:e.queryParams.pageSize,"onUpdate:limit":a[1]||(a[1]=i=>e.queryParams.pageSize=i),onPagination:e.getList},null,8,["total","page","limit"])]),_:1},8,["name"]),l(t,{name:e.UploadType.Voice},{label:o(()=>[l(r,{align:"middle"},{default:o(()=>[l(p,{icon:"ep:microphone"}),a[11]||(a[11]=u("\u8BED\u97F3 "))]),_:1})]),default:o(()=>[b((U(),V(e.UploadFile,{type:e.UploadType.Voice,onUploaded:e.getList},{default:o(()=>a[12]||(a[12]=[u(" \u683C\u5F0F\u652F\u6301 mp3/wma/wav/amr\uFF0C\u6587\u4EF6\u5927\u5C0F\u4E0D\u8D85\u8FC7 2M\uFF0C\u64AD\u653E\u957F\u5EA6\u4E0D\u8D85\u8FC7 60s ")])),_:1},8,["type"])),[[h,["mp:material:upload-permanent"]]]),l(e.VoiceTable,{list:e.list,loading:e.loading,onDelete:e.handleDelete},null,8,["list","loading"]),l(d,{total:e.total,page:e.queryParams.pageNo,"onUpdate:page":a[2]||(a[2]=i=>e.queryParams.pageNo=i),limit:e.queryParams.pageSize,"onUpdate:limit":a[3]||(a[3]=i=>e.queryParams.pageSize=i),onPagination:e.getList},null,8,["total","page","limit"])]),_:1},8,["name"]),l(t,{name:e.UploadType.Video},{label:o(()=>[l(r,{align:"middle"},{default:o(()=>[l(p,{icon:"ep:video-play"}),a[13]||(a[13]=u(" \u89C6\u9891 "))]),_:1})]),default:o(()=>[b((U(),V(q,{type:"primary",plain:"",onClick:a[4]||(a[4]=i=>e.showCreateVideo=!0)},{default:o(()=>a[14]||(a[14]=[u("\u65B0\u5EFA\u89C6\u9891")])),_:1})),[[h,["mp:material:upload-permanent"]]]),l(e.UploadVideo,{modelValue:e.showCreateVideo,"onUpdate:modelValue":a[5]||(a[5]=i=>e.showCreateVideo=i)},null,8,["modelValue"]),l(e.VideoTable,{list:e.list,loading:e.loading,onDelete:e.handleDelete},null,8,["list","loading"]),l(d,{total:e.total,page:e.queryParams.pageNo,"onUpdate:page":a[6]||(a[6]=i=>e.queryParams.pageNo=i),limit:e.queryParams.pageSize,"onUpdate:limit":a[7]||(a[7]=i=>e.queryParams.pageSize=i),onPagination:e.getList},null,8,["total","page","limit"])]),_:1},8,["name"])]),_:1},8,["modelValue"])]),_:1})],64)}],["__file","/Users/steven/00/500_code/520_github/yudao-ui-admin-vue3/src/views/mp/material/index.vue"]]);export{Z as default};
