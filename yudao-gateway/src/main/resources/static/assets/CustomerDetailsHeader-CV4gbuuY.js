import{d as C,G as E,_ as y,o as i,c as d,I as T,j as l,k as t,w as a,t as r,aS as x,m as u,F as D,E as g,v as S,R as w}from"./index-BaY5TDP-.js";import{_ as j}from"./ContentWrap-DKQn7kZm.js";import{E as H,a as I}from"./el-descriptions-item-CRF_CO88.js";import{_ as P}from"./DictTag-QtcI9ZjC.js";import{f as R}from"./formatTime-Dr6TiYYc.js";import"./color-BN7ZL7BD.js";const U=C({name:"CrmCustomerDetailsHeader",__name:"CustomerDetailsHeader",props:{customer:{type:null,required:!0},loading:{type:Boolean,required:!0}},setup(o,{expose:m}){m();const e={get DICT_TYPE(){return E},get formatDate(){return R}};return Object.defineProperty(e,"__isScriptSetup",{enumerable:!1,value:!0}),e}}),q={class:"flex items-start justify-between"},L={class:"text-xl font-bold"},M=y(U,[["render",function(o,m,e,n,O,Y){const c=g,f=S,_=P,s=H,p=I,v=j,b=w;return i(),d(D,null,[T((i(),d("div",null,[l("div",q,[l("div",null,[t(f,null,{default:a(()=>[t(c,null,{default:a(()=>[l("span",L,r(e.customer.name),1)]),_:1})]),_:1})]),l("div",null,[x(o.$slots,"default")])])])),[[b,e.loading]]),t(v,{class:"mt-10px"},{default:a(()=>[t(p,{column:5,direction:"vertical"},{default:a(()=>[t(s,{label:"\u5BA2\u6237\u7EA7\u522B"},{default:a(()=>[t(_,{type:n.DICT_TYPE.CRM_CUSTOMER_LEVEL,value:e.customer.level},null,8,["type","value"])]),_:1}),t(s,{label:"\u6210\u4EA4\u72B6\u6001"},{default:a(()=>[u(r(e.customer.dealStatus?"\u5DF2\u6210\u4EA4":"\u672A\u6210\u4EA4"),1)]),_:1}),t(s,{label:"\u8D1F\u8D23\u4EBA"},{default:a(()=>[u(r(e.customer.ownerUserName),1)]),_:1}),t(s,{label:"\u521B\u5EFA\u65F6\u95F4"},{default:a(()=>[u(r(n.formatDate(e.customer.createTime)),1)]),_:1})]),_:1})]),_:1})],64)}],["__file","/Users/steven/00/500_code/520_github/yudao-ui-admin-vue3/src/views/crm/customer/detail/CustomerDetailsHeader.vue"]]);export{M as default};
