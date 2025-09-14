const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 4000;

const routes = {
    '/': {file: 'index.html', type: 'text/html; charset=utf-8' },
    '/ about': {file: 'about.html', type: 'text/html; charset=utf-8' },
    '/contact': {file: 'contact.html', type: 'text/html; charset=utf-8' },
    '/style.css': { file: 'style.css', type: 'text/css; charset=utf-8' },
};

function serveFile(res, filePath, contentType, statusCode = 200) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.end('Internal Server Error');
            return;
        }
        res.statusCode = statusCode;
        res.setHeader('Content-Type', contentType);
        res.end(data);
    });
}

const server = http.createServer((req, res) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    const url = req.url.split('?')[0].replace(/\/+$/. '') || '/';

    if (routes[url]) {
        const { file, type } = routes[url];
        const filePath = path.join(__dirname, file);
        return serveFile(res, filePath, type, 200);
    }

    // 404
    serveFile(res, path.join(dirname, '404.html'), 'text/html; charset=utf-8', 404);
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});