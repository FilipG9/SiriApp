const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;
const db = new sqlite3.Database('./appointments.db');  // Usa un file di database

app.use(cors());
app.use(bodyParser.json());

// Servire i file statici dalla stessa cartella di server.js
app.use(express.static(path.join(__dirname)));

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS appointments (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, patientName TEXT, note TEXT)");
});

// API per ottenere gli appuntamenti
app.get('/appointments', (req, res) => {
    db.all("SELECT * FROM appointments", [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "appointments": rows });
    });
});

// API per creare un appuntamento
app.post('/appointments', (req, res) => {
    const { date, patientName, note } = req.body;
    db.run("INSERT INTO appointments (date, patientName, note) VALUES (?, ?, ?)", [date, patientName, note], function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "appointmentId": this.lastID });
    });
});

// API per eliminare un appuntamento
app.delete('/appointments/:id', (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM appointments WHERE id = ?", id, function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "deleted": this.changes });
    });
});

// Servire i file HTML
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server in ascolto su http://localhost:${port}`);
});
