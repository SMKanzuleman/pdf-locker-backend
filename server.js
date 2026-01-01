const express = require('express');
const multer = require('multer');
const qpdf = require('node-qpdf');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Basic UI
app.get('/', (req, res) => {
    res.send(`
        <h2>PDF Password Locker</h2>
        <form action="/lock" method="POST" enctype="multipart/form-data">
            <input type="file" name="pdfFile" accept=".pdf" required /><br><br>
            <input type="text" name="password" placeholder="Password set karein" required /><br><br>
            <button type="submit">Lock & Download</button>
        </form>
    `);
});

app.post('/lock', upload.single('pdfFile'), (req, res) => {
    const password = req.body.password;
    const inputPath = req.file.path;
    const outputName = 'locked_' + req.file.originalname;
    const outputPath = path.join(__dirname, 'uploads', outputName);

    const options = { keyLength: 256, password: password };

    qpdf.encrypt(inputPath, options, outputPath, (err) => {
        if (err) return res.status(500).send("Error: " + err.message);

        res.download(outputPath, (downloadErr) => {
            // Files delete karna zaroori hai taake space full na ho
            if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
            if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        });
    });
});

const PORT = process.env.PORT || 7860;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));