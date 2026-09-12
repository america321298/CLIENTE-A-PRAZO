const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const client = new Client({authStrategy:new LocalAuth(),puppeteer:{args:['--no-sandbox']}});
client.on('qr',qr=>{console.log('ESCANEIA ESSE QR:');qrcode.generate(qr,{small:true});});
client.on('ready',()=>console.log('EL SHADAY AUTOMATICO ONLINE'));
client.on('message',async msg=>{
 if(msg.from.includes('@g.us'))return;
 let nome=msg._data.notifyName||'cliente';
 let t=msg.body.toLowerCase();
 if(t.includes('oi')||t=='menu'||t=='0'){
  msg.reply(`🔥 *EL SHADAY GAS AUTOMATICO* 🔥\n\nOlá *${nome}*! 🙏\n\n1 - COMPRAR GAS\n2 - PREÇO\n3 - HUMANO`);
 }else if(t=='1'){msg.reply(`✅ ${nome}, manda NOME + ENDEREÇO + PIX/CARTÃO`);}
 else if(t=='2'){msg.reply(`💰 R$109,90 ${nome} - Entrega GRATIS 25min`);}
 else if(t=='3'){msg.reply(`👨‍💼 Ok ${nome}, humano já vem!`);}
});
client.initialize();
