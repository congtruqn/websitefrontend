var elasticsearch = require('elasticsearch');

var elasticClient = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'info'
});

var indexName = "stocks";

/**
* Delete an existing index
*/
function deleteIndex() {
    return elasticClient.indices.delete({
        index: indexName
    });
}
exports.deleteIndex = deleteIndex;

/**
* create the index
*/
function initIndex() {
    return elasticClient.indices.create({
        index: indexName
    });
}
exports.initIndex = initIndex;

/**
* check if the index exists
*/
function indexExists() {
    return elasticClient.indices.exists({
        index: indexName
    });
}
exports.indexExists = indexExists;

function initMapping() {
    return elasticClient.indices.putMapping({
        index: indexName,
        type: "document",
        body: {
            properties: {
                product_code: { type: "text" },
                product_name: { type: "text" },
                stockid: { type: "text" },
                //product_detail:{ type: "text" },
                image_name:{ type: "text" },
                sell_price:{ type: "text" },
                product_detail: {
                    properties : {
                        detail_name : {type : "text"},
                        detail_value : {type: "text"}
                    }
                }

            }
        }
    });
}
exports.initMapping = initMapping;

function addDocument(document) {
    return elasticClient.index({
        index: indexName,
        type: "document",
        body: {
            product_code: document.product_code,
            product_name: document.product_name,
            stockid: document.stockid,
            product_detail:document.product_detail,
            image_name:document.image_name,
            sell_price:document.sell_price,
            //tags: document.product_name.split(" "),
        }
    });
}
exports.addDocument = addDocument;

function getSuggestions(input) {
    console.log(input)
  return elasticClient.search({
    index: indexName,
    body: {
        query: {
          fuzzy: {
            product_name: {
                "value": input,
                "boost": 3.0,
                "fuzziness": 4,
                "prefix_length": 0,
                "max_expansions": 100
            }
            
          }
        }
    }
  });
}
exports.getSuggestions = getSuggestions;

function getSearchs(input) {
    return elasticClient.search({
    index: indexName,
    body: {
      "query": {
          "bool": {
            "must": {
              "multi_match": {
                "query": input,
                "fuzziness": "3",
                "fields": [
                  "product_name",
                  "product_code",
                  "product_detail",
                  "sell_price"
                ],
                "minimum_should_match": "100%",
                "type": "most_fields"
              }
            }
          }
      }
    }
  });
}
exports.getSearchs = getSearchs;

function deleteSearchs(stocks_id) {
    return elasticClient.deleteByQuery({
      index: indexName,
      type: "document",
      body: {
        query: {
               match: { stockid:stocks_id }
        }
      }
    });
}
exports.deleteSearchs = deleteSearchs;