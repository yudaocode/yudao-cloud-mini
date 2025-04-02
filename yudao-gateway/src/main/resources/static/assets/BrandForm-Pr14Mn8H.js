import{d as F,g as E,D as L,r as i,f as O,G as S,U as h,_ as C,o as _,q as V,w as o,k as s,m as D,I as k,c as B,F as x,n as I,t as R,Z as q,L as N,co as P,cf as A,ak as j,al as M,O as Y,N as G,R as Z}from"./index-BaY5TDP-.js";import{_ as z}from"./Dialog-CZSXtzfQ.js";import{C as T}from"./constants-CEEr2azc.js";import{a as H,c as J,u as K}from"./brand-CpGCeCT3.js";const Q=C(F({name:"ProductBrandForm",__name:"BrandForm",emits:["success"],setup(w,{expose:l,emit:U}){const{t:e}=E(),c=L(),f=i(!1),m=i(""),r=i(!1),d=i(""),t=i({id:void 0,name:"",picUrl:"",status:T.ENABLE,description:""}),b=O({name:[{required:!0,message:"\u54C1\u724C\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A",trigger:"blur"}],picUrl:[{required:!0,message:"\u54C1\u724C\u56FE\u7247\u4E0D\u80FD\u4E3A\u7A7A",trigger:"blur"}],sort:[{required:!0,message:"\u54C1\u724C\u6392\u5E8F\u4E0D\u80FD\u4E3A\u7A7A",trigger:"blur"}]}),u=i(),p=async(a,y)=>{if(f.value=!0,m.value=e("action."+a),d.value=a,g(),y){r.value=!0;try{t.value=await H(y)}finally{r.value=!1}}};l({open:p});const n=U,g=()=>{var a;t.value={id:void 0,name:"",picUrl:"",status:T.ENABLE,description:""},(a=u.value)==null||a.resetFields()},v={t:e,message:c,dialogVisible:f,dialogTitle:m,formLoading:r,formType:d,formData:t,formRules:b,formRef:u,open:p,emit:n,submitForm:async()=>{if(u&&await u.value.validate()){r.value=!0;try{const a=t.value;d.value==="create"?(await J(a),c.success(e("common.createSuccess"))):(await K(a),c.success(e("common.updateSuccess"))),f.value=!1,n("success")}finally{r.value=!1}}},resetForm:g,get DICT_TYPE(){return S},get getIntDictOptions(){return h}};return Object.defineProperty(v,"__isScriptSetup",{enumerable:!1,value:!0}),v}}),[["render",function(w,l,U,e,c,f){const m=q,r=N,d=P,t=A,b=j,u=M,p=Y,n=G,g=z,v=Z;return _(),V(g,{title:e.dialogTitle,modelValue:e.dialogVisible,"onUpdate:modelValue":l[6]||(l[6]=a=>e.dialogVisible=a)},{footer:o(()=>[s(n,{onClick:e.submitForm,type:"primary",disabled:e.formLoading},{default:o(()=>l[7]||(l[7]=[D("\u786E \u5B9A")])),_:1},8,["disabled"]),s(n,{onClick:l[5]||(l[5]=a=>e.dialogVisible=!1)},{default:o(()=>l[8]||(l[8]=[D("\u53D6 \u6D88")])),_:1})]),default:o(()=>[k((_(),V(p,{ref:"formRef",model:e.formData,rules:e.formRules,"label-width":"80px"},{default:o(()=>[s(r,{label:"\u54C1\u724C\u540D\u79F0",prop:"name"},{default:o(()=>[s(m,{modelValue:e.formData.name,"onUpdate:modelValue":l[0]||(l[0]=a=>e.formData.name=a),placeholder:"\u8BF7\u8F93\u5165\u54C1\u724C\u540D\u79F0"},null,8,["modelValue"])]),_:1}),s(r,{label:"\u54C1\u724C\u56FE\u7247",prop:"picUrl"},{default:o(()=>[s(d,{modelValue:e.formData.picUrl,"onUpdate:modelValue":l[1]||(l[1]=a=>e.formData.picUrl=a),limit:1,"is-show-tip":!1},null,8,["modelValue"])]),_:1}),s(r,{label:"\u54C1\u724C\u6392\u5E8F",prop:"sort"},{default:o(()=>[s(t,{modelValue:e.formData.sort,"onUpdate:modelValue":l[2]||(l[2]=a=>e.formData.sort=a),"controls-position":"right",min:0},null,8,["modelValue"])]),_:1}),s(r,{label:"\u54C1\u724C\u72B6\u6001",prop:"status"},{default:o(()=>[s(u,{modelValue:e.formData.status,"onUpdate:modelValue":l[3]||(l[3]=a=>e.formData.status=a)},{default:o(()=>[(_(!0),B(x,null,I(e.getIntDictOptions(e.DICT_TYPE.COMMON_STATUS),a=>(_(),V(b,{key:a.value,value:a.value},{default:o(()=>[D(R(a.label),1)]),_:2},1032,["value"]))),128))]),_:1},8,["modelValue"])]),_:1}),s(r,{label:"\u54C1\u724C\u63CF\u8FF0"},{default:o(()=>[s(m,{modelValue:e.formData.description,"onUpdate:modelValue":l[4]||(l[4]=a=>e.formData.description=a),type:"textarea",placeholder:"\u8BF7\u8F93\u5165\u54C1\u724C\u63CF\u8FF0"},null,8,["modelValue"])]),_:1})]),_:1},8,["model","rules"])),[[v,e.formLoading]])]),_:1},8,["title","modelValue"])}],["__file","/Users/steven/00/500_code/520_github/yudao-ui-admin-vue3/src/views/mall/product/brand/BrandForm.vue"]]);export{Q as default};
