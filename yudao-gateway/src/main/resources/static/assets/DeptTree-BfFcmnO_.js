import{d as f,r as n,au as h,C as v,cC as _,_ as k,o as y,c as N,j as p,k as i,w as g,F as x,z as T,Z as b}from"./index-BaY5TDP-.js";import{g as C}from"./index-dK17nfjs.js";import{h as w,d as D}from"./tree-z7HkrWVC.js";const P={class:"head-container"},S={class:"head-container"},U=k(f({name:"SystemUserDeptTree",__name:"DeptTree",emits:["node-click"],setup(u,{expose:t,emit:c}){t();const e=n(""),r=n([]),o=n(),s=async()=>{const a=await C();r.value=[],r.value.push(...w(a))},l=c;h(e,a=>{o.value.filter(a)}),v(async()=>{await s()});const d={deptName:e,deptList:r,treeRef:o,getTree:s,filterNode:(a,m)=>!a||m.name.includes(a),handleNodeClick:async a=>{l("node-click",a)},emits:l,get ElTree(){return _},get defaultProps(){return D}};return Object.defineProperty(d,"__isScriptSetup",{enumerable:!1,value:!0}),d}}),[["render",function(u,t,c,e,r,o){const s=T,l=b;return y(),N(x,null,[p("div",P,[i(l,{modelValue:e.deptName,"onUpdate:modelValue":t[0]||(t[0]=d=>e.deptName=d),class:"mb-20px",clearable:"",placeholder:"\u8BF7\u8F93\u5165\u90E8\u95E8\u540D\u79F0"},{prefix:g(()=>[i(s,{icon:"ep:search"})]),_:1},8,["modelValue"])]),p("div",S,[i(e.ElTree,{ref:"treeRef",data:e.deptList,"expand-on-click-node":!1,"filter-node-method":e.filterNode,props:e.defaultProps,"default-expand-all":"","highlight-current":"","node-key":"id",onNodeClick:e.handleNodeClick},null,8,["data","props"])])],64)}],["__file","/Users/steven/00/500_code/520_github/yudao-ui-admin-vue3/src/views/system/user/DeptTree.vue"]]);export{U as default};
