import{d as L,D as M,g as Y,r as b,f as F,C as N,U as R,G as Q,d$ as z,H as G,_ as B,X as H,o as i,c as _,k as l,w as t,F as y,n as S,q as c,m as P,I as U,ah as j,j as J,t as K,J as X,K as $,L as W,M as Z,z as ee,N as ae,O as le,P as te,ch as re,Q as ue,R as se}from"./index-BaY5TDP-.js";import{_ as ie}from"./index-avjYFQiD.js";import{_ as oe}from"./DictTag-QtcI9ZjC.js";import{E as ne}from"./el-image-Bg-CwbDE.js";import{_ as pe}from"./ContentWrap-DKQn7kZm.js";import{d as de}from"./formatTime-Dr6TiYYc.js";import{I as T}from"./index-BRp175ra.js";import{g as me}from"./index-CuAlllbQ.js";import{A as ce}from"./constants-BXWrMvZH.js";import"./index-DrSdAlug.js";import"./color-BN7ZL7BD.js";const ge=B(L({name:"AiImageManager",__name:"index",setup(q,{expose:r}){r();const f=M(),{t:a}=Y(),v=b(!0),I=b([]),m=b(0),p=F({pageNo:1,pageSize:10,userId:void 0,platform:void 0,status:void 0,publicStatus:void 0,createTime:[]}),o=b(),w=b([]),d=async()=>{v.value=!0;try{const s=await T.getImagePage(p);I.value=s.list,m.value=s.total}finally{v.value=!1}},g=()=>{p.pageNo=1,d()};N(async()=>{d(),w.value=await me()});const h={message:f,t:a,loading:v,list:I,total:m,queryParams:p,queryFormRef:o,userList:w,getList:d,handleQuery:g,resetQuery:()=>{o.value.resetFields(),g()},handleDelete:async s=>{try{await f.delConfirm(),await T.deleteImage(s),f.success(a("common.delSuccess")),await d()}catch{}},handleUpdatePublicStatusChange:async s=>{try{const u=s.publicStatus?"\u516C\u5F00":"\u79C1\u6709";await f.confirm('\u786E\u8BA4\u8981"'+u+'"\u8BE5\u56FE\u7247\u5417?'),await T.updateImage({id:s.id,publicStatus:s.publicStatus}),await d()}catch{s.publicStatus=!s.publicStatus}},get getIntDictOptions(){return R},get DICT_TYPE(){return Q},get getStrDictOptions(){return z},get getBoolDictOptions(){return G},get dateFormatter(){return de},get AiImageStatusEnum(){return ce}};return Object.defineProperty(h,"__isScriptSetup",{enumerable:!1,value:!0}),h}}),[["render",function(q,r,f,a,v,I){const m=X,p=$,o=W,w=Z,d=ee,g=ae,h=le,s=pe,u=te,D=ne,x=oe,V=re,C=ue,A=ie,k=H("hasPermi"),E=se;return i(),_(y,null,[l(s,null,{default:t(()=>[l(h,{class:"-mb-15px",model:a.queryParams,ref:"queryFormRef",inline:!0,"label-width":"68px"},{default:t(()=>[l(o,{label:"\u7528\u6237\u7F16\u53F7",prop:"userId"},{default:t(()=>[l(p,{modelValue:a.queryParams.userId,"onUpdate:modelValue":r[0]||(r[0]=e=>a.queryParams.userId=e),clearable:"",placeholder:"\u8BF7\u8F93\u5165\u7528\u6237\u7F16\u53F7",class:"!w-240px"},{default:t(()=>[(i(!0),_(y,null,S(a.userList,e=>(i(),c(m,{key:e.id,label:e.nickname,value:e.id},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1}),l(o,{label:"\u5E73\u53F0",prop:"platform"},{default:t(()=>[l(p,{modelValue:a.queryParams.status,"onUpdate:modelValue":r[1]||(r[1]=e=>a.queryParams.status=e),placeholder:"\u8BF7\u9009\u62E9\u5E73\u53F0",clearable:"",class:"!w-240px"},{default:t(()=>[(i(!0),_(y,null,S(a.getStrDictOptions(a.DICT_TYPE.AI_PLATFORM),e=>(i(),c(m,{key:e.value,label:e.label,value:e.value},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1}),l(o,{label:"\u7ED8\u753B\u72B6\u6001",prop:"status"},{default:t(()=>[l(p,{modelValue:a.queryParams.status,"onUpdate:modelValue":r[2]||(r[2]=e=>a.queryParams.status=e),placeholder:"\u8BF7\u9009\u62E9\u7ED8\u753B\u72B6\u6001",clearable:"",class:"!w-240px"},{default:t(()=>[(i(!0),_(y,null,S(a.getIntDictOptions(a.DICT_TYPE.AI_IMAGE_STATUS),e=>(i(),c(m,{key:e.value,label:e.label,value:e.value},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1}),l(o,{label:"\u662F\u5426\u53D1\u5E03",prop:"publicStatus"},{default:t(()=>[l(p,{modelValue:a.queryParams.publicStatus,"onUpdate:modelValue":r[3]||(r[3]=e=>a.queryParams.publicStatus=e),placeholder:"\u8BF7\u9009\u62E9\u662F\u5426\u53D1\u5E03",clearable:"",class:"!w-240px"},{default:t(()=>[(i(!0),_(y,null,S(a.getBoolDictOptions(a.DICT_TYPE.INFRA_BOOLEAN_STRING),e=>(i(),c(m,{key:e.value,label:e.label,value:e.value},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1}),l(o,{label:"\u521B\u5EFA\u65F6\u95F4",prop:"createTime"},{default:t(()=>[l(w,{modelValue:a.queryParams.createTime,"onUpdate:modelValue":r[4]||(r[4]=e=>a.queryParams.createTime=e),"value-format":"YYYY-MM-DD HH:mm:ss",type:"daterange","start-placeholder":"\u5F00\u59CB\u65E5\u671F","end-placeholder":"\u7ED3\u675F\u65E5\u671F","default-time":[new Date("1 00:00:00"),new Date("1 23:59:59")],class:"!w-240px"},null,8,["modelValue","default-time"])]),_:1}),l(o,null,{default:t(()=>[l(g,{onClick:a.handleQuery},{default:t(()=>[l(d,{icon:"ep:search",class:"mr-5px"}),r[7]||(r[7]=P(" \u641C\u7D22"))]),_:1}),l(g,{onClick:a.resetQuery},{default:t(()=>[l(d,{icon:"ep:refresh",class:"mr-5px"}),r[8]||(r[8]=P(" \u91CD\u7F6E"))]),_:1})]),_:1})]),_:1},8,["model"])]),_:1}),l(s,null,{default:t(()=>[U((i(),c(C,{data:a.list,stripe:!0,"show-overflow-tooltip":!0},{default:t(()=>[l(u,{label:"\u7F16\u53F7",align:"center",prop:"id",width:"180",fixed:"left"}),l(u,{label:"\u56FE\u7247",align:"center",prop:"picUrl",width:"110px",fixed:"left"},{default:t(({row:e})=>{var n;return[((n=e.picUrl)==null?void 0:n.length)>0?(i(),c(D,{key:0,class:"h-80px w-80px",lazy:"",src:e.picUrl,"preview-src-list":[e.picUrl],"preview-teleported":"",fit:"cover"},null,8,["src","preview-src-list"])):j("",!0)]}),_:1}),l(u,{label:"\u7528\u6237",align:"center",prop:"userId",width:"180"},{default:t(e=>{var n;return[J("span",null,K((n=a.userList.find(O=>O.id===e.row.userId))==null?void 0:n.nickname),1)]}),_:1}),l(u,{label:"\u5E73\u53F0",align:"center",prop:"platform",width:"120"},{default:t(e=>[l(x,{type:a.DICT_TYPE.AI_PLATFORM,value:e.row.platform},null,8,["type","value"])]),_:1}),l(u,{label:"\u6A21\u578B",align:"center",prop:"model",width:"180"}),l(u,{label:"\u7ED8\u753B\u72B6\u6001",align:"center",prop:"status",width:"100"},{default:t(e=>[l(x,{type:a.DICT_TYPE.AI_IMAGE_STATUS,value:e.row.status},null,8,["type","value"])]),_:1}),l(u,{label:"\u662F\u5426\u53D1\u5E03",align:"center",prop:"publicStatus"},{default:t(e=>[l(V,{modelValue:e.row.publicStatus,"onUpdate:modelValue":n=>e.row.publicStatus=n,"active-value":!0,"inactive-value":!1,onChange:n=>a.handleUpdatePublicStatusChange(e.row),disabled:e.row.status!==a.AiImageStatusEnum.SUCCESS},null,8,["modelValue","onUpdate:modelValue","onChange","disabled"])]),_:1}),l(u,{label:"\u63D0\u793A\u8BCD",align:"center",prop:"prompt",width:"180"}),l(u,{label:"\u521B\u5EFA\u65F6\u95F4",align:"center",prop:"createTime",formatter:a.dateFormatter,width:"180px"},null,8,["formatter"]),l(u,{label:"\u5BBD\u5EA6",align:"center",prop:"width"}),l(u,{label:"\u9AD8\u5EA6",align:"center",prop:"height"}),l(u,{label:"\u9519\u8BEF\u4FE1\u606F",align:"center",prop:"errorMessage"}),l(u,{label:"\u4EFB\u52A1\u7F16\u53F7",align:"center",prop:"taskId"}),l(u,{label:"\u64CD\u4F5C",align:"center",width:"100",fixed:"right"},{default:t(e=>[U((i(),c(g,{link:"",type:"danger",onClick:n=>a.handleDelete(e.row.id)},{default:t(()=>r[9]||(r[9]=[P(" \u5220\u9664 ")])),_:2},1032,["onClick"])),[[k,["ai:image:delete"]]])]),_:1})]),_:1},8,["data"])),[[E,a.loading]]),l(A,{total:a.total,page:a.queryParams.pageNo,"onUpdate:page":r[5]||(r[5]=e=>a.queryParams.pageNo=e),limit:a.queryParams.pageSize,"onUpdate:limit":r[6]||(r[6]=e=>a.queryParams.pageSize=e),onPagination:a.getList},null,8,["total","page","limit"])]),_:1})],64)}],["__file","/Users/steven/00/500_code/520_github/yudao-ui-admin-vue3/src/views/ai/image/manager/index.vue"]]);export{ge as default};
