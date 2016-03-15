 export default function (client, path) {
   return function (session, tagName, query) {
     return client.get(path + "/" + tagName + "/related", {
       accessToken: session && session.accessToken ? session.accessToken : null,
       query: query
     });
   };
 }
