const axios = require('axios');

const payload = {
  repository: {
    name: 'HelloWorld-Test-V3',
    html_url: 'https://github.com/harshakya56/HelloWorld-Test-V3',
    description: 'A test repository to verify email delivery.',
    homepage: 'https://helloworld.vercel.app',
    owner: {
      login: 'harshakya56'
    }
  }
};

axios.post('http://localhost:5001/api/webhook/github', payload, {
  headers: {
    'x-github-event': 'repository',
    'Content-Type': 'application/json'
  }
}).then(res => {
  console.log('Webhook dispatched successfully:', res.data);
}).catch(err => {
  console.error('Webhook error:', err.response ? err.response.data : err.message);
});
