import{d as P,g as k,D as F,r as u,f as R,_ as h,o as y,q as w,w as o,k as s,m as D,I as L,Z as S,L as x,cp as T,O as q,N as C,R as O}from"./index-BaY5TDP-.js";import{_ as j}from"./Dialog-CZSXtzfQ.js";import{a as I,c as N,b as Z}from"./page-CKNh-pyA.js";const z=h(P({name:"DiyPageForm",__name:"DiyPageForm",emits:["success"],setup(U,{expose:a,emit:g}){const{t:e}=k(),c=F(),f=u(!1),d=u(""),r=u(!1),n=u(""),m=u({id:void 0,name:void 0,remark:void 0,previewPicUrls:[]}),p=R({name:[{required:!0,message:"\u9875\u9762\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A",trigger:"blur"}]}),t=u(),v=async(i,_)=>{if(f.value=!0,d.value=e("action."+i),n.value=i,b(),_){r.value=!0;try{m.value=await I(_)}finally{r.value=!1}}};a({open:v});const l=g,b=()=>{var i;m.value={id:void 0,name:void 0,remark:void 0,previewPicUrls:[]},(i=t.value)==null||i.resetFields()},V={t:e,message:c,dialogVisible:f,dialogTitle:d,formLoading:r,formType:n,formData:m,formRules:p,formRef:t,open:v,emit:l,submitForm:async()=>{if(t&&await t.value.validate()){r.value=!0;try{const i=m.value;n.value==="create"?(await N(i),c.success(e("common.createSuccess"))):(await Z(i),c.success(e("common.updateSuccess"))),f.value=!1,l("success")}finally{r.value=!1}}},resetForm:b};return Object.defineProperty(V,"__isScriptSetup",{enumerable:!1,value:!0}),V}}),[["render",function(U,a,g,e,c,f){const d=S,r=x,n=T,m=q,p=C,t=j,v=O;return y(),w(t,{modelValue:e.dialogVisible,"onUpdate:modelValue":a[4]||(a[4]=l=>e.dialogVisible=l),title:e.dialogTitle},{footer:o(()=>[s(p,{disabled:e.formLoading,type:"primary",onClick:e.submitForm},{default:o(()=>a[5]||(a[5]=[D("\u786E \u5B9A")])),_:1},8,["disabled"]),s(p,{onClick:a[3]||(a[3]=l=>e.dialogVisible=!1)},{default:o(()=>a[6]||(a[6]=[D("\u53D6 \u6D88")])),_:1})]),default:o(()=>[L((y(),w(m,{ref:"formRef",model:e.formData,rules:e.formRules,"label-width":"100px"},{default:o(()=>[s(r,{label:"\u9875\u9762\u540D\u79F0",prop:"name"},{default:o(()=>[s(d,{modelValue:e.formData.name,"onUpdate:modelValue":a[0]||(a[0]=l=>e.formData.name=l),placeholder:"\u8BF7\u8F93\u5165\u9875\u9762\u540D\u79F0"},null,8,["modelValue"])]),_:1}),s(r,{label:"\u5907\u6CE8",prop:"remark"},{default:o(()=>[s(d,{modelValue:e.formData.remark,"onUpdate:modelValue":a[1]||(a[1]=l=>e.formData.remark=l),placeholder:"\u8BF7\u8F93\u5165\u5907\u6CE8"},null,8,["modelValue"])]),_:1}),s(r,{label:"\u9884\u89C8\u56FE",prop:"previewPicUrls"},{default:o(()=>[s(n,{modelValue:e.formData.previewPicUrls,"onUpdate:modelValue":a[2]||(a[2]=l=>e.formData.previewPicUrls=l)},null,8,["modelValue"])]),_:1})]),_:1},8,["model","rules"])),[[v,e.formLoading]])]),_:1},8,["modelValue","title"])}],["__file","/Users/steven/00/500_code/520_github/yudao-ui-admin-vue3/src/views/mall/promotion/diy/page/DiyPageForm.vue"]]);export{z as default};
