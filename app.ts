import express = require('express');

const host = process.env.HOST || 'localhost';
const port = Number(process.env.PORT) || 3000;

const app = express();

app.listen(port, host, () => {
	console.log(`Server running on ${host}:${port}`);
});
