import{d as h,r as g,_ as v,o as a,c as r,k as n,w as p,F as f,n as b,q as _,t as i,ah as k,z as C}from"./index-BaY5TDP-.js";import{E as I,a as j}from"./el-carousel-item-DPhEMio2.js";import{E as w}from"./el-image-Bg-CwbDE.js";const E=h({name:"Carousel",__name:"index",props:{property:{type:Object,required:!0}},setup(l,{expose:o}){o();const e=g(0),t={currentIndex:e,handleIndexChange:s=>{e.value=s+1}};return Object.defineProperty(t,"__isScriptSetup",{enumerable:!1,value:!0}),t}}),q={key:0,class:"h-250px flex items-center justify-center bg-gray-3"},O={key:1,class:"relative"},S={key:0,class:"absolute bottom-10px right-10px rounded-xl bg-black p-x-8px p-y-2px text-10px text-white opacity-40"},U=v(E,[["render",function(l,o,e,t,s,z){const c=C,u=w,d=I,y=j;return e.property.items.length===0?(a(),r("div",q,[n(c,{icon:"tdesign:image",class:"text-gray-8 text-120px!"})])):(a(),r("div",O,[n(y,{height:"174px",type:e.property.type==="card"?"card":"",autoplay:e.property.autoplay,interval:1e3*e.property.interval,"indicator-position":e.property.indicator==="number"?"none":void 0,onChange:t.handleIndexChange},{default:p(()=>[(a(!0),r(f,null,b(e.property.items,(x,m)=>(a(),_(d,{key:m},{default:p(()=>[n(u,{class:"h-full w-full",src:x.imgUrl},null,8,["src"])]),_:2},1024))),128))]),_:1},8,["type","autoplay","interval","indicator-position"]),e.property.indicator==="number"?(a(),r("div",S,i(t.currentIndex)+" / "+i(e.property.items.length),1)):k("",!0)]))}],["__file","/Users/steven/00/500_code/520_github/yudao-ui-admin-vue3/src/components/DiyEditor/components/mobile/Carousel/index.vue"]]);export{U as default};
