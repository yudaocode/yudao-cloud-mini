var _=(l=>(l[l.END_EVENT_NODE=1]="END_EVENT_NODE",l[l.START_USER_NODE=10]="START_USER_NODE",l[l.USER_TASK_NODE=11]="USER_TASK_NODE",l[l.COPY_TASK_NODE=12]="COPY_TASK_NODE",l[l.DELAY_TIMER_NODE=14]="DELAY_TIMER_NODE",l[l.TRIGGER_NODE=15]="TRIGGER_NODE",l[l.CONDITION_NODE=50]="CONDITION_NODE",l[l.CONDITION_BRANCH_NODE=51]="CONDITION_BRANCH_NODE",l[l.PARALLEL_BRANCH_NODE=52]="PARALLEL_BRANCH_NODE",l[l.INCLUSIVE_BRANCH_NODE=53]="INCLUSIVE_BRANCH_NODE",l[l.ROUTER_BRANCH_NODE=54]="ROUTER_BRANCH_NODE",l))(_||{}),T=(l=>(l.START_USER_NODE_ID="StartUserNode",l.END_EVENT_NODE_ID="EndEvent",l))(T||{}),A=(l=>(l[l.ROLE=10]="ROLE",l[l.DEPT_MEMBER=20]="DEPT_MEMBER",l[l.DEPT_LEADER=21]="DEPT_LEADER",l[l.MULTI_LEVEL_DEPT_LEADER=23]="MULTI_LEVEL_DEPT_LEADER",l[l.POST=22]="POST",l[l.USER=30]="USER",l[l.START_USER_SELECT=35]="START_USER_SELECT",l[l.START_USER=36]="START_USER",l[l.START_USER_DEPT_LEADER=37]="START_USER_DEPT_LEADER",l[l.START_USER_MULTI_LEVEL_DEPT_LEADER=38]="START_USER_MULTI_LEVEL_DEPT_LEADER",l[l.USER_GROUP=40]="USER_GROUP",l[l.FORM_USER=50]="FORM_USER",l[l.FORM_DEPT_LEADER=51]="FORM_DEPT_LEADER",l[l.EXPRESSION=60]="EXPRESSION",l))(A||{}),N=(l=>(l[l.RANDOM_SELECT_ONE_APPROVE=1]="RANDOM_SELECT_ONE_APPROVE",l[l.APPROVE_BY_RATIO=2]="APPROVE_BY_RATIO",l[l.ANY_APPROVE=3]="ANY_APPROVE",l[l.SEQUENTIAL_APPROVE=4]="SEQUENTIAL_APPROVE",l))(N||{}),S=(l=>(l[l.FIXED_VALUE=1]="FIXED_VALUE",l[l.FROM_FORM=2]="FROM_FORM",l))(S||{});const C=[{value:1,label:"\u56FA\u5B9A\u503C"},{value:2,label:"\u8868\u5355"}];var E=(l=>(l[l.FINISH_PROCESS=1]="FINISH_PROCESS",l[l.RETURN_USER_TASK=2]="RETURN_USER_TASK",l))(E||{}),O=(l=>(l[l.REMINDER=1]="REMINDER",l[l.APPROVE=2]="APPROVE",l[l.REJECT=3]="REJECT",l))(O||{}),D=(l=>(l[l.APPROVE=1]="APPROVE",l[l.REJECT=2]="REJECT",l[l.ASSIGN_USER=3]="ASSIGN_USER",l[l.ASSIGN_ADMIN=4]="ASSIGN_ADMIN",l))(D||{}),s=(l=>(l[l.START_USER_AUDIT=1]="START_USER_AUDIT",l[l.SKIP=2]="SKIP",l[l.ASSIGN_DEPT_LEADER=3]="ASSIGN_DEPT_LEADER",l))(s||{}),b=(l=>(l[l.USER=1]="USER",l[l.AUTO_APPROVE=2]="AUTO_APPROVE",l[l.AUTO_REJECT=3]="AUTO_REJECT",l))(b||{}),I=(l=>(l[l.MINUTE=1]="MINUTE",l[l.HOUR=2]="HOUR",l[l.DAY=3]="DAY",l))(I||{}),P=(l=>(l[l.EXPRESSION=1]="EXPRESSION",l[l.RULE=2]="RULE",l))(P||{}),v=(l=>(l.READ="1",l.WRITE="2",l.NONE="3",l))(v||{}),u=(l=>(l[l.APPROVE=1]="APPROVE",l[l.REJECT=2]="REJECT",l[l.TRANSFER=3]="TRANSFER",l[l.DELEGATE=4]="DELEGATE",l[l.ADD_SIGN=5]="ADD_SIGN",l[l.RETURN=6]="RETURN",l[l.COPY=7]="COPY",l))(u||{});const t={and:!0,conditions:[{and:!0,rules:[{opCode:"==",leftSide:"",rightSide:""}]}]},a=new Map;a.set(11,"\u8BF7\u914D\u7F6E\u5BA1\u6279\u4EBA"),a.set(12,"\u8BF7\u914D\u7F6E\u6284\u9001\u4EBA"),a.set(50,"\u8BF7\u8BBE\u7F6E\u6761\u4EF6"),a.set(10,"\u8BF7\u8BBE\u7F6E\u53D1\u8D77\u4EBA"),a.set(14,"\u8BF7\u8BBE\u7F6E\u5EF6\u8FDF\u5668"),a.set(54,"\u8BF7\u8BBE\u7F6E\u8DEF\u7531\u8282\u70B9"),a.set(15,"\u8BF7\u8BBE\u7F6E\u89E6\u53D1\u5668");const e=new Map;e.set(11,"\u5BA1\u6279\u4EBA"),e.set(12,"\u6284\u9001\u4EBA"),e.set(50,"\u6761\u4EF6"),e.set(10,"\u53D1\u8D77\u4EBA"),e.set(14,"\u5EF6\u8FDF\u5668"),e.set(54,"\u8DEF\u7531\u5206\u652F"),e.set(15,"\u89E6\u53D1\u5668");const d=[{label:"\u6307\u5B9A\u6210\u5458",value:30},{label:"\u6307\u5B9A\u89D2\u8272",value:10},{label:"\u90E8\u95E8\u6210\u5458",value:20},{label:"\u90E8\u95E8\u8D1F\u8D23\u4EBA",value:21},{label:"\u8FDE\u7EED\u591A\u7EA7\u90E8\u95E8\u8D1F\u8D23\u4EBA",value:23},{label:"\u53D1\u8D77\u4EBA\u81EA\u9009",value:35},{label:"\u53D1\u8D77\u4EBA\u672C\u4EBA",value:36},{label:"\u53D1\u8D77\u4EBA\u90E8\u95E8\u8D1F\u8D23\u4EBA",value:37},{label:"\u53D1\u8D77\u4EBA\u8FDE\u7EED\u90E8\u95E8\u8D1F\u8D23\u4EBA",value:38},{label:"\u7528\u6237\u7EC4",value:40},{label:"\u8868\u5355\u5185\u7528\u6237\u5B57\u6BB5",value:50},{label:"\u8868\u5355\u5185\u90E8\u95E8\u8D1F\u8D23\u4EBA",value:51},{label:"\u6D41\u7A0B\u8868\u8FBE\u5F0F",value:60}],i=[{label:"\u4EBA\u5DE5\u5BA1\u6279",value:1},{label:"\u81EA\u52A8\u901A\u8FC7",value:2},{label:"\u81EA\u52A8\u62D2\u7EDD",value:3}],n=[{label:"\u6309\u987A\u5E8F\u4F9D\u6B21\u5BA1\u6279",value:4},{label:"\u4F1A\u7B7E\uFF08\u53EF\u540C\u65F6\u5BA1\u6279\uFF0C\u81F3\u5C11 % \u4EBA\u5FC5\u987B\u5BA1\u6279\u901A\u8FC7\uFF09",value:2},{label:"\u6216\u7B7E(\u53EF\u540C\u65F6\u5BA1\u6279\uFF0C\u6709\u4E00\u4EBA\u901A\u8FC7\u5373\u53EF)",value:3},{label:"\u968F\u673A\u6311\u9009\u4E00\u4EBA\u5BA1\u6279",value:1}],V=[{label:"\u6761\u4EF6\u89C4\u5219",value:2},{label:"\u6761\u4EF6\u8868\u8FBE\u5F0F",value:1}],F=[{label:"\u5206\u949F",value:1},{label:"\u5C0F\u65F6",value:2},{label:"\u5929",value:3}],p=[{label:"\u81EA\u52A8\u63D0\u9192",value:1},{label:"\u81EA\u52A8\u540C\u610F",value:2},{label:"\u81EA\u52A8\u62D2\u7EDD",value:3}],G=[{label:"\u7EC8\u6B62\u6D41\u7A0B",value:1},{label:"\u9A73\u56DE\u5230\u6307\u5B9A\u8282\u70B9",value:2}],H=[{label:"\u81EA\u52A8\u901A\u8FC7",value:1},{label:"\u81EA\u52A8\u62D2\u7EDD",value:2},{label:"\u6307\u5B9A\u6210\u5458\u5BA1\u6279",value:3},{label:"\u8F6C\u4EA4\u7ED9\u6D41\u7A0B\u7BA1\u7406\u5458",value:4}],o=[{label:"\u7531\u53D1\u8D77\u4EBA\u5BF9\u81EA\u5DF1\u5BA1\u6279",value:1},{label:"\u81EA\u52A8\u8DF3\u8FC7",value:2},{label:"\u8F6C\u4EA4\u7ED9\u90E8\u95E8\u8D1F\u8D23\u4EBA\u5BA1\u6279",value:3}],m=[{value:"==",label:"\u7B49\u4E8E"},{value:"!=",label:"\u4E0D\u7B49\u4E8E"},{value:">",label:"\u5927\u4E8E"},{value:">=",label:"\u5927\u4E8E\u7B49\u4E8E"},{value:"<",label:"\u5C0F\u4E8E"},{value:"<=",label:"\u5C0F\u4E8E\u7B49\u4E8E"}],R=new Map;R.set(1,"\u901A\u8FC7"),R.set(2,"\u62D2\u7EDD"),R.set(3,"\u8F6C\u529E"),R.set(4,"\u59D4\u6D3E"),R.set(5,"\u52A0\u7B7E"),R.set(6,"\u9000\u56DE"),R.set(7,"\u6284\u9001");const y=[{id:1,displayName:"\u901A\u8FC7",enable:!0},{id:2,displayName:"\u62D2\u7EDD",enable:!0},{id:3,displayName:"\u8F6C\u529E",enable:!0},{id:4,displayName:"\u59D4\u6D3E",enable:!0},{id:5,displayName:"\u52A0\u7B7E",enable:!0},{id:6,displayName:"\u9000\u56DE",enable:!0}],B=[{id:1,displayName:"\u63D0\u4EA4",enable:!0},{id:2,displayName:"\u62D2\u7EDD",enable:!1},{id:3,displayName:"\u8F6C\u529E",enable:!1},{id:4,displayName:"\u59D4\u6D3E",enable:!1},{id:5,displayName:"\u52A0\u7B7E",enable:!1},{id:6,displayName:"\u9000\u56DE",enable:!1}],Y=[{label:"\u7B2C 1 \u7EA7\u90E8\u95E8",value:1},{label:"\u7B2C 2 \u7EA7\u90E8\u95E8",value:2},{label:"\u7B2C 3 \u7EA7\u90E8\u95E8",value:3},{label:"\u7B2C 4 \u7EA7\u90E8\u95E8",value:4},{label:"\u7B2C 5 \u7EA7\u90E8\u95E8",value:5},{label:"\u7B2C 6 \u7EA7\u90E8\u95E8",value:6},{label:"\u7B2C 7 \u7EA7\u90E8\u95E8",value:7},{label:"\u7B2C 8 \u7EA7\u90E8\u95E8",value:8},{label:"\u7B2C 9 \u7EA7\u90E8\u95E8",value:9},{label:"\u7B2C 10 \u7EA7\u90E8\u95E8",value:10},{label:"\u7B2C 11 \u7EA7\u90E8\u95E8",value:11},{label:"\u7B2C 12 \u7EA7\u90E8\u95E8",value:12},{label:"\u7B2C 13 \u7EA7\u90E8\u95E8",value:13},{label:"\u7B2C 14 \u7EA7\u90E8\u95E8",value:14},{label:"\u7B2C 15 \u7EA7\u90E8\u95E8",value:15}];var U=(l=>(l.START_USER_ID="PROCESS_START_USER_ID",l.START_TIME="PROCESS_START_TIME",l.PROCESS_DEFINITION_NAME="PROCESS_DEFINITION_NAME",l))(U||{}),L=(l=>(l[l.FIXED_TIME_DURATION=1]="FIXED_TIME_DURATION",l[l.FIXED_DATE_TIME=2]="FIXED_DATE_TIME",l))(L||{});const r=[{label:"\u56FA\u5B9A\u65F6\u957F",value:1},{label:"\u56FA\u5B9A\u65E5\u671F",value:2}];var M=(l=>(l[l.HTTP_REQUEST=1]="HTTP_REQUEST",l[l.UPDATE_NORMAL_FORM=2]="UPDATE_NORMAL_FORM",l))(M||{});const X=[{label:"HTTP \u8BF7\u6C42",value:1},{label:"\u4FEE\u6539\u8868\u5355\u6570\u636E",value:2}];export{b as A,C as B,A as C,y as D,v as F,Y as M,_ as N,R as O,U as P,E as R,B as S,I as T,o as a,G as b,H as c,D as d,i as e,F as f,p as g,d as h,N as i,n as j,s as k,e as l,T as m,a as n,P as o,t as p,S as q,O as r,V as s,m as t,L as u,r as v,M as w,X as x,u as y};
