const https = require('https');

/**
 * Download genérico (retorna Buffer)
 */
function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      const data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => resolve(Buffer.concat(data)));
    }).on('error', reject);
  });
}

/**
 * TikTok VIDEO
 */
async function tiktokVideo(url) {
  const api = `https://tikwm.com/api/?url=${encodeURIComponent(url)}`;
  const json = JSON.parse(
    (await download(api)).toString()
  );

  if (!json?.data?.play)
    throw 'Vídeo não encontrado';

  const buffer = await download(json.data.play);

  return {
    buffer,
    info: {
      autor: json.data.author.nickname,
      descricao: json.data.title
    }
  };
}

/**
 * TikTok AUDIO
 */
async function tiktokAudio(url) {
  const api = `https://tikwm.com/api/?url=${encodeURIComponent(url)}`;
  const json = JSON.parse(
    (await download(api)).toString()
  );

  if (!json?.data?.music)
    throw 'Áudio não encontrado';

  const buffer = await download(json.data.music);

  return {
    buffer,
    info: { tipo: 'audio/mp3' }
  };
}

module.exports = {
  tiktokVideo,
  tiktokAudio
};
