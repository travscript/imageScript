const express = require('express');
const bodyParser = require('body-parser');
const Jimp = require('jimp');
const Tesseract = require('tesseract.js');

const app = express();
const port = 3000;

// Body parser middleware
app.use(bodyParser.json({ limit: '50mb' }));

// Endpoint for processing image
app.post('/process-image', async (req, res) => {
  const base64Image = req.body.image;

  try {
    // Convert base64 image to buffer
    const imageBuffer = Buffer.from(base64Image, 'base64');

    // Read image using Jimp
    const jimpImage = await Jimp.read(imageBuffer);

    // Convert image to grayscale using Jimp
    jimpImage.greyscale();

    // Save grayscale image to buffer
    const grayBuffer = await jimpImage.getBufferAsync(Jimp.MIME_PNG);

    // Perform OCR using Tesseract
    const tesseractResult = await Tesseract.recognize(grayBuffer, 'eng');
    const processedText = tesseractResult.data.text;

    // Send processed text as response
    res.json({ text: processedText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
