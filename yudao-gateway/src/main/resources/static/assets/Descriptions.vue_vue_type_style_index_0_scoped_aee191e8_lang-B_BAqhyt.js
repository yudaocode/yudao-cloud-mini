import{d as y,p as t,$ as _,b as d,bt as C,cJ as O,r as h,a0 as j,cv as v,a as P}from"./index-BaY5TDP-.js";const S=y({name:"Descriptions",__name:"Descriptions",props:{title:t.string.def(""),message:t.string.def(""),collapse:t.bool.def(!0),columns:t.number.def(1),schema:{type:Array,default:()=>[]},data:{type:Object,default:()=>({})}},setup(f,{expose:u}){u();const l=_(),m=d(()=>l.getMobile),i=C(),g=O(),a=f,{getPrefixCls:n}=j(),b=n("descriptions"),x=d(()=>{const o=["title","message","collapse","schema","data","class"],s={...i,...a};for(const e in s)o.indexOf(e)!==-1&&delete s[e];return s}),r=h(!0),c={appStore:l,mobile:m,attrs:i,slots:g,props:a,getPrefixCls:n,prefixCls:b,getBindValue:x,getBindItemValue:o=>{const s=["field"],e={...o};for(const p in e)s.indexOf(p)!==-1&&delete e[p];return e},show:r,toggleClick:()=>{a.collapse&&(r.value=!P(r))},get dayjs(){return v}};return Object.defineProperty(c,"__isScriptSetup",{enumerable:!1,value:!0}),c}});export{S as _};
