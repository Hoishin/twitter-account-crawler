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
		query: {[x: string]: string}
	) {
		this.oauthParameters.oauth_nonce = this.nonce;
		this.oauthParameters.oauth_timestamp = this.timestamp;

		const parameterString = this.makeParameterString(query);
		const signatureBaseString = [
			method.toUpperCase(),
			strictUriEncode(baseUrl),
			strictUriEncode(parameterString),
		].join('&');
		const signingKey = [
			strictUriEncode(this.consumerSecret),
			strictUriEncode(this.tokenSecret),
		].join('&');

		const signature = this.hash(signatureBaseString, signingKey);

		return {Authorization: this.makeHeaderString(signature)};
	}

	private makeParameterString(query: {[x: string]: string}) {
		const parameterObject = {
			...query,
			...this.oauthParameters,
		};

		return queryString.stringify(parameterObject);
	}

	private makeHeaderString(signature: string) {
		this.oauthParameters.oauth_signature = signature;
		const headerParameterString =
			queryString
				.stringify(this.oauthParameters)
				.replace('&', '", ')
				.replace('=', '="') + '"';

		return 'OAuth ' + headerParameterString;
	}

	private hash(signatureBaseString: string, signingKey: string) {
		return createHmac('sha1', signingKey)
			.update(signatureBaseString)
			.digest('base64');
	}

	private get timestamp() {
		return String(Math.floor(Date.now() / 1000));
	}

	private get nonce() {
		return uuidv4();
	}
}
