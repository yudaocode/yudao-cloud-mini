const n={TONG_YI:"TongYi",YI_YAN:"YiYan",DEEP_SEEK:"DeepSeek",ZHI_PU:"ZhiPu",XING_HUO:"XingHuo",OPENAI:"OpenAI",Ollama:"Ollama",STABLE_DIFFUSION:"StableDiffusion",MIDJOURNEY:"Midjourney",SUNO:"Suno"},i=[{key:n.TONG_YI,name:"\u901A\u4E49\u4E07\u76F8"},{key:n.YI_YAN,name:"\u767E\u5EA6\u5343\u5E06"},{key:n.ZHI_PU,name:"\u667A\u8C31 AI"}],t={IN_PROGRESS:10,SUCCESS:20,FAIL:30},o={IN_PROGRESS:10,SUCCESS:20,FAIL:30};var a=(e=>(e[e.WRITING=1]="WRITING",e[e.REPLY=2]="REPLY",e))(a||{});const l=["\u4E2D\u56FD\u65D7\u888D","\u53E4\u88C5\u7F8E\u5973","\u5361\u901A\u5934\u50CF","\u673A\u7532\u6218\u58EB","\u7AE5\u8BDD\u5C0F\u5C4B","\u4E2D\u56FD\u957F\u57CE"],m=["Chinese Cheongsam","Ancient Beauty","Cartoon Avatar","Mech Warrior","Fairy Tale Cottage","The Great Wall of China"],c=[{key:"DDIM",name:"DDIM"},{key:"DDPM",name:"DDPM"},{key:"K_DPMPP_2M",name:"K_DPMPP_2M"},{key:"K_DPMPP_2S_ANCESTRAL",name:"K_DPMPP_2S_ANCESTRAL"},{key:"K_DPM_2",name:"K_DPM_2"},{key:"K_DPM_2_ANCESTRAL",name:"K_DPM_2_ANCESTRAL"},{key:"K_EULER",name:"K_EULER"},{key:"K_EULER_ANCESTRAL",name:"K_EULER_ANCESTRAL"},{key:"K_HEUN",name:"K_HEUN"},{key:"K_LMS",name:"K_LMS"}],s=[{key:"3d-model",name:"3d-model"},{key:"analog-film",name:"analog-film"},{key:"anime",name:"anime"},{key:"cinematic",name:"cinematic"},{key:"comic-book",name:"comic-book"},{key:"digital-art",name:"digital-art"},{key:"enhance",name:"enhance"},{key:"fantasy-art",name:"fantasy-art"},{key:"isometric",name:"isometric"},{key:"line-art",name:"line-art"},{key:"low-poly",name:"low-poly"},{key:"modeling-compound",name:"modeling-compound"},{key:"neon-punk",name:"neon-punk"},{key:"origami",name:"origami"},{key:"photographic",name:"photographic"},{key:"pixel-art",name:"pixel-art"},{key:"tile-texture",name:"tile-texture"}],y=[{key:"wanx-v1",name:"wanx-v1"},{key:"wanx-sketch-to-image-v1",name:"wanx-sketch-to-image-v1"}],d=[{key:"sd_xl",name:"sd_xl"}],k=[{key:"cogview-3",name:"cogview-3"}],r=[{key:"NONE",name:"NONE"},{key:"FAST_BLUE",name:"FAST_BLUE"},{key:"FAST_GREEN",name:"FAST_GREEN"},{key:"SIMPLE",name:"SIMPLE"},{key:"SLOW",name:"SLOW"},{key:"SLOWER",name:"SLOWER"},{key:"SLOWEST",name:"SLOWEST"}],g=[{key:"dall-e-3",name:"DALL\xB7E 3",image:"/src/assets/ai/dall2.jpg"},{key:"dall-e-2",name:"DALL\xB7E 2",image:"/src/assets/ai/dall3.jpg"}],h=[{key:"vivid",name:"\u6E05\u6670",image:"/src/assets/ai/qingxi.jpg"},{key:"natural",name:"\u81EA\u7136",image:"/src/assets/ai/ziran.jpg"}],u=[{key:"1024x1024",name:"1:1",width:"1024",height:"1024",style:"width: 30px; height: 30px;background-color: #dcdcdc;"},{key:"1024x1792",name:"3:5",width:"1024",height:"1792",style:"width: 30px; height: 50px;background-color: #dcdcdc;"},{key:"1792x1024",name:"5:3",width:"1792",height:"1024",style:"width: 50px; height: 30px;background-color: #dcdcdc;"}],p=[{key:"midjourney",name:"MJ",image:"https://bigpt8.com/pc/_nuxt/mj.34a61377.png"},{key:"niji",name:"NIJI",image:"https://bigpt8.com/pc/_nuxt/nj.ca79b143.png"}],S=[{key:"1:1",width:"1",height:"1",style:"width: 30px; height: 30px;background-color: #dcdcdc;"},{key:"3:4",width:"3",height:"4",style:"width: 30px; height: 40px;background-color: #dcdcdc;"},{key:"4:3",width:"4",height:"3",style:"width: 40px; height: 30px;background-color: #dcdcdc;"},{key:"9:16",width:"9",height:"16",style:"width: 30px; height: 50px;background-color: #dcdcdc;"},{key:"16:9",width:"16",height:"9",style:"width: 50px; height: 30px;background-color: #dcdcdc;"}],E=[{value:"6.0",label:"v6.0"},{value:"5.2",label:"v5.2"},{value:"5.1",label:"v5.1"},{value:"5.0",label:"v5.0"},{value:"4.0",label:"v4.0"}],_=[{value:"5",label:"v5"}],M={write:{prompt:"vue",data:`Vue.js \u662F\u4E00\u79CD\u7528\u4E8E\u6784\u5EFA\u7528\u6237\u754C\u9762\u7684\u6E10\u8FDB\u5F0F JavaScript \u6846\u67B6\u3002\u5B83\u7684\u6838\u5FC3\u5E93\u53EA\u5173\u6CE8\u89C6\u56FE\u5C42\uFF0C\u6613\u4E8E\u4E0A\u624B\uFF0C\u540C\u65F6\u4E5F\u4FBF\u4E8E\u4E0E\u5176\u4ED6\u5E93\u6216\u5DF2\u6709\u9879\u76EE\u6574\u5408\u3002

Vue.js \u7684\u7279\u70B9\u5305\u62EC\uFF1A
- \u54CD\u5E94\u5F0F\u7684\u6570\u636E\u7ED1\u5B9A\uFF1AVue.js \u4F1A\u81EA\u52A8\u5C06\u6570\u636E\u4E0E DOM \u540C\u6B65\uFF0C\u4F7F\u5F97\u72B6\u6001\u7BA1\u7406\u53D8\u5F97\u66F4\u52A0\u7B80\u5355\u3002
- \u7EC4\u4EF6\u5316\uFF1AVue.js \u5141\u8BB8\u5F00\u53D1\u8005\u901A\u8FC7\u5C0F\u578B\u3001\u72EC\u7ACB\u548C\u901A\u5E38\u53EF\u590D\u7528\u7684\u7EC4\u4EF6\u6784\u5EFA\u5927\u578B\u5E94\u7528\u3002
- \u865A\u62DF DOM\uFF1AVue.js \u4F7F\u7528\u865A\u62DF DOM \u5B9E\u73B0\u5FEB\u901F\u6E32\u67D3\uFF0C\u63D0\u9AD8\u4E86\u6027\u80FD\u3002

\u5728 Vue.js \u4E2D\uFF0C\u4E00\u4E2A\u5178\u578B\u7684\u5E94\u7528\u7ED3\u6784\u53EF\u80FD\u5305\u62EC\uFF1A
1. \u6839\u5B9E\u4F8B\uFF1A\u6BCF\u4E2A Vue \u5E94\u7528\u90FD\u9700\u8981\u4E00\u4E2A\u6839\u5B9E\u4F8B\u4F5C\u4E3A\u5165\u53E3\u70B9\u3002
2. \u7EC4\u4EF6\u7CFB\u7EDF\uFF1A\u53EF\u4EE5\u521B\u5EFA\u81EA\u5B9A\u4E49\u7684\u53EF\u590D\u7528\u7EC4\u4EF6\u3002
3. \u6307\u4EE4\uFF1A\u7279\u6B8A\u7684\u5E26\u6709\u524D\u7F00 v- \u7684\u5C5E\u6027\uFF0C\u4E3A DOM \u5143\u7D20\u63D0\u4F9B\u7279\u6B8A\u7684\u884C\u4E3A\u3002
4. \u63D2\u503C\uFF1A\u7528\u4E8E\u6587\u672C\u5185\u5BB9\uFF0C\u5C06\u6570\u636E\u52A8\u6001\u5730\u63D2\u5165\u5230 HTML\u3002
5. \u8BA1\u7B97\u5C5E\u6027\u548C\u4FA6\u542C\u5668\uFF1A\u7528\u4E8E\u5904\u7406\u6570\u636E\u7684\u590D\u6742\u903B\u8F91\u548C\u54CD\u5E94\u6570\u636E\u53D8\u5316\u3002
6. \u6761\u4EF6\u6E32\u67D3\uFF1A\u6839\u636E\u6761\u4EF6\u51B3\u5B9A\u5143\u7D20\u7684\u6E32\u67D3\u3002
7. \u5217\u8868\u6E32\u67D3\uFF1A\u7528\u4E8E\u663E\u793A\u5217\u8868\u6570\u636E\u3002
8. \u4E8B\u4EF6\u5904\u7406\uFF1A\u54CD\u5E94\u7528\u6237\u4EA4\u4E92\u3002
9. \u8868\u5355\u8F93\u5165\u7ED1\u5B9A\uFF1A\u5904\u7406\u8868\u5355\u8F93\u5165\u548C\u9A8C\u8BC1\u3002
10. \u7EC4\u4EF6\u751F\u547D\u5468\u671F\u94A9\u5B50\uFF1A\u5728\u7EC4\u4EF6\u7684\u4E0D\u540C\u9636\u6BB5\u6267\u884C\u7279\u5B9A\u7684\u51FD\u6570\u3002

Vue.js \u8FD8\u63D0\u4F9B\u4E86\u5B98\u65B9\u7684\u8DEF\u7531\u5668 Vue Router \u548C\u72B6\u6001\u7BA1\u7406\u5E93 Vuex\uFF0C\u4EE5\u652F\u6301\u6784\u5EFA\u590D\u6742\u7684\u5355\u9875\u5E94\u7528\uFF08SPA\uFF09\u3002

\u5728\u5F00\u53D1\u8FC7\u7A0B\u4E2D\uFF0C\u5F00\u53D1\u8005\u901A\u5E38\u4F1A\u4F7F\u7528 Vue CLI\uFF0C\u8FD9\u662F\u4E00\u4E2A\u5F3A\u5927\u7684\u547D\u4EE4\u884C\u5DE5\u5177\uFF0C\u7528\u4E8E\u5FEB\u901F\u751F\u6210 Vue \u9879\u76EE\u811A\u624B\u67B6\uFF0C\u96C6\u6210\u4E86\u8BF8\u5982 Babel\u3001Webpack \u7B49\u73B0\u4EE3\u524D\u7AEF\u5DE5\u5177\uFF0C\u4EE5\u53CA\u70ED\u91CD\u8F7D\u3001\u4EE3\u7801\u68C0\u6D4B\u7B49\u5F00\u53D1\u4F53\u9A8C\u4F18\u5316\u529F\u80FD\u3002

Vue.js \u7684\u751F\u6001\u7CFB\u7EDF\u8FD8\u5305\u62EC\u5927\u91CF\u7684\u7B2C\u4E09\u65B9\u5E93\u548C\u63D2\u4EF6\uFF0C\u5982 Vuetify\uFF08UI \u7EC4\u4EF6\u5E93\uFF09\u3001Vue Test Utils\uFF08\u6D4B\u8BD5\u5DE5\u5177\uFF09\u7B49\uFF0C\u8FD9\u4E9B\u90FD\u6781\u5927\u5730\u4E30\u5BCC\u4E86 Vue.js \u7684\u5F00\u53D1\u751F\u6001\u3002

\u603B\u7684\u6765\u8BF4\uFF0CVue.js \u662F\u4E00\u4E2A\u7075\u6D3B\u3001\u9AD8\u6548\u7684\u524D\u7AEF\u6846\u67B6\uFF0C\u9002\u5408\u4ECE\u5C0F\u578B\u9879\u76EE\u5230\u5927\u578B\u4F01\u4E1A\u7EA7\u5E94\u7528\u7684\u5F00\u53D1\u3002\u5B83\u7684\u6613\u7528\u6027\u3001\u7075\u6D3B\u6027\u548C\u5F3A\u5927\u7684\u793E\u533A\u652F\u6301\u4F7F\u5176\u6210\u4E3A\u8BB8\u591A\u5F00\u53D1\u8005\u7684\u9996\u9009\u6846\u67B6\u4E4B\u4E00\u3002`},reply:{originalContent:"\u9886\u5BFC\uFF0C\u6211\u60F3\u8BF7\u5047",prompt:"\u4E0D\u6279",data:`\u60A8\u7684\u8BF7\u5047\u7533\u8BF7\u5DF2\u6536\u6089\uFF0C\u7ECF\u6838\u5B9E\u548C\u8003\u8651\uFF0C\u6682\u65F6\u65E0\u6CD5\u6279\u51C6\u60A8\u7684\u8BF7\u5047\u7533\u8BF7\u3002

\u5982\u6709\u7279\u6B8A\u60C5\u51B5\u6216\u7D27\u6025\u4E8B\u52A1\uFF0C\u8BF7\u53CA\u65F6\u4E0E\u6211\u8054\u7CFB\u3002

\u795D\u5DE5\u4F5C\u987A\u5229\u3002

\u8C22\u8C22\u3002`}},L=`# Java \u6280\u672F\u6808

## \u6838\u5FC3\u6280\u672F
### Java SE
### Java EE

## \u6846\u67B6
### Spring
#### Spring Boot
#### Spring MVC
#### Spring Data
### Hibernate
### MyBatis

## \u6784\u5EFA\u5DE5\u5177
### Maven
### Gradle

## \u7248\u672C\u63A7\u5236
### Git
### SVN

## \u6D4B\u8BD5\u5DE5\u5177
### JUnit
### Mockito
### Selenium

## \u5E94\u7528\u670D\u52A1\u5668
### Tomcat
### Jetty
### WildFly

## \u6570\u636E\u5E93
### MySQL
### PostgreSQL
### Oracle
### MongoDB

## \u6D88\u606F\u961F\u5217
### Kafka
### RabbitMQ
### ActiveMQ

## \u5FAE\u670D\u52A1
### Spring Cloud
### Dubbo

## \u5BB9\u5668\u5316
### Docker
### Kubernetes

## \u4E91\u670D\u52A1
### AWS
### Azure
### Google Cloud

## \u5F00\u53D1\u5DE5\u5177
### IntelliJ IDEA
### Eclipse
### Visual Studio Code`;export{t as A,k as C,h as D,l as I,E as M,_ as N,i as O,d as Q,r as S,y as T,M as W,n as a,c as b,s as c,u as d,g as e,S as f,p as g,m as h,L as i,o as j,a as k};
