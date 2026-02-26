
function isValidString(obj, key) {
  return (
    obj.hasOwnProperty(key) &&
    typeof obj[key] === 'string' &&
    obj[key].trim().length > 0
  );
}

(source_connector_string, solr_pro_template_string, target_connector_name, parser_id) => {
    let source_connector = JSON.parse(source_connector_string);
    let target_connector = JSON.parse(solr_pro_template_string);
    const DEFAULT_PRO_BATCH_SIZE = 1000;
    target_connector.id = target_connector_name;

    target_connector.parserId = parser_id;
    target_connector.pipeline = source_connector.pipeline;
    target_connector.properties.collection = source_connector.properties.collection;
    target_connector.description = source_connector.description;


    //Connection migration
    if (isValidString(source_connector.properties, "zk_host_string")) {
      target_connector.properties.connection.connectionType = "SOLRCLOUD";
      target_connector.properties.connection.zkHosts = source_connector.properties.zk_host_string;
    } else {
      target_connector.properties.connection.connectionType = "STANDALONE";
      target_connector.properties.connection.solrUrl = source_connector.properties.solr_base_url;
    }
    target_connector.properties.connection.collection = source_connector.properties.source_collection;


    //Query migration
    target_connector.properties.query.query = source_connector.properties.solr_query;
    target_connector.properties.query.batchSize = source_connector.properties.solr_page_size;
    if (DEFAULT_PRO_BATCH_SIZE > source_connector.properties.solr_page_size) {
      target_connector.properties.query.batchSize = DEFAULT_PRO_BATCH_SIZE;
    }
    if (isValidString(source_connector.properties, "solr_query_parser")) {
      target_connector.properties.query.queryParser = source_connector.properties.solr_query_parser;
    }
    if (isValidString(source_connector.properties, "solr_request_handler")) {
      target_connector.properties.query.requestHandler = source_connector.properties.solr_request_handler;
    }
    if (isValidString(source_connector.properties, "solr_sort_spec")) {
      target_connector.properties.query.sort = source_connector.properties.solr_sort_spec;
    }
    if (isValidString(source_connector.properties, "solr_field_list")) {
      target_connector.properties.query.fieldList = source_connector.properties.solr_field_list;
    }
    if (isValidString(source_connector.properties, "solr_filter_queries")) {
      splitted = source_connector.properties.solr_filter_queries.split(/(?<!\\),/);
      target_connector.properties.query.filterQueries = splitted;
    }
    return JSON.stringify(target_connector);
}
