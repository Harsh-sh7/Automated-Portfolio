require('dotenv').config();
const axios = require('axios');

axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`)
.then(res => {
  console.log("Models:", res.data.models.map(m => m.name));
})
.catch(err => {
  console.error("Error:", err.response ? err.response.data : err.message);
});
