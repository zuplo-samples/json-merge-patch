# Getting Started

The JSON Merge Patch API allows you to upload JSON documents and apply JSON Merge Patch operations to them.

## Upload a JSON

The first step is to upload a JSON object to perform merge-patches on.

```shell
curl --request POST \
  --url https://api.jsonmergepatch.com/upload \
  --header 'Content-Type: application/json' \
  --data '
{
  "title": "Hello world",
  "summary": "A simple summary",
  "data": {
    "age": 3
  }
}
'
```

The API will return a 200 response with the `targetId`:
```json
{
  "targetId": "abc1234"
}
```
This `targetId` is a unique identifier for your JSON object.


## Patching a JSON

Make a call to the `/apply/{targetId}` endpoint with a Merge Patch in the body to apply it.

```shell
curl --request PATCH \
  --url https://api.jsonmergepatch.com/apply/abc1234
  --header 'Content-Type: application/merge-patch+json'
  --data '
{
  "title": "Changed title",
  "type": "book"
  "summary": null,
  "data": {
    "someNewProperty": "wow"
    "age": 4
  }
}
'
```

The API will return the result of the Merge Patch:
```json
{
  "title": "Changed title",
  "type": "book",
  "data": {
    "someNewProperty": "wow",
    "age": 4
  }
}
```