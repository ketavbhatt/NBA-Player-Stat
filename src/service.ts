import * as superagent from 'superagent';
import * as constants from './constants';

function request(url: string, params: any = null, data: any = null, headers: any = null) {
  let requestObj = superagent.get(url).timeout({ deadline: constants.REQUEST_TIMEOUT });
  if (headers) requestObj.set(headers);
  if (params) requestObj.query(params);
  return requestObj;
}

async function makeParallelRequests(requests: Promise<any>[]) {
  return Promise.all(requests);
}

export {
  request,
  makeParallelRequests
};
