import {GITHUB_CLIENT_ID, GITHUB_REDIRECT_URL} from '../config';
import {objToQuery, getUrlParameter} from '../utils/url';

function toHex(dec) {
  return ('0' + dec.toString(16)).substr(-2);
}

export function hasValidAccessToken() {
  return getUrlParameter('gh_access_token').length > 0;
}

export function authorizeUrl(route) {
  const params = {client_id: GITHUB_CLIENT_ID,
                  redirect_uri: GITHUB_REDIRECT_URL,
                  scope: 'user:email public_repo',
                  state: JSON.stringify({route})};

  return `http://github.com/login/oauth/authorize?${objToQuery(params)}`;
}
