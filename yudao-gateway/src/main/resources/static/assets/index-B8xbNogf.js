import{eq as A,er as R,aL as B,es as G,d as U,S as W,D as F,r as g,b as O,C as H,ao as K,em as Z,bQ as J,_ as M,o as l,c as D,k as _,w as v,I as X,q as C,j as I,F as q,n as E,a2 as Q,t as z,m as Y,z as ee,Z as oe,v as te,b8 as ae,l as ie,aK as re,aq as se,E as ne,R as le}from"./index-BaY5TDP-.js";import{_ as ce}from"./ContentWrap-DKQn7kZm.js";import{E as pe}from"./el-empty-wTPt5q4m.js";import{E as fe}from"./el-image-Bg-CwbDE.js";import{b as me}from"./index-5lnhJJF7.js";import{f as ue}from"./index-BJQN17A_.js";import{C as de}from"./index-D7iZxFey.js";import ve from"./ProcessDefinitionDetail-C5c47eTF.js";import"./formCreate-Dy2BGZHq.js";import"./constants-CEEr2azc.js";import"./consts-vgsb8q48.js";import"./ProcessInstanceBpmnViewer-CwVPQ6L9.js";import"./bpmn-embedded-Bxfb97Hp.js";import"./Dialog-CZSXtzfQ.js";import"./XTextButton-Cf-hbTFF.js";import"./XButton-BcV39lfk.js";import"./index-CuAlllbQ.js";import"./utils-DQEYWnsS.js";import"./index-ZFL2ufyC.js";import"./index-BCN8BzfC.js";import"./index-BeYJ8u62.js";import"./el-tree-select-DphqCDCz.js";import"./tree-z7HkrWVC.js";import"./index-C7Vgvn4F.js";import"./index-dK17nfjs.js";import"./index-D-_5jDBN.js";import"./index-RbAZqEQx.js";import"./index-avjYFQiD.js";import"./index-DrSdAlug.js";import"./index-D-US79ui.js";import"./el-drawer-r3cMvY4i.js";import"./DictTag-QtcI9ZjC.js";import"./color-BN7ZL7BD.js";import"./index-l60I0Cke.js";import"./formatTime-Dr6TiYYc.js";import"./ProcessInstanceSimpleViewer-DBZzCdFr.js";import"./simple-process-designer-DviJ9JIp.js";import"./el-space-B4pGZPiv.js";import"./download-oWiM5xVU.js";import"./ProcessInstanceTimeline-CvaFNncS.js";import"./index-uy0_B-js.js";import"./el-timeline-item-BFYwlQ-d.js";import"./el-avatar-DZsRbb7z.js";import"./tagsView-lnAkwTv2.js";function ye(i,r,n,o){for(var f=-1,h=i==null?0:i.length;++f<h;){var c=i[f];r(o,c,n(c),i)}return o}function ge(i,r,n,o){return A(i,function(f,h,c){r(o,f,n(f),c)}),o}var V,he=Object.prototype.hasOwnProperty,xe=(V=function(i,r,n){he.call(i,n)?i[n].push(r):G(i,n,[r])},function(i,r){return(B(i)?ye:ge)(i,V,R(r),{})});const be={class:"flex flex-col"},De=["onClick"],_e={class:"text-18px font-bold mb-10px mt-5px"},Ce={class:"grid grid-cols-3 gap3"},ke={class:"flex"},we={key:1,class:"flow-icon"},Pe={style:{"font-size":"12px",color:"#fff"}},Le=M(U({name:"BpmProcessInstanceCreate",__name:"index",setup(i,{expose:r}){r();const{proxy:n}=J(),o=W(),f=F(),h=g(""),c=o.query.processInstanceId,k=g(!0),p=g([]),y=g({}),m=g([]),S=async()=>{k.value=!0;try{if(await N(),await T(),(c==null?void 0:c.length)>0){const t=await ue(c);if(!t)return void f.error("\u91CD\u65B0\u53D1\u8D77\u6D41\u7A0B\u5931\u8D25\uFF0C\u539F\u56E0\uFF1A\u6D41\u7A0B\u5B9E\u4F8B\u4E0D\u5B58\u5728");const e=m.value.find(a=>{var s;return a.key==((s=t.processDefinition)==null?void 0:s.key)});if(!e)return void f.error("\u91CD\u65B0\u53D1\u8D77\u6D41\u7A0B\u5931\u8D25\uFF0C\u539F\u56E0\uFF1A\u6D41\u7A0B\u5B9A\u4E49\u4E0D\u5B58\u5728");await P(e,t.formVariables)}}finally{k.value=!1}},N=async()=>{try{p.value=await de.getCategorySimpleList()}finally{}},T=async()=>{var t;try{m.value=await me({suspensionState:1}),x.value=m.value,u.value.length>0&&!((t=y.value)!=null&&t.code)&&(y.value=u.value[0])}finally{}},x=g([]),w=O(()=>{var a;if(!((a=m.value)!=null&&a.length))return{};const t=xe(x.value,"category"),e={};return p.value.forEach(s=>{t[s.code]&&(e[s.code]=t[s.code])}),e}),$=g(),j=g(),P=async(t,e)=>{var a;$.value=t,await K(),(a=j.value)==null||a.initProcessInfo(t,e)},u=O(()=>{var e;if(!((e=p.value)!=null&&e.length)||!w.value)return[];const t=Object.keys(w.value);return p.value.filter(a=>t.includes(a.code))});H(()=>{S()});const d={proxy:n,route:o,message:f,searchName:h,processInstanceId:c,loading:k,categoryList:p,categoryActive:y,processDefinitionList:m,getList:S,getCategoryList:N,getProcessDefinitionList:T,filteredProcessDefinitionList:x,handleQuery:()=>{h.value.trim()?x.value=m.value.filter(t=>t.name.toLowerCase().includes(h.value.toLowerCase())):x.value=m.value},processDefinitionGroup:w,handleCategoryClick:t=>{y.value=t;const e=n.$refs[`category-${t.code}`];if(e!=null&&e.length){const a=n.$refs.scrollWrapper,s=e[0].offsetTop;a.scrollTo({top:s,behavior:"smooth"})}},getCategoryName:t=>{var e,a;return(a=(e=p.value)==null?void 0:e.find(s=>s.code===t))==null?void 0:a.name},selectProcessDefinition:$,processDefinitionDetailRef:j,handleSelect:P,handleScroll:t=>{const e=t.scrollTop,a=p.value.map(b=>{const L=n.$refs[`category-${b.code}`];return L!=null&&L[0]?{code:b.code,offsetTop:L[0].offsetTop,height:L[0].offsetHeight}:null}).filter(Boolean);let s=a[0];for(const b of a){if(!(e>=b.offsetTop-50))break;s=b}s&&y.value.code!==s.code&&(y.value=p.value.find(b=>b.code===s.code))},availableCategories:u,ProcessDefinitionDetail:ve,get sliceName(){return Z}};return Object.defineProperty(d,"__isScriptSetup",{enumerable:!1,value:!0}),d}}),[["render",function(i,r,n,o,f,h){var P;const c=ee,k=oe,p=te,y=fe,m=ae,S=ie,N=re,T=se,x=ne,w=pe,$=ce,j=le;return o.selectProcessDefinition?(l(),C(o.ProcessDefinitionDetail,{key:1,ref:"processDefinitionDetailRef",selectProcessDefinition:o.selectProcessDefinition,onCancel:r[1]||(r[1]=u=>o.selectProcessDefinition=void 0)},null,8,["selectProcessDefinition"])):(l(),D(q,{key:0},[_(k,{modelValue:o.searchName,"onUpdate:modelValue":r[0]||(r[0]=u=>o.searchName=u),class:"!w-50% mb-15px",placeholder:"\u8BF7\u8F93\u5165\u6D41\u7A0B\u540D\u79F0",clearable:"",onInput:o.handleQuery,onClear:o.handleQuery},{prefix:v(()=>[_(c,{icon:"ep:search"})]),_:1},8,["modelValue"]),X((l(),C($,{class:Q([{"process-definition-container":(P=o.filteredProcessDefinitionList)==null?void 0:P.length},"position-relative pb-20px h-700px"])},{default:v(()=>{var u;return[(u=o.filteredProcessDefinitionList)!=null&&u.length?(l(),C(x,{key:0,gutter:20,class:"!flex-nowrap"},{default:v(()=>[_(p,{span:5},{default:v(()=>[I("div",be,[(l(!0),D(q,null,E(o.availableCategories,d=>(l(),D("div",{key:d.code,class:Q(["flex items-center p-10px cursor-pointer text-14px rounded-md",o.categoryActive.code===d.code?"text-#3e7bff bg-#e8eeff":""]),onClick:t=>o.handleCategoryClick(d)},z(d.name),11,De))),128))])]),_:1}),_(p,{span:19},{default:v(()=>[_(T,{ref:"scrollWrapper",height:"700",onScroll:o.handleScroll},{default:v(()=>[(l(!0),D(q,null,E(o.processDefinitionGroup,(d,t)=>(l(),D("div",{class:"mb-20px pl-10px",key:t,ref_for:!0,ref:`category-${t}`},[I("h3",_e,z(o.getCategoryName(t)),1),I("div",Ce,[(l(!0),D(q,null,E(d,e=>(l(),C(N,{key:e.id,content:e.description,disabled:!e.description||e.description.trim().length===0,placement:"top"},{default:v(()=>[_(S,{shadow:"hover",class:"cursor-pointer definition-item-card",onClick:a=>o.handleSelect(e)},{default:v(()=>[I("div",ke,[e.icon?(l(),C(y,{key:0,src:e.icon,class:"w-32px h-32px"},null,8,["src"])):(l(),D("div",we,[I("span",Pe,z(o.sliceName(e.name,0,2)),1)])),_(m,{class:"!ml-10px",size:"large"},{default:v(()=>[Y(z(e.name),1)]),_:2},1024)])]),_:2},1032,["onClick"])]),_:2},1032,["content","disabled"]))),128))])]))),128))]),_:1},512)]),_:1})]),_:1})):(l(),C(w,{key:1,class:"!py-200px","image-size":200,description:"\u6CA1\u6709\u627E\u5230\u641C\u7D22\u7ED3\u679C"}))]}),_:1},8,["class"])),[[j,o.loading]])],64))}],["__scopeId","data-v-b8ab8ed6"],["__file","/Users/steven/00/500_code/520_github/yudao-ui-admin-vue3/src/views/bpm/processInstance/create/index.vue"]]);export{Le as default};
