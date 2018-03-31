import {EventEmitter} from 'events';
import TwitterStreamApi = require('twitter-stream-api');

export interface OauthKeys {
	consumer_key: string;
	consumer_secret: string;
	token: string;
	token_secret: string;
}

export default class TwitterAccountCrawler extends EventEmitter {
	private readonly twitterStreamApi: TwitterStreamApi;

	constructor(keys: OauthKeys) {
		super();
		this.twitterStreamApi = new TwitterStreamApi(keys);
		this.twitterStreamApi.on('data', data => {
			this.emit('account', data.user);
		});
	}

	start() {
		const track = 'あいうえおかきくけおさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん'.split('');
		this.twitterStreamApi.stream('statuses/filter', {track});
	}

	stop() {
		this.twitterStreamApi.close();
	}
}

module.exports = TwitterAccountCrawler;
