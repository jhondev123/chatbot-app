const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');

const {
    verifyMessageIsValidContact,
    simulatingTyping,
    verifyKeyWordIsValid,
    getContactData,
    isValidCPF
} = require('./utils.js');

const client = new Client({
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('WhatsApp conectado.');
});

client.initialize();

const delay = ms => new Promise(res => setTimeout(res, ms));

const userState = {};


client.on('message', async msg => {
    const chat = await msg.getChat();
    const userId = msg.from;

    if (!userState[userId]) {
        userState[userId] = { step: 'initial' };
    }

    if (verifyKeyWordIsValid(msg) && verifyMessageIsValidContact(msg) && userState[userId].step === 'initial') {
        await simulatingTyping(chat, delay);
        await client.sendMessage(
            msg.from,
            `
                Olá! Como posso te ajudar? Por favor, digite uma das opções abaixo:\n\n
                1 - Problemas com Certificado\n
                5 - Falar Conosco\n
            `
        );
        await simulatingTyping(chat, delay);
    }

    if (msg.body === '1' && verifyMessageIsValidContact(msg)) {
        userState[userId].step = 'requestingInfo';
        await simulatingTyping(chat, delay);
        await client.sendMessage(msg.from, 'Nos informe seu Nome e CPF para que possamos verificar seu cadastro.');
    }

    if (userState[userId].step === 'requestingInfo' && verifyMessageIsValidContact(msg)) {
        const userMessage = msg.body.trim().split(' ');

        if (userMessage.length >= 2) {
            const cpf = userMessage.pop();
            const nome = userMessage.join(' ');

            if (isValidCPF(cpf)) {
                userState[userId] = { step: 'initial' };
                await simulatingTyping(chat, delay);
                await client.sendMessage(msg.from, `Obrigado, ${nome}. Verificamos seu cadastro com o CPF: ${cpf}. Em breve retornaremos com mais informações.`);
            } else {
                await client.sendMessage(msg.from, 'CPF inválido. Por favor, insira novamente seu nome e CPF (11 dígitos).');
            }
        } else {
            await client.sendMessage(msg.from, 'Por favor, envie seu Nome e CPF (11 dígitos), separados por um espaço.');
        }
    }

    if (msg.body === '5' && verifyMessageIsValidContact(msg)) {
        await simulatingTyping(chat, delay);
        await client.sendMessage(msg.from, 'Se você tiver outras dúvidas ou precisar de mais informações, por favor, fale aqui nesse WhatsApp ou visite nosso site.');
    }
});
