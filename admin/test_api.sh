
curl -X POST 'http://182.92.214.141:8082/artifactory/api/search/aql' \
-H 'X-JFrog-Art-Api: '"$ART_API_KEY"'' \
-H 'Content-Type: text/plain' \
--data-raw 'items.find(
    {  
        "repo": {"$eq" : "xray-project-generic-local"},
        "path": {"$match" : "whitelist_request"},
        "@status": {"$eq" : "approved"}
    }
)'