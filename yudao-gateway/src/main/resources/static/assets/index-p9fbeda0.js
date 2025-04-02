import{d as I,r as t,u as E,S as U,C as T,D as k,a as M,_ as D,c as N,I as P,q as z,w as e,k as i,F as x,v as h,R as j,o as d,m as L,ah as C,N as O,A as H,B as V}from"./index-BaY5TDP-.js";import{g as W,_ as q}from"./index-fxekK-Kb.js";import{u as A}from"./tagsView-lnAkwTv2.js";import{a as Q}from"./index-6-r4wYJE.js";import G from"./BusinessDetailsHeader-Cj6T2kKQ.js";import J from"./BusinessDetailsInfo-NrTk7vY-.js";import K from"./PermissionList-CbQig5nT.js";import{B as g}from"./index-BlslFSYd.js";import X from"./BusinessForm-DKlvsT4o.js";import Y from"./TransferForm-nV8fyRSP.js";import Z from"./index-CI2uGAAL.js";import $ from"./ContactList-CEDaV3Z_.js";import ss from"./BusinessUpdateStatusForm-CrNtvh1j.js";import is from"./ContractList-C_ljtvzC.js";import es from"./BusinessProductList-BXz2f0kC.js";import"./el-timeline-item-BFYwlQ-d.js";import"./formatTime-Dr6TiYYc.js";import"./ContentWrap-DKQn7kZm.js";import"./el-descriptions-item-CRF_CO88.js";import"./DictTag-QtcI9ZjC.js";import"./color-BN7ZL7BD.js";import"./PermissionForm-jo-CjsNU.js";import"./Dialog-CZSXtzfQ.js";import"./index-CuAlllbQ.js";import"./index-n6shePIl.js";import"./index-h6ObHKtQ.js";import"./BusinessProductForm-FoZjzksq.js";import"./index-D4G-Yxr7.js";import"./index-C4zjco0X.js";import"./index-DiJG1eDb.js";import"./index-B97LdofC.js";import"./index-avjYFQiD.js";import"./index-DrSdAlug.js";import"./FollowUpRecordForm-C2CG18-w.js";import"./FollowUpRecordBusinessForm-B1oFy6Z2.js";import"./FollowUpRecordContactForm-BevYD0eZ.js";import"./BusinessListModal-6XoY13Ne.js";import"./ContactListModal-DsE0FODx.js";import"./ContactForm-DLuG_ZcF.js";import"./index-Qzz5HSIB.js";import"./tree-z7HkrWVC.js";import"./ContractForm-DyS_nB0a.js";import"./ContractProductForm--_dghpLm.js";const rs=D(I({name:"CrmBusinessDetail",__name:"index",setup(w,{expose:r}){r();const B=k(),s=t(0),f=t(!0),n=t({}),u=t(),o=async()=>{f.value=!0;try{n.value=await Q(s.value),await l(s.value)}finally{f.value=!1}},b=t(),c=t(),y=t(),S=t([]),l=async a=>{if(!a)return;const R=await W({bizType:g.CRM_BUSINESS,bizId:a});S.value=R.list},{delView:m}=A(),{currentRoute:p}=E(),_=()=>{m(M(p))},{params:v}=U();T(async()=>{if(!v.id)return B.warning("\u53C2\u6570\u9519\u8BEF\uFF0C\u5546\u673A\u4E0D\u80FD\u4E3A\u7A7A\uFF01"),void _();s.value=v.id,await o()});const F={message:B,businessId:s,loading:f,business:n,permissionListRef:u,getBusiness:o,formRef:b,openForm:(a,R)=>{b.value.open(a,R)},statusFormRef:c,openStatusForm:()=>{c.value.open(n.value)},transferFormRef:y,transfer:()=>{var a;(a=y.value)==null||a.open(n.value.id)},logList:S,getOperateLog:l,delView:m,currentRoute:p,close:_,params:v,BusinessDetailsHeader:G,BusinessDetailsInfo:J,PermissionList:K,get BizTypeEnum(){return g},BusinessForm:X,CrmTransferForm:Y,FollowUpList:Z,ContactList:$,BusinessUpdateStatusForm:ss,ContractList:is,BusinessProductList:es};return Object.defineProperty(F,"__isScriptSetup",{enumerable:!1,value:!0}),F}}),[["render",function(w,r,B,s,f,n){const u=O,o=H,b=q,c=V,y=h,S=j;return d(),N(x,null,[P((d(),z(s.BusinessDetailsHeader,{business:s.business},{default:e(()=>{var l,m,p;return[(l=s.permissionListRef)!=null&&l.validateWrite?(d(),z(u,{key:0,onClick:r[0]||(r[0]=_=>s.openForm("update",s.business.id))},{default:e(()=>r[2]||(r[2]=[L(" \u7F16\u8F91 ")])),_:1})):C("",!0),(m=s.permissionListRef)!=null&&m.validateWrite?(d(),z(u,{key:1,disabled:s.business.endStatus,type:"success",onClick:r[1]||(r[1]=_=>s.openStatusForm())},{default:e(()=>r[3]||(r[3]=[L(" \u53D8\u66F4\u5546\u673A\u72B6\u6001 ")])),_:1},8,["disabled"])):C("",!0),(p=s.permissionListRef)!=null&&p.validateOwnerUser?(d(),z(u,{key:2,type:"primary",onClick:s.transfer},{default:e(()=>r[4]||(r[4]=[L(" \u8F6C\u79FB ")])),_:1})):C("",!0)]}),_:1},8,["business"])),[[S,s.loading]]),i(y,null,{default:e(()=>[i(c,null,{default:e(()=>[i(o,{label:"\u8DDF\u8FDB\u8BB0\u5F55"},{default:e(()=>[i(s.FollowUpList,{"biz-id":s.businessId,"biz-type":s.BizTypeEnum.CRM_BUSINESS},null,8,["biz-id","biz-type"])]),_:1}),i(o,{label:"\u8BE6\u7EC6\u8D44\u6599"},{default:e(()=>[i(s.BusinessDetailsInfo,{business:s.business},null,8,["business"])]),_:1}),i(o,{label:"\u8054\u7CFB\u4EBA",lazy:""},{default:e(()=>[i(s.ContactList,{"biz-id":s.business.id,"biz-type":s.BizTypeEnum.CRM_BUSINESS,"business-id":s.business.id,"customer-id":s.business.customerId},null,8,["biz-id","biz-type","business-id","customer-id"])]),_:1}),i(o,{label:"\u4EA7\u54C1"},{default:e(()=>[i(s.BusinessProductList,{business:s.business},null,8,["business"])]),_:1}),i(o,{label:"\u5408\u540C",lazy:""},{default:e(()=>[i(s.ContractList,{"biz-id":s.business.id,"biz-type":s.BizTypeEnum.CRM_BUSINESS},null,8,["biz-id","biz-type"])]),_:1}),i(o,{label:"\u64CD\u4F5C\u65E5\u5FD7"},{default:e(()=>[i(b,{"log-list":s.logList},null,8,["log-list"])]),_:1}),i(o,{label:"\u56E2\u961F\u6210\u5458"},{default:e(()=>[i(s.PermissionList,{ref:"permissionListRef","biz-id":s.business.id,"biz-type":s.BizTypeEnum.CRM_BUSINESS,"show-action":!0,onQuitTeam:s.close},null,8,["biz-id","biz-type"])]),_:1})]),_:1})]),_:1}),i(s.BusinessForm,{ref:"formRef",onSuccess:s.getBusiness},null,512),i(s.BusinessUpdateStatusForm,{ref:"statusFormRef",onSuccess:s.getBusiness},null,512),i(s.CrmTransferForm,{ref:"transferFormRef","biz-type":s.BizTypeEnum.CRM_BUSINESS,onSuccess:s.close},null,8,["biz-type"])],64)}],["__file","/Users/steven/00/500_code/520_github/yudao-ui-admin-vue3/src/views/crm/business/detail/index.vue"]]);export{rs as default};
