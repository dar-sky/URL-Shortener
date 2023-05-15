const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require("./db/dbconn");
const crypto = require('crypto');

const app = express();
const PORT = 5000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.post('/urlshort', async (req, res) => {
    try {
        let { url, time } = req.body;
        const [existingUrlRow] = await db.promise().query('SELECT * FROM Users WHERE LongUrl = ?', [url]);
        if (existingUrlRow.length > 0) { return res.status(200).json({ shortUrl: existingUrlRow[0].LongUrl });}

        const shortCode = generateShortCode(url);

        if (time != null) time = Math.floor(Date.now() / 1000) + time * 3600;
        await db.promise().query( 'INSERT INTO Users (ShortUrl, LongUrl, Timestamp) VALUES (?, ?, ?)',[shortCode, url, time]);

        const fullUrl = "localhost:5000/" + shortCode;
        res.status(200).json({ shortUrl: fullUrl });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const [users, fields] = await db.promise().query("SELECT * FROM Users WHERE ShortUrl = ?", [id]);
        const fullUrl = users[0].LongUrl;
        if (!fullUrl.startsWith('https://')) {
            const prefixedUrl = 'https://' + fullUrl;
            return res.redirect(prefixedUrl);
        }
        else return res.redirect(fullUrl);

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

function generateShortCode(url) {
    const hash = crypto.createHash('sha256');
    const hashValue = hash.update(url).digest('hex');
    const shortCode = hashValue.substring(0, 8);
    return shortCode;
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});