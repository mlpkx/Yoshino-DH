const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Initialize Express
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://premodernjapanstudio:ECZKyce24h@yoshino.eq4mc.mongodb.net/Yoshino', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch((error) => {
  console.error('Connection error:', error);
});

// Serve static files from Yoshino-w folder
app.use(express.static(path.join(__dirname, '../Yoshino-w')));

// Define Annotation Schema
const annotationSchema = new mongoose.Schema({
  annotation: Object,
  page: Number,
  manuscript: String
});

const Annotation = mongoose.model('Annotation', annotationSchema);

// Save annotation
app.post('/annotations', async (req, res) => {
  const { annotation, page, manuscript } = req.body;
  const newAnnotation = new Annotation({ annotation, page, manuscript });
  try {
    await newAnnotation.save();
    res.status(201).json({ message: 'Annotation saved successfully' });
  } catch (error) {
    console.error('Error saving annotation:', error);
    res.status(500).json({ error: 'Failed to save annotation' });
  }
});

// Retrieve annotations for a page
app.get('/annotations/:manuscript/:page', async (req, res) => {
  const { manuscript, page } = req.params;
  try {
    const annotations = await Annotation.find({ manuscript, page: parseInt(page) });
    res.status(200).json(annotations);
  } catch (error) {
    console.error('Error fetching annotations:', error);
    res.status(500).json({ error: 'Failed to fetch annotations' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
