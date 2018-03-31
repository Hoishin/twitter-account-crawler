# twitter-account-crawler [![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/xojs/tslint-xo)

Collect random users on Twitter.

*NOTE: Currently only supports Japanese users.*

## API

### `new TwitterAccountCrawler(keys)`

Returns the instance of the crawler.

`keys` consists of `consumer_key`, `consumer_secret`, `token`, and `token_secret`.

### `.on('account', callback)`

The event emitted when the crawler gets an account.

`callback` takes [Twitter user object](https://developer.twitter.com/en/docs/tweets/data-dictionary/overview/user-object) as parameter.

### `.start()`

Starts the crawler.

### `.stop()`

Stops the crawler.


## Usage

```js
const TwitterAccountCrawler = require('twitter-account-crawler');

// Initialize with Twitter app credentials
const crawler = new TwitterAccountCrawler({
	consumer_key: 'SUPER_SECRET_CONSUMER_KEY',
	consumer_secret: 'SUPER_SECRET_CONSUMER_SECRET',
	token: 'SUPER_SECRET_TOKEN',
	token_secret: 'SUPER_SECRET_TOKEN_SECRET',
});

// Define callback, for example
crawler.on('account', account => {
	someDatabase.insert({id: account.id_str});
});

// Start the crawler
crawler.start();

// Stop the crawler
crawler.stop();
```

## License

MIT
