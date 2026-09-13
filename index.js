const { Client, LocalAuth } = require('whatsapp-web.js');
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer:{args:['--no-sandbox','--disable-setuid-sandbox']}
});
const clientes = {};
client.on('qr', qr => {
  console.log('LINK QR:');
  console.log(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qr}`);
});
client.on('ready', ()=>console.log('BOT ONLINE'));
client.on('message', async msg => {
  if(msg.from.includes('@g.us')) return;
  let t=msg.body.toLowerCase().trim();
  let chat=msg.from;
  if(t.includes('oi') || t.includes('ola') || t=='0' || t=='menu'){
    return msg.reply(`🔥 EL SHADAY GÁS\nOlá! Seja bem-vindo\nEscolha uma opção:\n1️⃣ Fazer pedido\n2️⃣ Quero ser revendedor\n3️⃣ Falar com um atendente\n👉 Para facilitar o atendimento, digite o número da opção desejada.`);
  }
  if(clientes[chat]){
    let d=clientes[chat];
    if(d.etapa=='nome'){d.nome=msg.body;d.etapa='bairro';return msg.reply(`Obrigado ${d.nome}! Qual seu *BAIRRO*?`);}
    if(d.etapa=='bairro'){d.bairro=msg.body;d.etapa='cidade';return msg.reply('Qual sua *CIDADE*?');}
    if(d.etapa=='cidade'){d.cidade=msg.body;d.etapa='telefone';return msg.reply('Qual seu *TELEFONE* pra contato?');}
    if(d.etapa=='telefone'){d.telefone=msg.body;d.etapa='endereco';return msg.reply('Perfeito! Qual o *ENDEREÇO COMPLETO* pra entrega?');}
    if(d.etapa=='endereco'){d.endereco=msg.body;msg.reply(`✅ *PEDIDO ANOTADO - EL SHADAY GÁS*\n👤 Nome: ${d.nome}\n🏘️ Bairro: ${d.bairro}\n🌎 Cidade: ${d.cidade}\n📞 Telefone: ${d.telefone}\n📍 Endereço: ${d.endereco}\n\nJá vamos agilizar sua entrega! 🚀`);delete clientes[chat];return;}
  }
  if(t=='1'){clientes[chat]={etapa:'nome'};return msg.reply('✅ Vamos fazer seu pedido! Qual seu *NOME*?');}
  else if(t=='2'){return msg.reply(`🔥 *REVENDA EL SHADAY GÁS* 🔥\nVocê revende gás? Temos condição ESPECIAL!\n\nMe manda aqui:\n📍 Bairro / Cidade / Telefone / Quantos botijões por semana\nQue te passo a melhor condição agora!`);}
  else if(t=='3'){return msg.reply('👨‍💼 Só um instante! Já vou chamar um atendente pra você!');}
});
client.initialize();
