import{d as k,g as F,D as P,r as u,f as T,_ as R,o as g,q as D,w as t,k as s,m as w,I as h,Z as x,L,cp as S,O as q,N as C,R as O}from"./index-BaY5TDP-.js";import{_ as j}from"./Dialog-CZSXtzfQ.js";import{a as I,c as N,b as Z}from"./template-xqRkEjeZ.js";const z=R(k({name:"DiyTemplateForm",__name:"DiyTemplateForm",emits:["success"],setup(U,{expose:a,emit:b}){const{t:e}=F(),c=P(),f=u(!1),d=u(""),r=u(!1),n=u(""),o=u({id:void 0,name:void 0,remark:void 0,previewPicUrls:[]}),p=T({name:[{required:!0,message:"\u6A21\u677F\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A",trigger:"blur"}]}),m=u(),v=async(i,V)=>{if(f.value=!0,d.value=e("action."+i),n.value=i,_(),V){r.value=!0;try{o.value=await I(V)}finally{r.value=!1}}};a({open:v});const l=b,_=()=>{var i;o.value={id:void 0,name:void 0,remark:void 0,previewPicUrls:[]},(i=m.value)==null||i.resetFields()},y={t:e,message:c,dialogVisible:f,dialogTitle:d,formLoading:r,formType:n,formData:o,formRules:p,formRef:m,open:v,emit:l,submitForm:async()=>{if(m&&await m.value.validate()){r.value=!0;try{const i=o.value;n.value==="create"?(await N(i),c.success(e("common.createSuccess"))):(await Z(i),c.success(e("common.updateSuccess"))),f.value=!1,l("success")}finally{r.value=!1}}},resetForm:_};return Object.defineProperty(y,"__isScriptSetup",{enumerable:!1,value:!0}),y}}),[["render",function(U,a,b,e,c,f){const d=x,r=L,n=S,o=q,p=C,m=j,v=O;return g(),D(m,{modelValue:e.dialogVisible,"onUpdate:modelValue":a[4]||(a[4]=l=>e.dialogVisible=l),title:e.dialogTitle},{footer:t(()=>[s(p,{disabled:e.formLoading,type:"primary",onClick:e.submitForm},{default:t(()=>a[5]||(a[5]=[w("\u786E \u5B9A")])),_:1},8,["disabled"]),s(p,{onClick:a[3]||(a[3]=l=>e.dialogVisible=!1)},{default:t(()=>a[6]||(a[6]=[w("\u53D6 \u6D88")])),_:1})]),default:t(()=>[h((g(),D(o,{ref:"formRef",model:e.formData,rules:e.formRules,"label-width":"100px"},{default:t(()=>[s(r,{label:"\u6A21\u677F\u540D\u79F0",prop:"name"},{default:t(()=>[s(d,{modelValue:e.formData.name,"onUpdate:modelValue":a[0]||(a[0]=l=>e.formData.name=l),placeholder:"\u8BF7\u8F93\u5165\u6A21\u677F\u540D\u79F0"},null,8,["modelValue"])]),_:1}),s(r,{label:"\u5907\u6CE8",prop:"remark"},{default:t(()=>[s(d,{modelValue:e.formData.remark,"onUpdate:modelValue":a[1]||(a[1]=l=>e.formData.remark=l),placeholder:"\u8BF7\u8F93\u5165\u5907\u6CE8",type:"textarea"},null,8,["modelValue"])]),_:1}),s(r,{label:"\u9884\u89C8\u56FE",prop:"previewPicUrls"},{default:t(()=>[s(n,{modelValue:e.formData.previewPicUrls,"onUpdate:modelValue":a[2]||(a[2]=l=>e.formData.previewPicUrls=l)},null,8,["modelValue"])]),_:1})]),_:1},8,["model","rules"])),[[v,e.formLoading]])]),_:1},8,["modelValue","title"])}],["__file","/Users/steven/00/500_code/520_github/yudao-ui-admin-vue3/src/views/mall/promotion/diy/template/DiyTemplateForm.vue"]]);export{z as default};
