import{_ as x}from"./ContentWrap-DKQn7kZm.js";import{d as C,r as I,G as T,e4 as g,_ as D,X as E,o as c,c as R,j as o,k as e,w as r,t as s,I as h,q as j,m as p,F as w,E as N,v as S,N as U}from"./index-BaY5TDP-.js";import{E as k,a as q}from"./el-descriptions-item-CRF_CO88.js";import{_ as H}from"./DictTag-QtcI9ZjC.js";import O from"./ProductForm-DmNzN2UP.js";import"./color-BN7ZL7BD.js";import"./Dialog-CZSXtzfQ.js";import"./index-D4G-Yxr7.js";import"./index-kC15peaN.js";import"./tree-z7HkrWVC.js";import"./index-CuAlllbQ.js";const Y={class:"flex items-start justify-between"},G={class:"text-xl font-bold"},M=D(C({__name:"ProductDetailsHeader",props:{product:{type:null,required:!0}},setup(d,{expose:a}){a();const t=I(),u={formRef:t,openForm:(i,n)=>{t.value.open(i,n)},ProductForm:O,get DICT_TYPE(){return T},get erpPriceInputFormatter(){return g}};return Object.defineProperty(u,"__isScriptSetup",{enumerable:!1,value:!0}),u}}),[["render",function(d,a,t,u,i,n){const m=N,f=S,_=U,l=k,v=H,P=q,b=x,y=E("hasPermi");return c(),R(w,null,[o("div",null,[o("div",Y,[o("div",null,[e(f,null,{default:r(()=>[e(m,null,{default:r(()=>[o("span",G,s(t.product.name),1)]),_:1})]),_:1})]),o("div",null,[h((c(),j(_,{onClick:a[0]||(a[0]=F=>u.openForm("update",t.product.id))},{default:r(()=>a[2]||(a[2]=[p(" \u7F16\u8F91 ")])),_:1})),[[y,["crm:product:update"]]])])])]),e(b,{class:"mt-10px"},{default:r(()=>[e(P,{column:5,direction:"vertical"},{default:r(()=>[e(l,{label:"\u4EA7\u54C1\u7C7B\u522B"},{default:r(()=>[p(s(t.product.categoryName),1)]),_:1}),e(l,{label:"\u4EA7\u54C1\u5355\u4F4D"},{default:r(()=>[e(v,{type:u.DICT_TYPE.CRM_PRODUCT_UNIT,value:t.product.unit},null,8,["type","value"])]),_:1}),e(l,{label:"\u4EA7\u54C1\u4EF7\u683C"},{default:r(()=>[p(s(u.erpPriceInputFormatter(t.product.price))+" \u5143 ",1)]),_:1}),e(l,{label:"\u4EA7\u54C1\u7F16\u7801"},{default:r(()=>[p(s(t.product.no),1)]),_:1})]),_:1})]),_:1}),e(u.ProductForm,{ref:"formRef",onSuccess:a[1]||(a[1]=F=>d.emit("refresh"))},null,512)],64)}],["__file","/Users/steven/00/500_code/520_github/yudao-ui-admin-vue3/src/views/crm/product/detail/ProductDetailsHeader.vue"]]);export{M as default};
