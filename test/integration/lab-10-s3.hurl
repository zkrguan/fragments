
# Authenticated POST to /v1/fragments
# Step 1 perisist 
POST http://localhost:8080/v1/fragments
# This request won't even reach into the route
# Include HTTP Basic Auth credentials
Content-Type:application/json
[BasicAuth]
user1@email.com:password1
{
  "service": "my name is json"
}

HTTP/1.1 201
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.type" == "application/json"
[Captures]
fragment1_url: header "Location"
fragment1_id: jsonpath "$['fragment']['id']"

# # Step 2 getting the created json back.
GET {{fragment1_url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 200
[Asserts]
# https://hurl.dev/docs/asserting-response.html
header "Content-Type" contains "application/json"
