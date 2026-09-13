const makeWASocket = require('@whiskeysockets/baileys').default
const { useMultiFileAuthState, Browsers } = require('@whiskeysockets/baileys')

const clientes = {}

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth')
    const sock = makeWASocket({
        auth: state,
        browser: Browsers.ubuntu('Chrome')
    })
    sock.ev.on('creds.update', saveCreds)

    if (!sock.authState.creds.registered) {
        setTimeout(async () => {
            try {
                const code = await sock.requestPairingCode("5582988217147")
                console.log('==========================')
                console.log('CODIGO DE PAREAMENTO: ' + code)
                console.log('==========================')
                console.log('WhatsApp > Aparelhos conectados > Conectar com numero')
            } catch(e){ console.log('Erro ao gerar codigo:', e.message) }
        }, 3000)
    }

    sock.ev.on('connection.update', (u) => {
        if(u.connection==='open') console.log('✅ BOT CONECTADO!')
    })

    sock.ev.on('messages.upsert', async ({messages})=>{
        for(const m of messages){
            if(m.key.fromMe) continue
            if(!m.message) continue
            const chat = m.key.remoteJid
            if(chat.includes('@g.us')) continue
            let t = m.message.conversation || m.message.extendedTextMessage?.text || m.message.imageMessage?.caption || ""
            let textoOriginal = t
            t = t.toLowerCase().trim()

            if(clientes[chat]){
                let d = clientes[chat]
                if(d.etapa=='nome'){ d.nome = textoOriginal; d.etapa='bairro'; await sock.sendMessage(chat,{text:`*${d.nome}*, qual seu BAIRRO?`}); continue }
                if(d.etapa=='bairro'){ d.bairro = textoOriginal; d.etapa='cidade'; await sock.sendMessage(chat,{text:`Qual sua CIDADE?`}); continue }
                if(d.etapa=='cidade'){ d.cidade = textoOriginal; d.etapa='telefone'; await sock.sendMessage(chat,{text:`Qual seu TELEFONE para contato?`}); continue }
                if(d.etapa=='telefone'){ d.telefone = textoOriginal; d.etapa='endereco'; await sock.sendMessage(chat,{text:`Qual seu ENDEREÇO completo?`}); continue }
                if(d.etapa=='endereco'){
                    d.endereco = textoOriginal
                    await sock.sendMessage(chat,{text:`✅ *CADASTRO FINALIZADO!*\n\nNome: ${d.nome}\nBairro: ${d.bairro}\nCidade: ${d.cidade}\nTel: ${d.telefone}\nEnd: ${d.endereco}\n\nObrigado! Entraremos em contato!`})
                    delete clientes[chat]
                    continue
                }
            }

            if(t=='oi' || t=='ola' || t=='menu'){
                clientes[chat] = { etapa: 'nome' }
                await sock.sendMessage(chat,{text:`Olá! Bem vindo ao *El Shaday* 🌸\n\nPara fazer seu cadastro a prazo, qual seu NOME completo?`})
            }
        }
    })
}
startBot()
