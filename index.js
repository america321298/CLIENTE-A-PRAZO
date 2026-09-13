const makeWASocket = require('@whiskeysockets/baileys').default
const { useMultiFileAuthState, Browsers } = require('@whiskeysockets/baileys')
const clientes = {}

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth')
    const sock = makeWASocket({ auth: state, browser: Browsers.ubuntu('Chrome'), printQRInTerminal: false })
    sock.ev.on('creds.update', saveCreds)

    if (!sock.authState.creds.registered) {
        setTimeout(async () => {
            try {
                const code = await sock.requestPairingCode('5582988217147')
                console.log('===================================')
                console.log('CODIGO DE PAREAMENTO:', code)
                console.log('===================================')
            } catch(e){ console.log('Erro', e) }
        }, 3000)
    }

    sock.ev.on('connection.update', (u) => {
        if(u.connection==='open') console.log('BOT ONLINE!')
    })

    sock.ev.on('messages.upsert', async ({ messages }) => {
        for(const m of messages){
            if(m.key.fromMe) continue
            if(!m.message) continue
            const chat = m.key.remoteJid
            if(chat.includes('@g.us')) continue
            let t = m.message.conversation || m.message.extendedTextMessage?.text || ''
            t = t.toLowerCase().trim()
            let textoOriginal = m.message.conversation || m.message.extendedTextMessage?.text || ''

            if(clientes[chat]){
                let d = clientes[chat]
                if(d.etapa=='nome'){ d.nome=textoOriginal; d.etapa='bairro'; await sock.sendMessage(chat,{text:`Anotado ${d.nome}! Qual seu BAIRRO?`}); continue }
                if(d.etapa=='bairro'){ d.bairro=textoOriginal; d.etapa='cidade'; await sock.sendMessage(chat,{text:`Qual sua CIDADE?`}); continue }
                if(d.etapa=='cidade'){ d.cidade=textoOriginal; d.etapa='telefone'; await sock.sendMessage(chat,{text:`Me manda seu TELEFONE pra contato?`}); continue }
                if(d.etapa=='telefone'){ d.telefone=textoOriginal; d.etapa='endereco'; await sock.sendMessage(chat,{text:`Qual seu ENDEREÇO completo?`}); continue }
                if(d.etapa=='endereco'){ d.endereco=textoOriginal; await sock.sendMessage(chat,{text:`🔥 Pedido anotado!\nNome: ${d.nome}\nBairro: ${d.bairro}\nCidade: ${d.cidade}\nTel: ${d.telefone}\nEnd: ${d.endereco}\n\nJá vamos levar seu gás!`}); delete clientes[chat]; continue }
            }

            if(t.includes('oi') || t.includes('ola') || t=='1'){
                if(t.includes('oi') || t.includes('ola')){
                    await sock.sendMessage(chat,{text:`🔥 EL SHADAY GÁS\nOlá! Bem-vindo!\n\n1️⃣ - Fazer pedido\n2️⃣ - Ver preços\n3️⃣ - Falar com atendente`}); continue
                }
                if(t=='1'){ clientes[chat]={etapa:'nome'}; await sock.sendMessage(chat,{text:`🔥 *Vamos fazer seu pedido!*\nQual seu NOME?`}); continue }
            }
            if(t=='2'){ await sock.sendMessage(chat,{text:`🔥 *TABELA EL SHADAY GÁS*\nGás 13kg: R$...\nEntrega grátis!`}); continue }
            if(t=='3'){ await sock.sendMessage(chat,{text:`👨‍💼 Só um momento, vou te passar pro atendente!`}); continue }
        }
    })
}
startBot()
