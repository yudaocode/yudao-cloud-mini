import{bz as t}from"./index-BaY5TDP-.js";const e={getChatConversationMy:async a=>await t.get({url:`/ai/chat/conversation/get-my?id=${a}`}),createChatConversationMy:async a=>await t.post({url:"/ai/chat/conversation/create-my",data:a}),updateChatConversationMy:async a=>await t.put({url:"/ai/chat/conversation/update-my",data:a}),deleteChatConversationMy:async a=>await t.delete({url:`/ai/chat/conversation/delete-my?id=${a}`}),deleteChatConversationMyByUnpinned:async()=>await t.delete({url:"/ai/chat/conversation/delete-by-unpinned"}),getChatConversationMyList:async()=>await t.get({url:"/ai/chat/conversation/my-list"}),getChatConversationPage:async a=>await t.get({url:"/ai/chat/conversation/page",params:a}),deleteChatConversationByAdmin:async a=>await t.delete({url:`/ai/chat/conversation/delete-by-admin?id=${a}`})};export{e as C};
