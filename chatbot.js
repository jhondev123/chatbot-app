const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');

const {
    verifyMessageIsValidContact,
    simulatingTyping,
    verifyKeyWordIsValid
} = require('./utils.js');


const client = new Client({
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});
client.on('ready', () => {
    console.log('WhatsApp conectado.');
});

client.initialize();

const delay = ms => new Promise(res => setTimeout(res, ms));

client.on('message', async msg => {

     if (verifyKeyWordIsValid(msg) && verifyMessageIsValidContact(msg)) {

        const chat = await msg.getChat();

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

    if (msg.body !== null && msg.body === '1' && verifyMessageIsValidContact(msg)) {
        const chat = await msg.getChat();


        await simulatingTyping(chat, delay);
        await client.sendMessage(msg.from, 'Nos informe seu Nome e CPF para que possamos verificar seu cadastro.');


    }



    if (msg.body !== null && msg.body === '5' && verifyMessageIsValidContact(msg)) {
        const chat = await msg.getChat();

        await simulatingTyping(chat, delay);
        await client.sendMessage(msg.from, 'Se você tiver outras dúvidas ou precisar de mais informações, por favor, fale aqui nesse whatsapp ou visite nosso site ');


    }

});