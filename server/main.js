// use express server
const express = require('express');
const mongoose = require('mongoose');
const app = express();
// Add middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/dist'));

const TableDataSchema = new mongoose.Schema({
    value: { type: String, required: true },
}, { versionKey: false });


const TableData = mongoose.model('TableData', TableDataSchema);

app.listen(5000, '0.0.0.0');
console.log('Server started!');

// MongoDB connection setup
const mongoURI = 'mongodb://mongo:27017/mydatabase';

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// API routes for CRUD operations
app.get('/api/data', async (req, res) => {
    try {
        const data = await TableData.find();
        res.json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/api/data', async (req, res) => {
    const newData = new TableData(req.body);
    try {
        await newData.save();
        res.status(201).json(newData);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.put('/api/data/:id', async (req, res) => {
    try {
        const updatedData = await TableData.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedData);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.delete('/api/data/:id', async (req, res) => {
    try {
        await TableData.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).send(error.message);
    }
});