const express = require('express')
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req,res) => res.send('흠 연결은 됐구먼')) 
app.listen(port, () => console.log('Listening is ${port} !'))