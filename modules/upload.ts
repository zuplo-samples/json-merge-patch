import { ZuploContext, ZuploRequest, HttpProblems, environment } from "@zuplo/runtime";

export default async function (request: ZuploRequest, context: ZuploContext) {
  const JSON_BIN_KEY = environment.JSON_BIN_KEY;
  const jsonString = await request.text()
  try {
    JSON.parse(jsonString);
  } catch (e) {
    return HttpProblems.badRequest(request, context, {detail: "Upload is not valid JSON"});
  }

  const jsonBinRes = await fetch("https://api.jsonbin.io/v3/b", {
    headers:{
      "content-type": "application/json",
      "x-master-key": JSON_BIN_KEY,
    },
    body: jsonString,
    method: "POST"
  });
  
  const resJson = await jsonBinRes.json();
  if (!jsonBinRes.ok) {
    return HttpProblems.badRequest(request, context, {detail: resJson.message});
  }
  return new Response(JSON.stringify({targetId: resJson.metadata.id}), {
    status: 200,
    statusText: "OK",
  })
}