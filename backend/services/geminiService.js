const { GoogleGenerativeAI } = require('@google/generative-ai');

const summarizeReadme = async (readmeText) => {
  if (!readmeText) return null;
  
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
Summarize this README into valid JSON format with the following structure:
{
  "description": "A concise 2-sentence summary of the project",
  "features": ["Feature 1", "Feature 2", "Feature 3"],
  "tech_stack": ["React", "Node", "..."]
}

Important Rules:
- The "features" array must contain a MAXIMUM of 3 bullet points.
- Each feature point MUST be highly concise, clear, and fully explanatory (max 1 short sentence per point).
- The "tech_stack" array should list main technologies.
- Return ONLY valid JSON, without any markdown formatting wrappers or code blocks.

README Content:
${readmeText.substring(0, 5000)}
`;

    const result = await model.generateContent(prompt);
    let output = result.response.text();
    // Clean up Markdown JSON blocks
    output = output.replace(/```json/gi, '').replace(/```/gi, '').trim();
    
    return JSON.parse(output);
  } catch (error) {
    console.error('Error in Gemini summarize:', error.message);
    return null;
  }
};

module.exports = { summarizeReadme };
