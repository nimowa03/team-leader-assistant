import { GoogleGenerativeAI } from '@google/generative-ai';

// Environment variables are loaded via shell command

async function testGemini() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('Checking API Key:', apiKey ? 'Present' : 'Missing');

    if (!apiKey) {
        console.error('❌ GEMINI_API_KEY is missing');
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = 'Say "Hello, World!" if you can hear me.';
        console.log('Sending prompt to Gemini (gemini-2.0-flash)...');

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('✅ Gemini Response:', text);
    } catch (error) {
        console.error('❌ Gemini API Error:', error);
    }
}

testGemini();
