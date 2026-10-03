const BOT_TOKEN = '8702660971:AAHP3PH7-_v7sOh6jz0VPqiz7GZ1gIoyXwc';
const CHAT_ID = '799910176';

export const sendTelegramMessage = async (message) => {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      }),
    });
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
  }
};

export const sendTelegramOrder = async (message, images) => {
  try {
    if (!images || images.length === 0) {
      await sendTelegramMessage(message);
      return;
    }
    
    const uniqueImages = [...new Set(images)]; // Remove duplicate images
    const media = uniqueImages.slice(0, 10).map((url, i) => ({
      type: 'photo',
      media: url,
      caption: i === 0 ? message : '',
      parse_mode: 'HTML'
    }));

    if (media.length === 1) {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          photo: media[0].media,
          caption: media[0].caption,
          parse_mode: 'HTML'
        })
      });
    } else {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMediaGroup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          media: media
        })
      });
    }
  } catch (error) {
    console.error('Error sending order with photos to Telegram:', error);
  }
};
