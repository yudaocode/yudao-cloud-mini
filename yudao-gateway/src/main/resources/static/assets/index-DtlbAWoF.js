import{d as D,S as w,r as c,u as P,C as b,a as y,D as x,_ as R,c as C,k as a,w as n,F as j,v as I,o as L,A as O,B as S}from"./index-BaY5TDP-.js";import{g as h,_ as z}from"./index-fxekK-Kb.js";import{u as B}from"./tagsView-lnAkwTv2.js";import{a as H}from"./index-D4G-Yxr7.js";import T from"./ProductDetailsHeader-BFr5SZRW.js";import U from"./ProductDetailsInfo-BYWEN8aa.js";import{B as V}from"./index-BlslFSYd.js";import"./el-timeline-item-BFYwlQ-d.js";import"./formatTime-Dr6TiYYc.js";import"./ContentWrap-DKQn7kZm.js";import"./el-descriptions-item-CRF_CO88.js";import"./DictTag-QtcI9ZjC.js";import"./color-BN7ZL7BD.js";import"./ProductForm-DmNzN2UP.js";import"./Dialog-CZSXtzfQ.js";import"./index-kC15peaN.js";import"./tree-z7HkrWVC.js";import"./index-CuAlllbQ.js";const k=R(D({name:"CrmProductDetail",__name:"index",setup(_,{expose:r}){r();const p=w(),t=x(),i=p.params.id,u=c(!0),e=c({}),l=async o=>{u.value=!0;try{e.value=await H(o),await d(o)}finally{u.value=!1}},s=c([]),d=async o=>{if(!o)return;const v=await h({bizType:V.CRM_PRODUCT,bizId:o});s.value=v.list},{delView:m}=B(),{currentRoute:f}=P();b(async()=>{if(!i)return t.warning("\u53C2\u6570\u9519\u8BEF\uFF0C\u4EA7\u54C1\u4E0D\u80FD\u4E3A\u7A7A\uFF01"),void m(y(f));await l(i)});const g={route:p,message:t,id:i,loading:u,product:e,getProductData:l,logList:s,getOperateLog:d,delView:m,currentRoute:f,ProductDetailsHeader:T,ProductDetailsInfo:U};return Object.defineProperty(g,"__isScriptSetup",{enumerable:!1,value:!0}),g}}),[["render",function(_,r,p,t,i,u){const e=O,l=z,s=S,d=I;return L(),C(j,null,[a(t.ProductDetailsHeader,{loading:t.loading,product:t.product,onRefresh:r[0]||(r[0]=m=>t.getProductData(t.id))},null,8,["loading","product"]),a(d,null,{default:n(()=>[a(s,null,{default:n(()=>[a(e,{label:"\u8BE6\u7EC6\u8D44\u6599"},{default:n(()=>[a(t.ProductDetailsInfo,{product:t.product},null,8,["product"])]),_:1}),a(e,{label:"\u64CD\u4F5C\u65E5\u5FD7"},{default:n(()=>[a(l,{"log-list":t.logList},null,8,["log-list"])]),_:1})]),_:1})]),_:1})],64)}],["__file","/Users/steven/00/500_code/520_github/yudao-ui-admin-vue3/src/views/crm/product/detail/index.vue"]]);export{k as default};
