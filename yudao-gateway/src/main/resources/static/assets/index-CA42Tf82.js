import{bz as C,d as Q,D as R,r as m,f as k,C as L,G as S,U as M,_ as z,X as F,o as c,c as I,k as a,w as r,Y as b,F as U,n as K,q as h,m as g,I as T,j as O,t as q,Z as j,L as H,J as G,K as J,M as W,z as X,N as Z,O as B,P as $,Q as ee,R as ae}from"./index-BaY5TDP-.js";import{_ as le}from"./index-avjYFQiD.js";import{_ as te}from"./DictTag-QtcI9ZjC.js";import{_ as re}from"./ContentWrap-DKQn7kZm.js";import{_ as oe}from"./index-BAz6Gqim.js";import{d as se}from"./download-oWiM5xVU.js";import{f as ue}from"./formatTime-Dr6TiYYc.js";import ne from"./ApiAccessLogDetail-B4F9iNJB.js";import"./index-DrSdAlug.js";import"./color-BN7ZL7BD.js";import"./Dialog-CZSXtzfQ.js";import"./el-descriptions-item-CRF_CO88.js";const pe=z(Q({name:"InfraApiAccessLog",__name:"index",setup(E,{expose:t}){t();const w=R(),e=m(!0),P=m(0),x=m([]),p=k({pageNo:1,pageSize:10,userId:null,userType:null,applicationName:null,requestUrl:null,duration:null,resultCode:null,beginTime:[]}),n=m(),u=m(!1),f=async()=>{e.value=!0;try{const d=await(s=p,C.get({url:"/infra/api-access-log/page",params:s}));x.value=d.list,P.value=d.total}finally{e.value=!1}var s},y=()=>{p.pageNo=1,f()},_=m();L(()=>{f()});const i={message:w,loading:e,total:P,list:x,queryParams:p,queryFormRef:n,exportLoading:u,getList:f,handleQuery:y,resetQuery:()=>{n.value.resetFields(),y()},detailRef:_,openDetail:s=>{_.value.open(s)},handleExport:async()=>{try{await w.exportConfirm(),u.value=!0;const d=await(s=p,C.download({url:"/infra/api-access-log/export-excel",params:s}));se.excel(d,"API \u8BBF\u95EE\u65E5\u5FD7.xls")}catch{}finally{u.value=!1}var s},get DICT_TYPE(){return S},get getIntDictOptions(){return M},get formatDate(){return ue},ApiAccessLogDetail:ne};return Object.defineProperty(i,"__isScriptSetup",{enumerable:!1,value:!0}),i}}),[["render",function(E,t,w,e,P,x){const p=oe,n=j,u=H,f=G,y=J,_=W,i=X,s=Z,d=B,v=re,o=$,V=te,N=ee,Y=le,D=F("hasPermi"),A=ae;return c(),I(U,null,[a(p,{title:"\u7CFB\u7EDF\u65E5\u5FD7",url:"https://doc.iocoder.cn/system-log/"}),a(v,null,{default:r(()=>[a(d,{class:"-mb-15px",model:e.queryParams,ref:"queryFormRef",inline:!0,"label-width":"68px"},{default:r(()=>[a(u,{label:"\u7528\u6237\u7F16\u53F7",prop:"userId"},{default:r(()=>[a(n,{modelValue:e.queryParams.userId,"onUpdate:modelValue":t[0]||(t[0]=l=>e.queryParams.userId=l),placeholder:"\u8BF7\u8F93\u5165\u7528\u6237\u7F16\u53F7",clearable:"",onKeyup:b(e.handleQuery,["enter"]),class:"!w-240px"},null,8,["modelValue"])]),_:1}),a(u,{label:"\u7528\u6237\u7C7B\u578B",prop:"userType"},{default:r(()=>[a(y,{modelValue:e.queryParams.userType,"onUpdate:modelValue":t[1]||(t[1]=l=>e.queryParams.userType=l),placeholder:"\u8BF7\u9009\u62E9\u7528\u6237\u7C7B\u578B",clearable:"",class:"!w-240px"},{default:r(()=>[(c(!0),I(U,null,K(e.getIntDictOptions(e.DICT_TYPE.USER_TYPE),l=>(c(),h(f,{key:l.value,label:l.label,value:l.value},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1}),a(u,{label:"\u5E94\u7528\u540D",prop:"applicationName"},{default:r(()=>[a(n,{modelValue:e.queryParams.applicationName,"onUpdate:modelValue":t[2]||(t[2]=l=>e.queryParams.applicationName=l),placeholder:"\u8BF7\u8F93\u5165\u5E94\u7528\u540D",clearable:"",onKeyup:b(e.handleQuery,["enter"]),class:"!w-240px"},null,8,["modelValue"])]),_:1}),a(u,{label:"\u8BF7\u6C42\u65F6\u95F4",prop:"beginTime"},{default:r(()=>[a(_,{modelValue:e.queryParams.beginTime,"onUpdate:modelValue":t[3]||(t[3]=l=>e.queryParams.beginTime=l),"value-format":"YYYY-MM-DD HH:mm:ss",type:"daterange","start-placeholder":"\u5F00\u59CB\u65E5\u671F","end-placeholder":"\u7ED3\u675F\u65E5\u671F","default-time":[new Date("1 00:00:00"),new Date("1 23:59:59")],class:"!w-240px"},null,8,["modelValue","default-time"])]),_:1}),a(u,{label:"\u6267\u884C\u65F6\u957F",prop:"duration"},{default:r(()=>[a(n,{modelValue:e.queryParams.duration,"onUpdate:modelValue":t[4]||(t[4]=l=>e.queryParams.duration=l),placeholder:"\u8BF7\u8F93\u5165\u6267\u884C\u65F6\u957F",clearable:"",onKeyup:b(e.handleQuery,["enter"]),class:"!w-240px"},null,8,["modelValue"])]),_:1}),a(u,{label:"\u7ED3\u679C\u7801",prop:"resultCode"},{default:r(()=>[a(n,{modelValue:e.queryParams.resultCode,"onUpdate:modelValue":t[5]||(t[5]=l=>e.queryParams.resultCode=l),placeholder:"\u8BF7\u8F93\u5165\u7ED3\u679C\u7801",clearable:"",onKeyup:b(e.handleQuery,["enter"]),class:"!w-240px"},null,8,["modelValue"])]),_:1}),a(u,null,{default:r(()=>[a(s,{onClick:e.handleQuery},{default:r(()=>[a(i,{icon:"ep:search",class:"mr-5px"}),t[8]||(t[8]=g(" \u641C\u7D22"))]),_:1}),a(s,{onClick:e.resetQuery},{default:r(()=>[a(i,{icon:"ep:refresh",class:"mr-5px"}),t[9]||(t[9]=g(" \u91CD\u7F6E"))]),_:1}),T((c(),h(s,{type:"success",plain:"",onClick:e.handleExport,loading:e.exportLoading},{default:r(()=>[a(i,{icon:"ep:download",class:"mr-5px"}),t[10]||(t[10]=g(" \u5BFC\u51FA "))]),_:1},8,["loading"])),[[D,["infra:api-access-log:export"]]])]),_:1})]),_:1},8,["model"])]),_:1}),a(v,null,{default:r(()=>[T((c(),h(N,{data:e.list},{default:r(()=>[a(o,{label:"\u65E5\u5FD7\u7F16\u53F7",align:"center",prop:"id",width:"100",fix:"right"}),a(o,{label:"\u7528\u6237\u7F16\u53F7",align:"center",prop:"userId"}),a(o,{label:"\u7528\u6237\u7C7B\u578B",align:"center",prop:"userType"},{default:r(l=>[a(V,{type:e.DICT_TYPE.USER_TYPE,value:l.row.userType},null,8,["type","value"])]),_:1}),a(o,{label:"\u5E94\u7528\u540D",align:"center",prop:"applicationName",width:"150"}),a(o,{label:"\u8BF7\u6C42\u65B9\u6CD5",align:"center",prop:"requestMethod",width:"80"}),a(o,{label:"\u8BF7\u6C42\u5730\u5740",align:"center",prop:"requestUrl",width:"500"}),a(o,{label:"\u8BF7\u6C42\u65F6\u95F4",align:"center",prop:"beginTime",width:"180"},{default:r(l=>[O("span",null,q(e.formatDate(l.row.beginTime)),1)]),_:1}),a(o,{label:"\u6267\u884C\u65F6\u957F",align:"center",prop:"duration",width:"180"},{default:r(l=>[g(q(l.row.duration)+" ms ",1)]),_:1}),a(o,{label:"\u64CD\u4F5C\u7ED3\u679C",align:"center",prop:"status"},{default:r(l=>[g(q(l.row.resultCode===0?"\u6210\u529F":"\u5931\u8D25("+l.row.resultMsg+")"),1)]),_:1}),a(o,{label:"\u64CD\u4F5C\u6A21\u5757",align:"center",prop:"operateModule",width:"180"}),a(o,{label:"\u64CD\u4F5C\u540D",align:"center",prop:"operateName",width:"180"}),a(o,{label:"\u64CD\u4F5C\u7C7B\u578B",align:"center",prop:"operateType"},{default:r(l=>[a(V,{type:e.DICT_TYPE.INFRA_OPERATE_TYPE,value:l.row.operateType},null,8,["type","value"])]),_:1}),a(o,{label:"\u64CD\u4F5C",align:"center",fixed:"right",width:"60"},{default:r(l=>[T((c(),h(s,{link:"",type:"primary",onClick:ie=>e.openDetail(l.row)},{default:r(()=>t[11]||(t[11]=[g(" \u8BE6\u7EC6 ")])),_:2},1032,["onClick"])),[[D,["infra:api-access-log:query"]]])]),_:1})]),_:1},8,["data"])),[[A,e.loading]]),a(Y,{total:e.total,page:e.queryParams.pageNo,"onUpdate:page":t[6]||(t[6]=l=>e.queryParams.pageNo=l),limit:e.queryParams.pageSize,"onUpdate:limit":t[7]||(t[7]=l=>e.queryParams.pageSize=l),onPagination:e.getList},null,8,["total","page","limit"])]),_:1}),a(e.ApiAccessLogDetail,{ref:"detailRef"},null,512)],64)}],["__file","/Users/steven/00/500_code/520_github/yudao-ui-admin-vue3/src/views/infra/apiAccessLog/index.vue"]]);export{pe as default};
