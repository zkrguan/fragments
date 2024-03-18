# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# This request won't even reach into the route
Content-Type: mp4/video
# Body of the request goes in ```...``` when it's a string
`This is a video. No it is not. JK.`

HTTP/1.1 401
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 401
