import axios from "axios";

let luluToken = null;
let tokenExpiry = null;

export const getLuluToken = async () => {
  if (luluToken && tokenExpiry > Date.now()) {
    return luluToken;
  }

  // const res = await axios.post(
  //   "https://api.lulu.com/auth/realms/glasstree/protocol/openid-connect/token",
  //   new URLSearchParams({
  //     grant_type: "client_credentials",
  //     client_id: process.env.LULU_CLIENT_ID,
  //     client_secret: process.env.LULU_CLIENT_SECRET
  //   }),
  //   { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  // );


console.log("process.env.LULU_SANDBOX_CLIENT_ID" , process.env.LULU_SANDBOX_CLIENT_ID)
console.log("LULU_SANDBOX_CLIENT_SECRET" , process.env.LULU_SANDBOX_CLIENT_SECRET)


  const res = await axios.post(
  "https://api.sandbox.lulu.com/auth/realms/glasstree/protocol/openid-connect/token",
  new URLSearchParams({
    grant_type: "client_credentials",
    client_id: process.env.LULU_SANDBOX_CLIENT_ID,
    client_secret: process.env.LULU_SANDBOX_CLIENT_SECRET
  }),
  { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
);

console.log("res",res.data)
  luluToken = res.data.access_token;
  
  tokenExpiry = Date.now() + res.data.expires_in * 1000;

  return luluToken;
};
