import{bz as s}from"./index-BaY5TDP-.js";import{f as a}from"./formatTime-Dr6TiYYc.js";const m=()=>s.get({url:"/statistics/trade/summary"}),o=t=>s.get({url:"/statistics/trade/analyse",params:r(t)}),c=t=>s.get({url:"/statistics/trade/list",params:r(t)}),d=t=>s.download({url:"/statistics/trade/export-excel",params:r(t)}),l=async()=>await s.get({url:"/statistics/trade/order-count"}),n=async()=>await s.get({url:"/statistics/trade/order-comparison"}),p=(t,e,i)=>s.get({url:"/statistics/trade/order-count-trend",params:{type:t,beginTime:a(e),endTime:a(i)}}),r=t=>({times:[a(t.times[0]),a(t.times[1])]});export{p as a,n as b,m as c,o as d,c as e,d as f,l as g};
