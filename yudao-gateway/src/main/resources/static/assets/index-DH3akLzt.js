import{bz as k,d as A,D as j,r as u,_ as O,X as F,o as M,c as U,k as p,w as _,I as E,j as x,t as R,q as N,m as V,F as $,L as B,O as H,N as W,R as z}from"./index-BaY5TDP-.js";import{_ as Q}from"./ContentWrap-DKQn7kZm.js";import{_ as X}from"./index-BAz6Gqim.js";import G from"./main-DuOfDTOL.js";import J from"./MenuEditor-hAlITm0x.js";import K from"./MenuPreviewer-C5I_AE-4.js";import{h as Y}from"./tree-z7HkrWVC.js";import"./index-C1v7IUC9.js";import"./tagsView-lnAkwTv2.js";import"./main-US54NKSx.js";import"./TabNews-CsSL-hHj.js";import"./main-BdcmYikv.js";import"./el-image-Bg-CwbDE.js";import"./main-KjNEjHxK.js";import"./index-avjYFQiD.js";import"./index-DrSdAlug.js";import"./main-BdArqmip.js";import"./main-DeQxN6ve.js";import"./index-Ci6jvA8Q.js";import"./index-D0l0uLV-.js";import"./formatTime-Dr6TiYYc.js";import"./TabText-BH6wUfdj.js";import"./TabImage-dEaedJeg.js";import"./useUpload-Dg-sFRn3.js";import"./TabVoice-C2wi4dha.js";import"./TabVideo-DsHofe_N.js";import"./TabMusic-B3V30vcB.js";import"./vuedraggable.umd-CVSuxhJW.js";const C="__MENU_NOT_SELECTED__";var q=(y=>(y.Undefined="0",y.Parent="1",y.Child="2",y))(q||{});const Z={class:"clearfix public-account-management"},ee={class:"left"},le={class:"weixin-hd"},ae={class:"weixin-title"},te={class:"clearfix weixin-menu"},ne={class:"save_div"},re={key:0,class:"right"},ue={key:1,class:"right"},ie=O(A({name:"MpMenu",__name:"index",setup(y,{expose:n}){n();const c=j(),a=u(!1),h=u(-1),w=u(""),m=u([]),v=u(C),g=u(-1),o=u(!1),f=u(!0),s=u({}),r=u({grand:"0",x:0,y:0}),i=u(!1),d=async()=>{a.value=!1;try{const e=await(t=>k.get({url:"/mp/menu/list?accountId="+t}))(h.value),l=S(e);m.value=Y(l,"id")}finally{a.value=!1}},b=()=>{L(),d()},S=e=>{if(!e)return[];const l=[];return e.forEach(t=>{const I={...t};I.reply={type:t.replyMessageType,accountId:t.accountId,content:t.replyContent,mediaId:t.replyMediaId,url:t.replyMediaUrl,title:t.replyTitle,description:t.replyDescription,thumbMediaId:t.replyThumbMediaId,thumbMediaUrl:t.replyThumbMediaUrl,articles:t.replyArticles,musicUrl:t.replyMusicUrl,hqMusicUrl:t.replyHqMusicUrl},l.push(I)}),l},L=()=>{v.value=C,g.value=-1,o.value=!1,s.value={},r.value={grand:"0",x:0,y:0},i.value=!1},D=()=>{const e=[];return m.value.forEach(l=>{const t=T(l);e.push(t),!l.children||l.children.length<=0||(t.children=[],l.children.forEach(I=>{t.children.push(T(I))}))}),e},T=e=>{let l={...e,children:void 0,reply:void 0};return l.replyMessageType=e.reply.type,l.replyContent=e.reply.content,l.replyMediaId=e.reply.mediaId,l.replyMediaUrl=e.reply.url,l.replyTitle=e.reply.title,l.replyDescription=e.reply.description,l.replyThumbMediaId=e.reply.thumbMediaId,l.replyThumbMediaUrl=e.reply.thumbMediaUrl,l.replyArticles=e.reply.articles,l.replyMusicUrl=e.reply.musicUrl,l.replyHqMusicUrl=e.reply.hqMusicUrl,l},P={message:c,MENU_NOT_SELECTED:C,loading:a,accountId:h,accountName:w,menuList:m,activeIndex:v,parentIndex:g,showRightPanel:o,isParent:f,activeMenu:s,Level:q,tempSelfObj:r,dialogNewsVisible:i,onAccountChanged:(e,l)=>{h.value=e,w.value=l,d()},getList:d,handleQuery:b,menuListToFrontend:S,resetForm:L,menuClicked:(e,l)=>{o.value=!0,s.value=e,r.value.grand="1",r.value.x=l,f.value=!0,v.value=`${l}`,g.value=l},subMenuClicked:(e,l,t)=>{o.value=!0,s.value=e,r.value.grand="2",r.value.x=l,r.value.y=t,f.value=!1,v.value=`${l}-${t}`},onDeleteMenu:async()=>{var e;try{await c.confirm("\u786E\u5B9A\u8981\u5220\u9664\u5417?"),r.value.grand==="1"?m.value.splice(r.value.x,1):r.value.grand==="2"&&((e=m.value[r.value.x].children)==null||e.splice(r.value.y,1)),c.notifySuccess("\u5220\u9664\u6210\u529F"),s.value={},o.value=!1,v.value=C}catch{}},onSave:async()=>{try{await c.confirm("\u786E\u5B9A\u8981\u4FDD\u5B58\u5417?"),a.value=!0,await((e,l)=>k.post({url:"/mp/menu/save",data:{accountId:e,menus:l}}))(h.value,D()),d(),c.notifySuccess("\u53D1\u5E03\u6210\u529F")}finally{a.value=!1}},onClear:async()=>{try{await c.confirm("\u786E\u5B9A\u8981\u5220\u9664\u5417?"),a.value=!0,await(e=>k.delete({url:"/mp/menu/delete?accountId="+e}))(h.value),b(),c.notifySuccess("\u6E05\u7A7A\u6210\u529F")}finally{a.value=!1}},menuListToBackend:D,menuToBackend:T,get WxAccountSelect(){return G},MenuEditor:J,MenuPreviewer:K};return Object.defineProperty(P,"__isScriptSetup",{enumerable:!1,value:!0}),P}}),[["render",function(y,n,c,a,h,w){const m=X,v=B,g=H,o=Q,f=W,s=F("hasPermi"),r=z;return M(),U($,null,[p(m,{title:"\u516C\u4F17\u53F7\u83DC\u5355",url:"https://doc.iocoder.cn/mp/menu/"}),p(o,null,{default:_(()=>[p(g,{class:"-mb-15px",ref:"queryFormRef",inline:!0,"label-width":"68px"},{default:_(()=>[p(v,{label:"\u516C\u4F17\u53F7",prop:"accountId"},{default:_(()=>[p(a.WxAccountSelect,{onChange:a.onAccountChanged})]),_:1})]),_:1},512)]),_:1}),p(o,null,{default:_(()=>[E((M(),U("div",Z,[x("div",ee,[x("div",le,[x("div",ae,R(a.accountName),1)]),x("div",te,[p(a.MenuPreviewer,{modelValue:a.menuList,"onUpdate:modelValue":n[0]||(n[0]=i=>a.menuList=i),"account-id":a.accountId,"active-index":a.activeIndex,"parent-index":a.parentIndex,onMenuClicked:n[1]||(n[1]=(i,d)=>a.menuClicked(i,d)),onSubmenuClicked:n[2]||(n[2]=(i,d,b)=>a.subMenuClicked(i,d,b))},null,8,["modelValue","account-id","active-index","parent-index"])]),x("div",ne,[E((M(),N(f,{class:"save_btn",type:"success",onClick:a.onSave},{default:_(()=>n[4]||(n[4]=[V("\u4FDD\u5B58\u5E76\u53D1\u5E03\u83DC\u5355")])),_:1})),[[s,["mp:menu:save"]]]),E((M(),N(f,{class:"save_btn",type:"danger",onClick:a.onClear},{default:_(()=>n[5]||(n[5]=[V("\u6E05\u7A7A\u83DC\u5355")])),_:1})),[[s,["mp:menu:delete"]]])])]),a.showRightPanel?(M(),U("div",re,[p(a.MenuEditor,{"account-id":a.accountId,"is-parent":a.isParent,modelValue:a.activeMenu,"onUpdate:modelValue":n[3]||(n[3]=i=>a.activeMenu=i),onDelete:a.onDeleteMenu},null,8,["account-id","is-parent","modelValue"])])):(M(),U("div",ue,n[6]||(n[6]=[x("p",null,"\u8BF7\u9009\u62E9\u83DC\u5355\u914D\u7F6E",-1)])))])),[[r,a.loading]])]),_:1})],64)}],["__scopeId","data-v-e74cfd0c"],["__file","/Users/steven/00/500_code/520_github/yudao-ui-admin-vue3/src/views/mp/menu/index.vue"]]);export{ie as default};
