import{d as R,r as b,f as C,C as S,aB as v,G as h,aI as T,ew as y,eu as w,_ as O,o as I,c as x,k as t,w as s,I as E,q as D,F as U,v as M,E as Y,l as q,P as L,Q as W,R as N}from"./index-BaY5TDP-.js";import{_ as z}from"./DictTag-QtcI9ZjC.js";import{E as A}from"./el-skeleton-item-BYAIkmCs.js";import{_ as j}from"./Echart-BQxFkezy.js";import{S as k}from"./portrait-CXf55QaH.js";import"./color-BN7ZL7BD.js";import"./echarts-DpbyC_6K.js";const B=O(R({name:"PortraitCustomerIndustry",__name:"PortraitCustomerIndustry",props:{queryParams:{type:null,required:!0}},setup(g,{expose:_}){const p=g,r=b(!1),m=b([]),n=C({title:{text:"\u5168\u90E8\u5BA2\u6237",left:"center"},tooltip:{trigger:"item"},legend:{orient:"vertical",left:"left"},toolbox:{feature:{saveAsImage:{show:!0,name:"\u5168\u90E8\u5BA2\u6237"}}},series:[{name:"\u5168\u90E8\u5BA2\u6237",type:"pie",radius:["40%","70%"],avoidLabelOverlap:!1,itemStyle:{borderRadius:10,borderColor:"#fff",borderWidth:2},label:{show:!1,position:"center"},emphasis:{label:{show:!0,fontSize:40,fontWeight:"bold"}},labelLine:{show:!1},data:[]}]}),i=C({title:{text:"\u6210\u4EA4\u5BA2\u6237",left:"center"},tooltip:{trigger:"item"},legend:{orient:"vertical",left:"left"},toolbox:{feature:{saveAsImage:{show:!0,name:"\u6210\u4EA4\u5BA2\u6237"}}},series:[{name:"\u6210\u4EA4\u5BA2\u6237",type:"pie",radius:["40%","70%"],avoidLabelOverlap:!1,itemStyle:{borderRadius:10,borderColor:"#fff",borderWidth:2},label:{show:!1,position:"center"},emphasis:{label:{show:!0,fontSize:40,fontWeight:"bold"}},labelLine:{show:!1},data:[]}]}),l=async()=>{r.value=!0;const o=await k.getCustomerIndustry(p.queryParams);n.series&&n.series[0]&&n.series[0].data&&(n.series[0].data=o.map(e=>({name:v(h.CRM_CUSTOMER_INDUSTRY,e.industryId),value:e.customerCount}))),i.series&&i.series[0]&&i.series[0].data&&(i.series[0].data=o.map(e=>({name:v(h.CRM_CUSTOMER_INDUSTRY,e.industryId),value:e.dealCount}))),d(o),m.value=o,r.value=!1};_({loadData:l});const d=o=>{if(T(o))return;const e=o,c=y(e.map(a=>a.customerCount)),f=y(e.map(a=>a.dealCount));e.forEach(a=>{a.industryPortion=a.customerCount===0?0:w(a.customerCount,c),a.dealPortion=a.dealCount===0?0:w(a.dealCount,f)})};S(()=>{l()});const u={props:p,loading:r,list:m,echartsOption:n,echartsOption2:i,loadData:l,calculateProportion:d,get DICT_TYPE(){return h}};return Object.defineProperty(u,"__isScriptSetup",{enumerable:!1,value:!0}),u}}),[["render",function(g,_,p,r,m,n){const i=j,l=A,d=M,u=Y,o=q,e=L,c=z,f=W,a=N;return I(),x(U,null,[t(o,{shadow:"never"},{default:s(()=>[t(u,{gutter:20},{default:s(()=>[t(d,{span:12},{default:s(()=>[t(l,{loading:r.loading,animated:""},{default:s(()=>[t(i,{height:500,options:r.echartsOption},null,8,["options"])]),_:1},8,["loading"])]),_:1}),t(d,{span:12},{default:s(()=>[t(l,{loading:r.loading,animated:""},{default:s(()=>[t(i,{height:500,options:r.echartsOption2},null,8,["options"])]),_:1},8,["loading"])]),_:1})]),_:1})]),_:1}),t(o,{class:"mt-16px",shadow:"never"},{default:s(()=>[E((I(),D(f,{data:r.list},{default:s(()=>[t(e,{align:"center",label:"\u5E8F\u53F7",type:"index",width:"80"}),t(e,{align:"center",label:"\u5BA2\u6237\u884C\u4E1A",prop:"industryId",width:"100"},{default:s(P=>[t(c,{type:r.DICT_TYPE.CRM_CUSTOMER_INDUSTRY,value:P.row.industryId},null,8,["type","value"])]),_:1}),t(e,{align:"center",label:"\u5BA2\u6237\u4E2A\u6570","min-width":"200",prop:"customerCount"}),t(e,{align:"center",label:"\u6210\u4EA4\u4E2A\u6570","min-width":"200",prop:"dealCount"}),t(e,{align:"center",label:"\u884C\u4E1A\u5360\u6BD4(%)","min-width":"200",prop:"industryPortion"}),t(e,{align:"center",label:"\u6210\u4EA4\u5360\u6BD4(%)","min-width":"200",prop:"dealPortion"})]),_:1},8,["data"])),[[a,r.loading]])]),_:1})],64)}],["__file","/Users/steven/00/500_code/520_github/yudao-ui-admin-vue3/src/views/crm/statistics/portrait/components/PortraitCustomerIndustry.vue"]]);export{B as default};
