const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 4000;

const routes = {
    '/': {file: 'index.html', type: 'text/html; charset=utf-8' },
    '/about': {file: 'about.html', type: 'text/html; charset=utf-8' },
    '/contact': {file: 'contact.html', type: 'text/html; charset=utf-8' },
    '/style.css': { file: 'style.css', type: 'text/css; charset=utf-8' },
};

function serverNotFound(res) {
    fs.readFile(path.join(__dirname, '404.html'), 'utf8', (e, html) => {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(e ? '404 Not Found ' : html);
    });
}

function serveFile(res, filePath, contentType) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') return serverNotFound(res); // missing file => 404
            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.end('Internal Server Error');
            return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', contentType);
        res.end(data);
    });
}

const server = http.createServer((req, res) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    const url = req.url.split('?')[0].replace(/\/+$/, '') || '/';

    if (routes[url]) {
        const { file, type } = routes[url];
        return serveFile(res, path.join(__dirname, file), type);
    }

    // Unkown route -> 404 page
    serverNotFound(res);
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});