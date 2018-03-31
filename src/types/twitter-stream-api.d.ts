declare module 'twitter-stream-api' {
	interface OauthKeys {
		consumer_key: string;
		consumer_secret: string;
		token: string;
		token_secret: string;
	}

	type AbortCode = 401 | 403 | 404 | 406 | 412 | 413 | 416 | 503;

	type Endpoint =
		| 'statuses/sample'
		| 'statuses/filter'
		| 'statuses/firehose'
		| 'user'
		| 'site';

	interface StreamParameters {
		follow?: any[] | string;
		track?: any[] | string;
		locations?: any[] | string;
		[x: string]: any;
	}

	class TwitterStreamApi {
		constructor(keys: OauthKeys);
		constructor(keys: OauthKeys, config: object);
		constructor(keys: OauthKeys, objectMode: boolean, config: object);

		on(event: 'connection success', callback: (uri: string) => void): void;
		on(event: 'connection aborted', callback: () => void): void;
		on(event: 'connection error network', callback: (error: Error) => void): void;
		on(event: 'connection error http', callback: (statusCode: AbortCode) => void): void;
		on(event: 'connection rate limit', callback: (statusCode: 420) => void): void;
		on(event: 'data keep-alive', callback: () => void): void;
		on(event: 'data error', callback: (error: Error) => void): void;
		on(
			event: 'connection error unknown',
			callback: (msg: 'Illegal stream parameters provided' | number | Error) => void
		): void;
		on(event: 'data', callback: (data: any) => void): void;

		stream(endpoint: Endpoint, parameters: StreamParameters): void;

		close(): void;

		debug(callback: Function): void;
	}

	export = TwitterStreamApi;
}
