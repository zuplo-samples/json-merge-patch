import { ZuploContext, ZuploRequest, HttpProblems, environment } from "@zuplo/runtime";

function serialize(value: any) {
  return (value && typeof value.toJSON === 'function') ? value.toJSON() : value;
}

function apply(target: object, patch: object) {
  patch = serialize(patch);
  if (patch === null || typeof patch !== 'object' || Array.isArray(patch)) {
    return patch;
  }

  target = serialize(target);
  if (target === null || typeof target !== 'object' || Array.isArray(target)) {
    target = {};
  }
  var keys = Object.keys(patch);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      return target;
    }
    if (patch[key] === null) {
      if (target.hasOwnProperty(key)) {
        delete target[key];
      }
    } else {
      target[key] = apply(target[key], patch[key]);
    }
  }
  return target;
};

export default async function (request: ZuploRequest, context: ZuploContext) {
  const JSON_BIN_KEY = environment.JSON_BIN_KEY;
  const patch = await request.json() as object;
  const targetId = request.params.targetId;
  if (!targetId) {
    return HttpProblems.badRequest(request, context, {detail: "Missing targetId"});
  }
  if (!patch) {
    return HttpProblems.badRequest(request, context, {detail: "Missing patch in the request body"});
  }

  const binRes = await fetch(`https://api.jsonbin.io/v3/b/${targetId}`, {
    headers:{
      "content-type": "application/json",
      "x-master-key": JSON_BIN_KEY,
    }
  });
  if (!binRes.ok) {
    return HttpProblems.badRequest(request, context, {detail: "Invalid targetId"}); 
  }
  const binJson = await binRes.json();
  const patchedJson = apply(binJson.record, patch);
  return HttpProblems.ok(request, context, {
    patchedJson
  })
}
