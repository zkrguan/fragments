
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# This request won't even reach into the route
# Include HTTP Basic Auth credentials
Content-Type:application/json
[BasicAuth]
user1@email.com:password1
{
  "test": "I am json"
}

HTTP/1.1 201
[Asserts]
jsonpath "$.status" == "ok"
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
# Our ownerId hash is a hex encoded string
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
# Basic check for the presence of created and updated date strings.
# You could also write a regex for this and use matches
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "application/json"
# 19 is the length of our fragment data: 'This is a fragment!'
jsonpath "$.fragment.size" == 25
[Captures]
url: header "Location"
# Second part getting the json object back
GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

[Asserts]
jsonpath "$.test"  == "I am json"
# https://hurl.dev/docs/asserting-response.html
header "Content-Type" contains "application/json"
