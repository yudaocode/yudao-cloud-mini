import{d as P,r as f,f as x,C as E,G as T,_ as B,o as h,c as $,k as a,w as n,m as b,I as q,q as A,F as D,N as F,aV as I,v as O,E as W,l as k,P as z,Q as N,R as U}from"./index-BaY5TDP-.js";import{_ as Y}from"./DictTag-QtcI9ZjC.js";import{E as j}from"./el-skeleton-item-BYAIkmCs.js";import{_ as R}from"./Echart-BQxFkezy.js";import{S as y}from"./funnel-B8h2f-tZ.js";import"./color-BN7ZL7BD.js";import"./echarts-DpbyC_6K.js";const V=B(P({name:"FunnelBusiness",__name:"FunnelBusiness",props:{queryParams:{type:null,required:!0}},setup(v,{expose:t}){const o=v,s=f(!0),r=f(!1),p=f([]),l=x({title:{text:"\u9500\u552E\u6F0F\u6597"},tooltip:{trigger:"item",formatter:"{a} <br/>{b}"},toolbox:{feature:{dataView:{readOnly:!1},restore:{},saveAsImage:{}}},legend:{data:["\u5BA2\u6237","\u5546\u673A","\u8D62\u5355"]},series:[{name:"\u9500\u552E\u6F0F\u6597",type:"funnel",left:"10%",top:60,bottom:60,width:"80%",min:0,max:100,minSize:"0%",maxSize:"100%",sort:"descending",gap:2,label:{show:!0,position:"inside"},labelLine:{length:10,lineStyle:{width:1,type:"solid"}},itemStyle:{borderColor:"#fff",borderWidth:1},emphasis:{label:{fontSize:20}},data:[{value:60,name:"\u5BA2\u6237-0\u4E2A"},{value:40,name:"\u5546\u673A-0\u4E2A"},{value:20,name:"\u8D62\u5355-0\u4E2A"}]}]}),u=async()=>{r.value=!0;const e=await y.getFunnelSummary(o.queryParams);if(e&&l.series&&l.series[0]&&l.series[0].data){const i=[];s.value?(i.push({value:60,name:`\u5BA2\u6237-${e.customerCount||0}\u4E2A`}),i.push({value:40,name:`\u5546\u673A-${e.businessCount||0}\u4E2A`}),i.push({value:20,name:`\u8D62\u5355-${e.businessWinCount||0}\u4E2A`})):(i.push({value:e.customerCount||0,name:`\u5BA2\u6237-${e.customerCount||0}\u4E2A`}),i.push({value:e.businessCount||0,name:`\u5546\u673A-${e.businessCount||0}\u4E2A`}),i.push({value:e.businessWinCount||0,name:`\u8D62\u5355-${e.businessWinCount||0}\u4E2A`})),l.series[0].data=i}p.value=await y.getBusinessSummaryByEndStatus(o.queryParams),r.value=!1};t({loadData:u}),E(()=>{u()});const d={props:o,active:s,loading:r,list:p,echartsOption:l,handleActive:async e=>{s.value=e,await u()},loadData:u,get DICT_TYPE(){return T}};return Object.defineProperty(d,"__isScriptSetup",{enumerable:!1,value:!0}),d}}),[["render",function(v,t,o,s,r,p){const l=F,u=I,d=R,e=j,i=O,g=W,_=k,m=z,S=Y,C=N,w=U;return h(),$(D,null,[a(_,{shadow:"never"},{default:n(()=>[a(g,null,{default:n(()=>[a(i,{span:24},{default:n(()=>[a(u,{class:"mb-10px"},{default:n(()=>[a(l,{type:"primary",onClick:t[0]||(t[0]=c=>s.handleActive(!0))},{default:n(()=>t[2]||(t[2]=[b("\u5BA2\u6237\u89C6\u89D2")])),_:1}),a(l,{type:"primary",onClick:t[1]||(t[1]=c=>s.handleActive(!1))},{default:n(()=>t[3]||(t[3]=[b("\u52A8\u6001\u89C6\u89D2")])),_:1})]),_:1}),a(e,{loading:s.loading,animated:""},{default:n(()=>[a(d,{height:500,options:s.echartsOption},null,8,["options"])]),_:1},8,["loading"])]),_:1})]),_:1})]),_:1}),a(_,{class:"mt-16px",shadow:"never"},{default:n(()=>[q((h(),A(C,{data:s.list},{default:n(()=>[a(m,{align:"center",label:"\u5E8F\u53F7",type:"index",width:"80"}),a(m,{align:"center",label:"\u9636\u6BB5",prop:"endStatus",width:"200"},{default:n(c=>[a(S,{type:s.DICT_TYPE.CRM_BUSINESS_END_STATUS_TYPE,value:c.row.endStatus},null,8,["type","value"])]),_:1}),a(m,{align:"center",label:"\u5546\u673A\u6570","min-width":"200",prop:"businessCount"}),a(m,{align:"center",label:"\u5546\u673A\u603B\u91D1\u989D(\u5143)","min-width":"200",prop:"totalPrice"})]),_:1},8,["data"])),[[w,s.loading]])]),_:1})],64)}],["__file","/Users/steven/00/500_code/520_github/yudao-ui-admin-vue3/src/views/crm/statistics/funnel/components/FunnelBusiness.vue"]]);export{V as default};
