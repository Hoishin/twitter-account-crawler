type RestMethod =
	| 'GET'
	| 'POST'
	| 'PUT'
	| 'PATCH'
	| 'DELETE'
	| 'get'
	| 'post'
	| 'put'
	| 'patch'
	| 'delete';

interface OauthKeys {
	consumer_key: string;
	consumer_key_secret: string;
	access_token: string;
	access_token_secret: string;
}

interface OauthParameters {
	oauth_consumer_key: string;
	oauth_nonce?: string;
	oauth_signature?: string;
	oauth_signature_method: string;
	oauth_timestamp?: string;
	oauth_token: string;
	oauth_version: string;
}

import {createHmac} from 'crypto';
import {v4 as uuidv4} from 'uuid';
import * as queryString from 'query-string';
import strictUriEncode = require('strict-uri-encode');

export default class OauthClient {
	private readonly oauthParameters: OauthParameters;
	private readonly consumerSecret: string;
	private readonly tokenSecret: string;

	constructor(keys: OauthKeys) {
		this.oauthParameters = {
			oauth_signature_method: 'HMAC-SHA1',
			oauth_version: '1.0',
			oauth_consumer_key: keys.consumer_key,
			oauth_token: keys.access_token,
		};
		this.consumerSecret = keys.consumer_key_secret;
		this.tokenSecret = keys.access_token_secret;
	}

	forAuthorizationHeader(
		method: RestMethod,
		baseUrl: string,
		query: {[x: string]: string} = {}
	) {
		// Prepare oauth nonce and timestamp first
		this.oauthParameters.oauth_nonce = this.nonce();
		this.oauthParameters.oauth_timestamp = this.timestamp();

		// To make signature, signature base string and signature key are required
		// Base string is made from HTTP method, base url, query and oauth parameters except signature
		const parameterString = queryString.stringify({
			...query,
			...this.oauthParameters,
		});
		const signatureBaseString = [
			method.toUpperCase(),
			strictUriEncode(baseUrl),
			strictUriEncode(parameterString),
		].join('&');
		// Join consumer secret and token secret for signing key
		const signingKey = [
			strictUriEncode(this.consumerSecret),
			strictUriEncode(this.tokenSecret),
		].join('&');

		// Make signature with HMAC-SHA1 and convert to base64 string
		const signature = createHmac('sha1', signingKey)
			.update(signatureBaseString)
			.digest('base64');

		// Join those above for header string
		this.oauthParameters.oauth_signature = signature;
		const oauthKeys = Object.entries(this.oauthParameters).sort((a, b) =>
			Number(a[0] > b[0])
		);

		return oauthKeys.reduce((prev, [key, value], index) => {
			return `${prev}${strictUriEncode(key)}="${strictUriEncode(value)}"${
				index < oauthKeys.length - 1 ? ', ' : ''
			}`;
		}, 'OAuth ');
	}

	private timestamp() {
		return String(Math.floor(Date.now() / 1000));
	}

	private nonce() {
		return strictUriEncode(uuidv4());
	}
}
