import{d as r}from"./formatTime-Dr6TiYYc.js";import{g as o,f as l,G as a}from"./index-BaY5TDP-.js";import{r as e}from"./formRules-CMjZInfO.js";import{u as t}from"./useCrudSchemas-BQxlWSsn.js";const{t:s}=o(),i=l({mail:[{required:!0,message:s("profile.rules.mail"),trigger:"blur"},{type:"email",message:s("profile.rules.truemail"),trigger:["blur","change"]}],username:[e],password:[e],host:[e],port:[e],sslEnable:[e],starttlsEnable:[e]}),m=l([{label:"\u90AE\u7BB1",field:"mail",isSearch:!0,search:{componentProps:{style:{width:"240px"}}}},{label:"\u7528\u6237\u540D",field:"username",isSearch:!0,search:{componentProps:{style:{width:"240px"}}}},{label:"\u5BC6\u7801",field:"password",isTable:!1},{label:"SMTP \u670D\u52A1\u5668\u57DF\u540D",field:"host"},{label:"SMTP \u670D\u52A1\u5668\u7AEF\u53E3",field:"port",form:{component:"InputNumber",value:465}},{label:"\u662F\u5426\u5F00\u542F SSL",field:"sslEnable",dictType:a.INFRA_BOOLEAN_STRING,dictClass:"boolean",form:{component:"Radio"}},{label:"\u662F\u5426\u5F00\u542F STARTTLS",field:"starttlsEnable",dictType:a.INFRA_BOOLEAN_STRING,dictClass:"boolean",form:{component:"Radio"}},{label:"\u521B\u5EFA\u65F6\u95F4",field:"createTime",isForm:!1,formatter:r,detail:{dateFormat:"YYYY-MM-DD HH:mm:ss"}},{label:"\u64CD\u4F5C",field:"action",isForm:!1,isDetail:!1}]),{allSchemas:d}=t(m);export{d as a,i as r};
