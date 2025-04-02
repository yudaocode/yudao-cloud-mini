import{d as L,D as R,r as I,ek as C,G as E,U as W,el as V,_ as U,o as f,c,k as l,w as g,j as o,a2 as y,t as h,m as k,ah as A,F as x,n as O,bk as P,z as Y,Z as G,N}from"./index-BaY5TDP-.js";import j from"./Tag-BfWL5llS.js";import{k as v,W as F}from"./constants-BXWrMvZH.js";const z=L({__name:"Left",props:{isWriting:{type:Boolean,required:!0}},emits:["submit","example","reset"],setup(_,{expose:a,emit:p}){a();const e=R(),m=p,n=I(v.WRITING),D=[{text:"\u64B0\u5199",value:v.WRITING},{text:"\u56DE\u590D",value:v.REPLY}],[d,b]=C(),[t,r]=C(),s={type:1,prompt:"",originalContent:"",tone:1,language:1,length:1,format:1},i=I({...s}),T={},w={message:e,emits:m,example:u=>{i.value={...s,...V(F[u],["data"])},m("example",u)},reset:()=>{i.value={...s},m("reset")},selectedTab:n,tabs:D,DefineTab:d,ReuseTab:b,DefineLabel:t,ReuseLabel:r,initData:s,formData:i,recordFormData:T,switchTab:u=>{u!==n.value&&(T[n.value]=i.value,n.value=u,i.value={...s,...T[u]})},submit:()=>{n.value!==2||i.value.originalContent?i.value.prompt?m("submit",{...n.value===1?V(i.value,["originalContent"]):i.value,type:n.value}):e.warning(`\u8BF7\u8F93\u5165${n.value===1?"\u5199\u4F5C":"\u56DE\u590D"}\u5185\u5BB9`):e.warning("\u8BF7\u8F93\u5165\u539F\u6587")},Tag:j,get DICT_TYPE(){return E},get getIntDictOptions(){return W},get AiWriteTypeEnum(){return v}};return Object.defineProperty(w,"__isScriptSetup",{enumerable:!1,value:!0}),w}}),q=["onClick"],S={class:"mt-5 mb-3 flex items-center justify-between text-[14px]"},$=["onClick"],B={class:"w-full pt-2 bg-[#f5f7f9] flex justify-center"},H={class:"w-[303px] rounded-full bg-[#DDDFE3] p-1 z-10"},M={class:"px-7 pb-2 flex-grow overflow-y-auto lg:block w-[380px] box-border bg-[#f5f7f9] h-full"},Z={class:"flex items-center justify-center mt-3"},J=U(z,[["render",function(_,a,p,e,m,n){const D=Y,d=G,b=N;return f(),c(x,null,[l(e.DefineTab,null,{default:g(({active:t,text:r,itemClick:s})=>[o("span",{class:y([t?"text-black shadow-md":"hover:bg-[#DDDFE3]","inline-block w-1/2 rounded-full cursor-pointer text-center leading-[30px] relative z-1 text-[5C6370] hover:text-black"]),onClick:s},h(r),11,q)]),_:1}),l(e.DefineLabel,null,{default:g(({label:t,hint:r,hintClick:s})=>[o("h3",S,[o("span",null,h(t),1),r?(f(),c("span",{key:0,class:"flex items-center text-[12px] text-[#846af7] cursor-pointer select-none",onClick:s},[l(D,{icon:"ep:question-filled"}),k(" "+h(r),1)],8,$)):A("",!0)])]),_:1}),o("div",P({class:"flex flex-col"},_.$attrs),[o("div",B,[o("div",H,[o("div",{class:y([e.selectedTab===e.AiWriteTypeEnum.REPLY&&"after:transform after:translate-x-[100%]","flex items-center relative after:content-[''] after:block after:bg-white after:h-[30px] after:w-1/2 after:absolute after:top-0 after:left-0 after:transition-transform after:rounded-full"])},[(f(),c(x,null,O(e.tabs,t=>l(e.ReuseTab,{key:t.value,active:t.value===e.selectedTab,itemClick:()=>e.switchTab(t.value),text:t.text},null,8,["active","itemClick","text"])),64))],2)])]),o("div",M,[o("div",null,[e.selectedTab===1?(f(),c(x,{key:0},[l(e.ReuseLabel,{"hint-click":()=>e.example("write"),hint:"\u793A\u4F8B",label:"\u5199\u4F5C\u5185\u5BB9"},null,8,["hint-click"]),l(d,{modelValue:e.formData.prompt,"onUpdate:modelValue":a[0]||(a[0]=t=>e.formData.prompt=t),maxlength:500,rows:5,placeholder:"\u8BF7\u8F93\u5165\u5199\u4F5C\u5185\u5BB9",showWordLimit:"",type:"textarea"},null,8,["modelValue"])],64)):(f(),c(x,{key:1},[l(e.ReuseLabel,{"hint-click":()=>e.example("reply"),hint:"\u793A\u4F8B",label:"\u539F\u6587"},null,8,["hint-click"]),l(d,{modelValue:e.formData.originalContent,"onUpdate:modelValue":a[1]||(a[1]=t=>e.formData.originalContent=t),maxlength:500,rows:5,placeholder:"\u8BF7\u8F93\u5165\u539F\u6587",showWordLimit:"",type:"textarea"},null,8,["modelValue"]),l(e.ReuseLabel,{label:"\u56DE\u590D\u5185\u5BB9"}),l(d,{modelValue:e.formData.prompt,"onUpdate:modelValue":a[2]||(a[2]=t=>e.formData.prompt=t),maxlength:500,rows:5,placeholder:"\u8BF7\u8F93\u5165\u56DE\u590D\u5185\u5BB9",showWordLimit:"",type:"textarea"},null,8,["modelValue"])],64)),l(e.ReuseLabel,{label:"\u957F\u5EA6"}),l(e.Tag,{modelValue:e.formData.length,"onUpdate:modelValue":a[3]||(a[3]=t=>e.formData.length=t),tags:e.getIntDictOptions(e.DICT_TYPE.AI_WRITE_LENGTH)},null,8,["modelValue","tags"]),l(e.ReuseLabel,{label:"\u683C\u5F0F"}),l(e.Tag,{modelValue:e.formData.format,"onUpdate:modelValue":a[4]||(a[4]=t=>e.formData.format=t),tags:e.getIntDictOptions(e.DICT_TYPE.AI_WRITE_FORMAT)},null,8,["modelValue","tags"]),l(e.ReuseLabel,{label:"\u8BED\u6C14"}),l(e.Tag,{modelValue:e.formData.tone,"onUpdate:modelValue":a[5]||(a[5]=t=>e.formData.tone=t),tags:e.getIntDictOptions(e.DICT_TYPE.AI_WRITE_TONE)},null,8,["modelValue","tags"]),l(e.ReuseLabel,{label:"\u8BED\u8A00"}),l(e.Tag,{modelValue:e.formData.language,"onUpdate:modelValue":a[6]||(a[6]=t=>e.formData.language=t),tags:e.getIntDictOptions(e.DICT_TYPE.AI_WRITE_LANGUAGE)},null,8,["modelValue","tags"]),o("div",Z,[l(b,{disabled:p.isWriting,onClick:e.reset},{default:g(()=>a[7]||(a[7]=[k("\u91CD\u7F6E")])),_:1},8,["disabled"]),l(b,{loading:p.isWriting,color:"#846af7",onClick:e.submit},{default:g(()=>a[8]||(a[8]=[k("\u751F\u6210")])),_:1},8,["loading"])])])])],16)],64)}],["__file","/Users/steven/00/500_code/520_github/yudao-ui-admin-vue3/src/views/ai/write/index/components/Left.vue"]]);export{J as default};
