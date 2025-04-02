import{d as P,g as U,D as A,r,f as F,G as O,U as R,cC as S,_ as L,o as b,q as C,w as o,k as t,m as k,I as q,c as j,F as M,n as B,t as K,Z as Y,L as G,ch as H,l as Z,ak as z,al as J,O as Q,N as W,R as X}from"./index-BaY5TDP-.js";import{_ as $}from"./Dialog-CZSXtzfQ.js";import{C as w}from"./constants-CEEr2azc.js";import{h as ee,d as ae}from"./tree-z7HkrWVC.js";import{a as le,c as se,u as oe}from"./index-C3konCuC.js";import{g as te}from"./index-cImR9iDp.js";const ue=L(P({name:"SystemTenantPackageForm",__name:"TenantPackageForm",emits:["success"],setup(N,{expose:a,emit:T}){const{t:e}=U(),_=A(),V=r(!1),p=r(""),u=r(!1),i=r(""),c=r({id:null,name:null,remark:null,menuIds:[],status:w.ENABLE}),y=F({name:[{required:!0,message:"\u5957\u9910\u540D\u4E0D\u80FD\u4E3A\u7A7A",trigger:"blur"}],status:[{required:!0,message:"\u72B6\u6001\u4E0D\u80FD\u4E3A\u7A7A",trigger:"blur"}],menuIds:[{required:!0,message:"\u5173\u8054\u7684\u83DC\u5355\u7F16\u53F7\u4E0D\u80FD\u4E3A\u7A7A",trigger:"blur"}]}),f=r(),v=r([]),m=r(!1),d=r(),g=r(!1),l=async(s,n)=>{if(V.value=!0,p.value=e("action."+s),i.value=s,D(),v.value=ee(await te()),n){u.value=!0;try{const h=await le(n);c.value=h,h.menuIds.forEach(I=>{d.value.setChecked(I,!0,!1)})}finally{u.value=!1}}};a({open:l});const x=T,D=()=>{var s,n;g.value=!1,m.value=!1,c.value={id:null,name:null,remark:null,menuIds:[],status:w.ENABLE},(s=d.value)==null||s.setCheckedNodes([]),(n=f.value)==null||n.resetFields()},E={t:e,message:_,dialogVisible:V,dialogTitle:p,formLoading:u,formType:i,formData:c,formRules:y,formRef:f,menuOptions:v,menuExpand:m,treeRef:d,treeNodeAll:g,open:l,emit:x,submitForm:async()=>{if(f&&await f.value.validate()){u.value=!0;try{const s=c.value;s.menuIds=[...d.value.getCheckedKeys(!1),...d.value.getHalfCheckedKeys()],i.value==="create"?(await se(s),_.success(e("common.createSuccess"))):(await oe(s),_.success(e("common.updateSuccess"))),V.value=!1,x("success")}finally{u.value=!1}}},resetForm:D,handleCheckedTreeNodeAll:()=>{d.value.setCheckedNodes(g.value?v.value:[])},handleCheckedTreeExpand:()=>{var n;const s=(n=d.value)==null?void 0:n.store.nodesMap;for(let h in s)s[h].expanded!==m.value&&(s[h].expanded=m.value)},get DICT_TYPE(){return O},get getIntDictOptions(){return R},get defaultProps(){return ae},get ElTree(){return S}};return Object.defineProperty(E,"__isScriptSetup",{enumerable:!1,value:!0}),E}}),[["render",function(N,a,T,e,_,V){const p=Y,u=G,i=H,c=Z,y=z,f=J,v=Q,m=W,d=$,g=X;return b(),C(d,{modelValue:e.dialogVisible,"onUpdate:modelValue":a[6]||(a[6]=l=>e.dialogVisible=l),title:e.dialogTitle},{footer:o(()=>[t(m,{disabled:e.formLoading,type:"primary",onClick:e.submitForm},{default:o(()=>a[9]||(a[9]=[k("\u786E \u5B9A")])),_:1},8,["disabled"]),t(m,{onClick:a[5]||(a[5]=l=>e.dialogVisible=!1)},{default:o(()=>a[10]||(a[10]=[k("\u53D6 \u6D88")])),_:1})]),default:o(()=>[q((b(),C(v,{ref:"formRef",model:e.formData,rules:e.formRules,"label-width":"80px"},{default:o(()=>[t(u,{label:"\u5957\u9910\u540D",prop:"name"},{default:o(()=>[t(p,{modelValue:e.formData.name,"onUpdate:modelValue":a[0]||(a[0]=l=>e.formData.name=l),placeholder:"\u8BF7\u8F93\u5165\u5957\u9910\u540D"},null,8,["modelValue"])]),_:1}),t(u,{label:"\u83DC\u5355\u6743\u9650"},{default:o(()=>[t(c,{class:"w-full h-400px !overflow-y-scroll",shadow:"never"},{header:o(()=>[a[7]||(a[7]=k(" \u5168\u9009/\u5168\u4E0D\u9009: ")),t(i,{modelValue:e.treeNodeAll,"onUpdate:modelValue":a[1]||(a[1]=l=>e.treeNodeAll=l),"active-text":"\u662F","inactive-text":"\u5426","inline-prompt":"",onChange:e.handleCheckedTreeNodeAll},null,8,["modelValue"]),a[8]||(a[8]=k(" \u5168\u90E8\u5C55\u5F00/\u6298\u53E0: ")),t(i,{modelValue:e.menuExpand,"onUpdate:modelValue":a[2]||(a[2]=l=>e.menuExpand=l),"active-text":"\u5C55\u5F00","inactive-text":"\u6298\u53E0","inline-prompt":"",onChange:e.handleCheckedTreeExpand},null,8,["modelValue"])]),default:o(()=>[t(e.ElTree,{ref:"treeRef",data:e.menuOptions,props:e.defaultProps,"empty-text":"\u52A0\u8F7D\u4E2D\uFF0C\u8BF7\u7A0D\u5019","node-key":"id","show-checkbox":""},null,8,["data","props"])]),_:1})]),_:1}),t(u,{label:"\u72B6\u6001",prop:"status"},{default:o(()=>[t(f,{modelValue:e.formData.status,"onUpdate:modelValue":a[3]||(a[3]=l=>e.formData.status=l)},{default:o(()=>[(b(!0),j(M,null,B(e.getIntDictOptions(e.DICT_TYPE.COMMON_STATUS),l=>(b(),C(y,{key:l.value,value:l.value},{default:o(()=>[k(K(l.label),1)]),_:2},1032,["value"]))),128))]),_:1},8,["modelValue"])]),_:1}),t(u,{label:"\u5907\u6CE8",prop:"remark"},{default:o(()=>[t(p,{modelValue:e.formData.remark,"onUpdate:modelValue":a[4]||(a[4]=l=>e.formData.remark=l),placeholder:"\u8BF7\u8F93\u5165\u5907\u6CE8"},null,8,["modelValue"])]),_:1})]),_:1},8,["model","rules"])),[[g,e.formLoading]])]),_:1},8,["modelValue","title"])}],["__file","/Users/steven/00/500_code/520_github/yudao-ui-admin-vue3/src/views/system/tenantPackage/TenantPackageForm.vue"]]);export{ue as default};
