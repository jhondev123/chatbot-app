function verifyMessageIsValidContact(msg){
    return msg.from.endsWith('@c.us')

}

function verifyMessageIsValidGroup(msg){
    return msg.from.endsWith('@g.us')
}

async function simulatingTyping (chat,delay){
    await delay(3000);
    await chat.sendStateTyping();
    await delay(3000);
}

function getContactData(msg){
    return msg.getContact();
}

function verifyKeyWordIsValid(msg){
    return msg.body.match(/(menu|Menu|dia|tarde|noite|oi|Oi|Olá|olá|ola|Ola)/i);
}
function isValidCPF(cpf){
   return true;
}

module.exports = {
    verifyMessageIsValidContact,
    verifyMessageIsValidGroup,
    verifyKeyWordIsValid,
    simulatingTyping,
    isValidCPF,
    getContactData
};
