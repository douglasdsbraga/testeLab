const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

const modelosDir = path.join(__dirname, 'modelos');

app.post('/tts', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).send('Texto ausente');

  // Executa comando no container Piper
    const comando = `docker exec tts_piper piper --voice pt_BR-silvia-low --text "${text.replace(/"/g, '\\"')}" --output_file /config/voz.wav`;

  exec(comando, (error) => {
    if (error) {
      console.error('Erro Piper Docker:', error);
      return res.status(500).send('Erro ao gerar áudio');
    }

    res.set({ 'Content-Type': 'audio/wav' });
    const audioPath = path.join(modelosDir, 'voz.wav');
    fs.createReadStream(audioPath).pipe(res);
  });
});

app.listen(3000, () => console.log('🟢 Servidor rodando em http://localhost:3000'));