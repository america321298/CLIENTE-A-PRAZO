const { Client, LocalAuth } = require('whatsapp-web.js');
const client = new Client({
authStrategy: new LocalAuth(),
puppeteer:{args:['--no-sandbox','--disable-setuid-sandbox']}
});
client.on('qr', qr => {
console.log('LINK QR:');
console.log(`https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(qr)}`);
});
client.on('ready', ()=>console.log('BOT ONLINE!'));
client.on('message', async msg => {
if(msg.from.includes('@g.us')) return;
let t=msg.body.toLowerCase();
if(t.includes('oi')||t=='0'){
msg.reply('🔥 EL SHADAY GAS 🔥\n1-Preco\n2-Pedido\n3-Atendente');
}else if(t=='1'){msg.reply('Gas R$95 entrega gratis!');}
else if(t=='2'){msg.reply('Manda endereco!');}
});
client.initialize();
