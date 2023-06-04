const superagent = require('superagent');
const constants = require('./constants');


function request(url, params = null, data = null, headers = null) {
    let request = superagent.get(url).timeout({ deadline: constants.REQUEST_TIMEOUT });
    if (headers) request.set(headers);
    if (params) request.query(params);
    return request;
}



async function makeParallelRequests (requests) {
    return Promise.all(requests);
}

module.exports = {
    request,
    makeParallelRequests
}
