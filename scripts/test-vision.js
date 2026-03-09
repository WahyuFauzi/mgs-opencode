#!/usr/bin/env node

/**
 * Test Vision Script - Debug Gemini Vision API via HTTP
 * Usage: GEMINI_API_KEY=your_key node test-vision.js <image_path> [prompt]
 */

const fs = require('fs');
const path = require('path');

// Configuration
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent';
const API_KEY = process.env.GEMINI_API_KEY;

// Check for API key
if (!API_KEY) {
  console.error('❌ Error: GEMINI_API_KEY environment variable not set');
  console.error('Usage: GEMINI_API_KEY=your_key node test-vision.js <image_path> [prompt]');
  process.exit(1);
}

// Get command line arguments
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('❌ Error: No image path provided');
  console.error('Usage: GEMINI_API_KEY=your_key node test-vision.js <image_path> [prompt]');
  process.exit(1);
}

const imagePath = args[0];
const prompt = args[1] || 'Caption this image.';

// Debug logging
console.log('🔍 Debug Info:');
console.log(`  Image Path: ${imagePath}`);
console.log(`  Prompt: ${prompt}`);
console.log(`  API Key: ${API_KEY.substring(0, 10)}...`);
console.log('');

// Check if file exists
if (!fs.existsSync(imagePath)) {
  console.error(`❌ Error: Image file not found: ${imagePath}`);
  process.exit(1);
}

// Detect MIME type based on file extension
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.bmp': 'image/bmp',
  };
  return mimeTypes[ext] || 'image/jpeg';
}

// Main function
async function analyzeImage() {
  try {
    console.log('📖 Reading image file...');
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = getMimeType(imagePath);
    
    console.log(`  File Size: ${(imageBuffer.length / 1024).toFixed(2)} KB`);
    console.log(`  Base64 Length: ${base64Image.length} chars`);
    console.log(`  MIME Type: ${mimeType}`);
    console.log('');

    console.log('🚀 Sending request to Gemini API...');
    const requestBody = {
      contents: [{
        parts: [
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Image
            }
          },
          {
            text: prompt
          }
        ]
      }]
    };

    const startTime = Date.now();
    
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    const elapsed = Date.now() - startTime;
    console.log(`  Response Time: ${elapsed}ms`);
    console.log(`  Status: ${response.status} ${response.statusText}`);
    console.log('');

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:');
      console.error(errorText);
      process.exit(1);
    }

    const data = await response.json();
    
    console.log('✅ Success! Response:');
    console.log(JSON.stringify(data, null, 2));
    console.log('');

    // Extract the text response
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const text = data.candidates[0].content.parts
        .filter(p => p.text)
        .map(p => p.text)
        .join('\n');
      
      console.log('📝 Generated Text:');
      console.log(text);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.cause) {
      console.error('Cause:', error.cause);
    }
    process.exit(1);
  }
}

// Run
analyzeImage();
