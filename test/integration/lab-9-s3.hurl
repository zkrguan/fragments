
# tests/integration/post-fragments.hurl
# Authenticated POST to /v1/fragments

# Step 1 Post to create a fragment

POST http://localhost:8080/v1/fragments
# We're sending a plain text fragment
Content-Type: text/plain
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
# Body of the request goes in ```...``` when it's a string
`Don't like Hello S3!`
# We expect to get back an HTTP 201
HTTP/1.1 201
# We have various assertions about the response that we want to check
[Captures]
url: header "Location"

# Step 2 get the fragment back
GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Length: 20
[Asserts]
body == "Don't like Hello S3!"
# https://hurl.dev/docs/asserting-response.html
header "Content-Type" contains "text/plain"

# Step 3 Remove that fragment Created in step 1
DELETE {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

# Step 4 get the fragment back, but it has been deleted, so it is 404
GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 404
