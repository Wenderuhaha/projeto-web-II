const { PrismaClient } = require('@prisma/client');
const TelegramBot = require('node-telegram-bot-api');

const token = '6776140536:AAGh1UqgQOY9YbAjmCgVYUR9_3mEFTnZRRc';
const bot = new TelegramBot(token, { polling: true });
const prisma = new PrismaClient();

async function salvarMensagem(texto, createdAt) {
  try {
    const mensagem = await prisma.mensagem.create({
      data: {
        texto: texto,
        createdAt: createdAt,
      },
    });
    console.log('Mensagem salva no banco de dados:', mensagem);
  } catch (error) {
    console.error('Erro ao salvar a mensagem no banco de dados:', error);
  }
}

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  const date = new Date();

  if (date.getHours() >= 9 && date.getHours() <= 18) {
    bot.sendMessage(chatId, 'Obrigado por entrar em contato! Aqui está o link de acesso para nosso site: https://faesa.br.');
  } else {
    console.log(msg.text);
    if (msg.text.includes('@')) {
      await salvarMensagem(msg.text, date);
      bot.sendMessage(chatId, 'Recebemos o seu Email, aguarde e logo entraremos em contato.');
    } else {
      bot.sendMessage(chatId, 'Desculpe, estamos fora do horário de atendimento. Por favor, informe seu Email que entraremos em contato!');
    }
    
  }
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});
