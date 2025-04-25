import { mkdir, writeFile } from 'fs/promises';
import http from 'http';

await mkdir('./data/', { recursive: true })

const USE_PORT = 31471

const server = http.createServer((req, res) => {
	console.log(req.url)
	const url = new URL(req.url!, 'http://localhost/')
	let body: any[] = [];
	req
		.on('data', chunk => {
			body.push(chunk);
		})
		.on('end', () => {
			let json = JSON.parse(Buffer.concat(body).toString());
			writeFile(`./data/${url.pathname}`, JSON.stringify(json, null, '\t'))
			res.writeHead(204)
			res.end()
		});
})

server.listen(USE_PORT).on('listening', () => console.log(`Listening for game data on port ${USE_PORT}`))