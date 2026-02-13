const express = require('express');
const path = require('path');
const app = express();

// A Vercel define a porta automaticamente, localmente usamos 3001
const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Só inicia o servidor se não estiver rodando como uma função serverless (Vercel)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
}

module.exports = app;
