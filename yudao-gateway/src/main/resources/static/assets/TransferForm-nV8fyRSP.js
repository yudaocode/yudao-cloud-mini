import{d as I,D as z,r as m,f as D,C as N,G as h,U as P,a as B,_ as k,o as u,q as p,w as s,k as t,m as n,I as F,c as E,F as V,n as S,t as A,ah as M,J as x,K as q,L as H,ak as j,al as Y,ai as G,cd as J,O as K,N as W,R as Q}from"./index-BaY5TDP-.js";import{_ as X}from"./Dialog-CZSXtzfQ.js";import{g as Z}from"./index-CuAlllbQ.js";import{t as $}from"./index-6-r4wYJE.js";import{a as ee}from"./index-C4zjco0X.js";import{t as ae}from"./index-DiJG1eDb.js";import{t as re}from"./index-h6ObHKtQ.js";import{t as se}from"./index-B97LdofC.js";import{B as o,P as le}from"./index-BlslFSYd.js";const te=k(I({name:"CrmTransferForm",__name:"TransferForm",props:{bizType:{type:Number,required:!0}},emits:["success"],setup(U,{expose:a,emit:b}){const e=U,w=z(),O=m(!1),_=m(""),c=m(!1),d=m([]),v=m(!1),i=m({}),C=D({newOwnerUserId:[{required:!0,message:"\u65B0\u8D1F\u8D23\u4EBA\u4E0D\u80FD\u4E3A\u7A7A",trigger:"blur"}],oldOwnerPermissionLevel:[{required:!0,message:"\u8001\u8D1F\u8D23\u4EBA\u52A0\u5165\u56E2\u961F\u540E\u7684\u6743\u9650\u7EA7\u522B\u4E0D\u80FD\u4E3A\u7A7A",trigger:"blur"}]}),f=m(),g=async l=>{O.value=!0,_.value=y(),r(),i.value.id=l};a({open:g});const T=b,R=async l=>{switch(e.bizType){case o.CRM_CLUE:return await ee(l);case o.CRM_CUSTOMER:return await re(l);case o.CRM_CONTACT:return await ae(l);case o.CRM_BUSINESS:return await $(l);case o.CRM_CONTRACT:return await se(l);default:throw w.error("\u3010\u8F6C\u79FB\u5931\u8D25\u3011\u6CA1\u6709\u8F6C\u79FB\u63A5\u53E3"),new Error("\u3010\u8F6C\u79FB\u5931\u8D25\u3011\u6CA1\u6709\u8F6C\u79FB\u63A5\u53E3")}},y=()=>{switch(e.bizType){case o.CRM_CLUE:return"\u7EBF\u7D22\u8F6C\u79FB";case o.CRM_CUSTOMER:return"\u5BA2\u6237\u8F6C\u79FB";case o.CRM_CONTACT:return"\u8054\u7CFB\u4EBA\u8F6C\u79FB";case o.CRM_BUSINESS:return"\u5546\u673A\u8F6C\u79FB";case o.CRM_CONTRACT:return"\u5408\u540C\u8F6C\u79FB";default:return"\u8F6C\u79FB"}},r=()=>{var l;(l=f.value)==null||l.resetFields(),i.value={}};N(async()=>{d.value=await Z()});const L={props:e,message:w,dialogVisible:O,dialogTitle:_,formLoading:c,userOptions:d,oldOwnerHandler:v,formData:i,formRules:C,formRef:f,open:g,handleOwnerChange:l=>{l||(i.value.oldOwnerPermissionLevel=void 0)},emit:T,submitForm:async()=>{if(f&&await f.value.validate()){c.value=!0;try{const l=i.value;await R(B(l)),w.success(_.value+"\u6210\u529F"),O.value=!1,T("success")}finally{c.value=!1}}},transfer:R,getDialogTitle:y,resetForm:r,get DICT_TYPE(){return h},get getIntDictOptions(){return P},get BizTypeEnum(){return o},get PermissionLevelEnum(){return le}};return Object.defineProperty(L,"__isScriptSetup",{enumerable:!1,value:!0}),L}}),[["render",function(U,a,b,e,w,O){const _=x,c=q,d=H,v=j,i=Y,C=G,f=J,g=K,T=W,R=X,y=Q;return u(),p(R,{modelValue:e.dialogVisible,"onUpdate:modelValue":a[5]||(a[5]=r=>e.dialogVisible=r),title:e.dialogTitle,width:"30%"},{footer:s(()=>[t(T,{disabled:e.formLoading,type:"primary",onClick:e.submitForm},{default:s(()=>a[11]||(a[11]=[n("\u786E \u5B9A")])),_:1},8,["disabled"]),t(T,{onClick:a[4]||(a[4]=r=>e.dialogVisible=!1)},{default:s(()=>a[12]||(a[12]=[n("\u53D6 \u6D88")])),_:1})]),default:s(()=>[F((u(),p(g,{ref:"formRef",model:e.formData,rules:e.formRules,"label-width":"150px"},{default:s(()=>[t(d,{label:"\u9009\u62E9\u65B0\u8D1F\u8D23\u4EBA",prop:"newOwnerUserId"},{default:s(()=>[t(c,{modelValue:e.formData.newOwnerUserId,"onUpdate:modelValue":a[0]||(a[0]=r=>e.formData.newOwnerUserId=r)},{default:s(()=>[(u(!0),E(V,null,S(e.userOptions,r=>(u(),p(_,{key:r.id,label:r.nickname,value:r.id},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1}),t(d,{label:"\u8001\u8D1F\u8D23\u4EBA"},{default:s(()=>[t(i,{modelValue:e.oldOwnerHandler,"onUpdate:modelValue":a[1]||(a[1]=r=>e.oldOwnerHandler=r),onChange:e.handleOwnerChange},{default:s(()=>[t(v,{value:!1,size:"large"},{default:s(()=>a[6]||(a[6]=[n("\u79FB\u9664")])),_:1}),t(v,{value:!0,size:"large"},{default:s(()=>a[7]||(a[7]=[n("\u52A0\u5165\u56E2\u961F")])),_:1})]),_:1},8,["modelValue"])]),_:1}),e.oldOwnerHandler?(u(),p(d,{key:0,label:"\u8001\u8D1F\u8D23\u4EBA\u6743\u9650\u7EA7\u522B",prop:"oldOwnerPermissionLevel"},{default:s(()=>[t(i,{modelValue:e.formData.oldOwnerPermissionLevel,"onUpdate:modelValue":a[2]||(a[2]=r=>e.formData.oldOwnerPermissionLevel=r)},{default:s(()=>[(u(!0),E(V,null,S(e.getIntDictOptions(e.DICT_TYPE.CRM_PERMISSION_LEVEL),r=>(u(),E(V,{key:r.value},[r.value!=e.PermissionLevelEnum.OWNER?(u(),p(v,{key:0,value:r.value},{default:s(()=>[n(A(r.label),1)]),_:2},1032,["value"])):M("",!0)],64))),128))]),_:1},8,["modelValue"])]),_:1})):M("",!0),b.bizType===e.BizTypeEnum.CRM_CUSTOMER?(u(),p(d,{key:1,label:"\u540C\u65F6\u8F6C\u79FB"},{default:s(()=>[t(f,{modelValue:e.formData.toBizTypes,"onUpdate:modelValue":a[3]||(a[3]=r=>e.formData.toBizTypes=r)},{default:s(()=>[t(C,{value:e.BizTypeEnum.CRM_CONTACT},{default:s(()=>a[8]||(a[8]=[n("\u8054\u7CFB\u4EBA")])),_:1},8,["value"]),t(C,{value:e.BizTypeEnum.CRM_BUSINESS},{default:s(()=>a[9]||(a[9]=[n("\u5546\u673A")])),_:1},8,["value"]),t(C,{value:e.BizTypeEnum.CRM_CONTRACT},{default:s(()=>a[10]||(a[10]=[n("\u5408\u540C")])),_:1},8,["value"])]),_:1},8,["modelValue"])]),_:1})):M("",!0)]),_:1},8,["model","rules"])),[[y,e.formLoading]])]),_:1},8,["modelValue","title"])}],["__file","/Users/steven/00/500_code/520_github/yudao-ui-admin-vue3/src/views/crm/permission/components/TransferForm.vue"]]);export{te as default};
