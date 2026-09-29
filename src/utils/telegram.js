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
