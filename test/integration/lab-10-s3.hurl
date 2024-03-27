
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
fragment1_ownerId: jsonpath "$['fragment']['ownerId']"
fragment1_updated: jsonpath "$['fragment']['updated']"
fragment1_created: jsonpath "$['fragment']['created']"
fragment1_type: jsonpath "$['fragment']['type']"
fragment1_size: jsonpath "$['fragment']['size']"

# # Step 2 getting the created json back.
GET {{fragment1_url}}/info
[BasicAuth]
user1@email.com:password1
HTTP/1.1 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" == {{fragment1_id}}
jsonpath "$.fragment.ownerId" == {{fragment1_ownerId}}
jsonpath "$.fragment.type" == {{fragment1_type}}
jsonpath "$.fragment.created" == {{fragment1_created}}
jsonpath "$.fragment.updated" == {{fragment1_updated}}
jsonpath "$.fragment.size" == {{fragment1_size}}

# Step 3 creating a second markdown fragments to local host
POST http://localhost:8080/v1/fragments
# This request won't even reach into the route
# Include HTTP Basic Auth credentials
Content-Type:text/markdown
[BasicAuth]
user1@email.com:password1
```
# https://hurl.dev/docs/request.html
DynamoDB is **not** that great.
```
HTTP/1.1 201
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.type" == "text/markdown"
[Captures]
fragment2_url: header "Location"
fragment2_id: jsonpath "$['fragment']['id']"
fragment2_ownerId: jsonpath "$['fragment']['ownerId']"
fragment2_updated: jsonpath "$['fragment']['updated']"
fragment2_created: jsonpath "$['fragment']['created']"
fragment2_type: jsonpath "$['fragment']['type']"
fragment2_size: jsonpath "$['fragment']['size']"

# # Step 4 getting the created json back.
GET {{fragment2_url}}/info
[BasicAuth]
user1@email.com:password1
HTTP/1.1 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" == {{fragment2_id}}
jsonpath "$.fragment.ownerId" == {{fragment2_ownerId}}
jsonpath "$.fragment.type" == {{fragment2_type}}
jsonpath "$.fragment.created" == {{fragment2_created}}
jsonpath "$.fragment.updated" == {{fragment2_updated}}
jsonpath "$.fragment.size" == {{fragment2_size}}

# # Step 5 getting a list of fragments
GET http://localhost:8080/v1/fragments?expand=0
[BasicAuth]
user1@email.com:password1
HTTP/1.1 200
[Asserts]  
# https://hurl.dev/docs/asserting-response.html#predicates
jsonpath "$.fragments" includes {{fragment1_id}}
jsonpath "$.fragments" includes {{fragment2_id}}


## Step 6 Delete the first fragment 
DELETE {{fragment1_url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 200

# Step 7 get the fragment back, but it has been deleted, so it is 404
GET {{fragment1_url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 404


# step 8 get the fragments of the user
GET http://localhost:8080/v1/fragments?expand=0
[BasicAuth]
user1@email.com:password1
HTTP/1.1 200
[Asserts]  
# https://hurl.dev/docs/asserting-response.html#predicates
jsonpath "$.fragments" not includes {{fragment1_id}}
jsonpath "$.fragments" includes {{fragment2_id}}

