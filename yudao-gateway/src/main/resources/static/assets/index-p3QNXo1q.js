import{d as P,D as q,g as Q,r as g,f as R,C as S,_ as D,X as L,o as c,c as V,k as a,w as l,Y as I,m,I as h,q as C,F as j,Z as N,L as O,z as U,N as z,O as K,P as T,Q as X,R as Y}from"./index-BaY5TDP-.js";import{_ as Z}from"./ContentWrap-DKQn7kZm.js";import{_ as A}from"./index-BAz6Gqim.js";import{d as B}from"./formatTime-Dr6TiYYc.js";import{g as E,d as G}from"./index-kC15peaN.js";import H from"./ProductCategoryForm-BEBogA2q.js";import{h as J}from"./tree-z7HkrWVC.js";import"./Dialog-CZSXtzfQ.js";const M=D(P({name:"CrmProductCategory",__name:"index",setup(b,{expose:r}){r();const i=q(),{t:e}=Q(),p=g(!0),w=g([]),f=R({name:null}),y=g(),s=async()=>{p.value=!0;try{const o=await E(f);w.value=J(o,"id","parentId")}finally{p.value=!1}},n=()=>{s()},t=g();S(()=>{s()});const _={message:i,t:e,loading:p,list:w,queryParams:f,queryFormRef:y,getList:s,handleQuery:n,resetQuery:()=>{y.value.resetFields(),n()},formRef:t,openForm:(o,u)=>{t.value.open(o,u)},handleDelete:async o=>{try{await i.delConfirm(),await G(o),i.success(e("common.delSuccess")),await s()}catch{}},get dateFormatter(){return B},ProductCategoryForm:H};return Object.defineProperty(_,"__isScriptSetup",{enumerable:!1,value:!0}),_}}),[["render",function(b,r,i,e,p,w){const f=A,y=N,s=O,n=U,t=z,_=K,o=Z,u=T,k=X,x=L("hasPermi"),v=Y;return c(),V(j,null,[a(f,{title:"\u3010\u4EA7\u54C1\u3011\u4EA7\u54C1\u7BA1\u7406\u3001\u4EA7\u54C1\u5206\u7C7B",url:"https://doc.iocoder.cn/crm/product/"}),a(o,null,{default:l(()=>[a(_,{class:"-mb-15px",model:e.queryParams,ref:"queryFormRef",inline:!0,"label-width":"68px"},{default:l(()=>[a(s,{label:"\u540D\u79F0",prop:"name"},{default:l(()=>[a(y,{modelValue:e.queryParams.name,"onUpdate:modelValue":r[0]||(r[0]=d=>e.queryParams.name=d),placeholder:"\u8BF7\u8F93\u5165\u540D\u79F0",clearable:"",onKeyup:I(e.handleQuery,["enter"]),class:"!w-240px"},null,8,["modelValue"])]),_:1}),a(s,null,{default:l(()=>[a(t,{onClick:e.handleQuery},{default:l(()=>[a(n,{icon:"ep:search",class:"mr-5px"}),r[2]||(r[2]=m(" \u641C\u7D22"))]),_:1}),a(t,{onClick:e.resetQuery},{default:l(()=>[a(n,{icon:"ep:refresh",class:"mr-5px"}),r[3]||(r[3]=m(" \u91CD\u7F6E"))]),_:1}),h((c(),C(t,{type:"primary",plain:"",onClick:r[1]||(r[1]=d=>e.openForm("create"))},{default:l(()=>[a(n,{icon:"ep:plus",class:"mr-5px"}),r[4]||(r[4]=m(" \u65B0\u589E "))]),_:1})),[[x,["crm:product-category:create"]]])]),_:1})]),_:1},8,["model"])]),_:1}),a(o,null,{default:l(()=>[h((c(),C(k,{data:e.list,"row-key":"id","default-expand-all":""},{default:l(()=>[a(u,{label:"\u5206\u7C7B\u7F16\u53F7",align:"center",prop:"id"}),a(u,{label:"\u5206\u7C7B\u540D\u79F0",align:"center",prop:"name"}),a(u,{label:"\u521B\u5EFA\u65F6\u95F4",align:"center",prop:"createTime",formatter:e.dateFormatter,width:"180px"},null,8,["formatter"]),a(u,{label:"\u64CD\u4F5C",align:"center"},{default:l(d=>[h((c(),C(t,{link:"",type:"primary",onClick:F=>e.openForm("update",d.row.id)},{default:l(()=>r[5]||(r[5]=[m(" \u7F16\u8F91 ")])),_:2},1032,["onClick"])),[[x,["crm:product-category:update"]]]),h((c(),C(t,{link:"",type:"danger",onClick:F=>e.handleDelete(d.row.id)},{default:l(()=>r[6]||(r[6]=[m(" \u5220\u9664 ")])),_:2},1032,["onClick"])),[[x,["crm:product-category:delete"]]])]),_:1})]),_:1},8,["data"])),[[v,e.loading]])]),_:1}),a(e.ProductCategoryForm,{ref:"formRef",onSuccess:e.getList},null,512)],64)}],["__file","/Users/steven/00/500_code/520_github/yudao-ui-admin-vue3/src/views/crm/product/category/index.vue"]]);export{M as default};
