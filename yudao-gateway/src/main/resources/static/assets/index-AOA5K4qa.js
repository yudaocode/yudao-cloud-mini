import{bz as a}from"./index-BaY5TDP-.js";const t={getPurchaseReturnPage:async e=>await a.get({url:"/erp/purchase-return/page",params:e}),getPurchaseReturn:async e=>await a.get({url:"/erp/purchase-return/get?id="+e}),createPurchaseReturn:async e=>await a.post({url:"/erp/purchase-return/create",data:e}),updatePurchaseReturn:async e=>await a.put({url:"/erp/purchase-return/update",data:e}),updatePurchaseReturnStatus:async(e,r)=>await a.put({url:"/erp/purchase-return/update-status",params:{id:e,status:r}}),deletePurchaseReturn:async e=>await a.delete({url:"/erp/purchase-return/delete",params:{ids:e.join(",")}}),exportPurchaseReturn:async e=>await a.download({url:"/erp/purchase-return/export-excel",params:e})};export{t as P};
