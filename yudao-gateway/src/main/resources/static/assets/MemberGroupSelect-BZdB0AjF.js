import{d as i,b as c,r as b,C as g,_,o as r,q as m,w as v,c as f,F as V,n as y,J as S,K as w}from"./index-BaY5TDP-.js";import{g as x}from"./index-iRg50rYu.js";const G=_(i({name:"MemberGroupSelect",__name:"MemberGroupSelect",props:{modelValue:{type:Number,default:void 0}},emits:["update:modelValue"],setup(s,{expose:o,emit:p}){o();const a=s,u=p,d=c({get:()=>a.modelValue,set(n){u("update:modelValue",n)}}),l=b([]),t=async()=>{l.value=await x()};g(()=>{t()});const e={props:a,emit:u,groupId:d,groupOptions:l,getList:t};return Object.defineProperty(e,"__isScriptSetup",{enumerable:!1,value:!0}),e}}),[["render",function(s,o,p,a,u,d){const l=S,t=w;return r(),m(t,{modelValue:a.groupId,"onUpdate:modelValue":o[0]||(o[0]=e=>a.groupId=e),placeholder:"\u8BF7\u9009\u62E9\u7528\u6237\u5206\u7EC4",clearable:"",class:"!w-240px"},{default:v(()=>[(r(!0),f(V,null,y(a.groupOptions,e=>(r(),m(l,{key:e.id,label:e.name,value:e.id},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])}],["__file","/Users/steven/00/500_code/520_github/yudao-ui-admin-vue3/src/views/member/group/components/MemberGroupSelect.vue"]]);export{G as default};
