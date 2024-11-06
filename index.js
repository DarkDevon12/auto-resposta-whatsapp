const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');

const client = new Client();
const userStage = {}; // Objeto para rastrear o estágio de cada usuário

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('Escaneie o QR code acima para logar no WhatsApp.');
});

client.on('ready', () => {
    console.log('Bot está pronto e conectado ao WhatsApp!');
});

// Função para enviar o menu inicial
function enviarMenu(message) {
    userStage[message.from] = 'menu_principal'; // Define o estágio inicial para o usuário
    message.reply(
        "Olá! Seja bem-vindo à nossa agência de Social Media e Design! Como podemos ajudar você? Escolha uma opção:\n\n" +
        "1. Criação de Posts\n" +
        "2. Gerenciamento de Redes Sociais\n" +
        "3. Consultoria para Crescimento\n" +
        "4. Falar com um especialista"
    );
}

// Função que processa a resposta com base na escolha do usuário
client.on('message', async message => {
    const chat = await message.getChat();

    // Ignora mensagens de grupo
    if (chat.isGroup) return;

    const user = message.from;
    const stage = userStage[user];

    // Verifica em qual estágio o usuário está e responde de acordo
    if (stage === 'menu_principal') {
        if (message.body === '1') {
            userStage[user] = 'criacao_posts'; // Avança o estágio para a próxima fase
            message.reply(
                "✨ *Criação de Posts* ✨\n\n" +
                "Oferecemos pacotes de criação de posts para deixar seu perfil incrível! Escolha uma opção:\n" +
                "1. Pacote Básico (10 posts mensais)\n" +
                "2. Pacote Completo (20 posts mensais + stories interativos)\n" +
                "3. Posts Avulsos\n\n" +
                "Digite o número da opção para saber mais detalhes."
            );
        } else if (message.body === '2') {
            userStage[user] = 'gerenciamento_redes'; // Avança o estágio para a próxima fase
            message.reply(
                "📱 *Gerenciamento de Redes Sociais* 📱\n\n" +
                "Cuidamos do seu perfil para que você foque no seu negócio! Oferecemos:\n" +
                "1. Planejamento e criação de conteúdo\n" +
                "2. Monitoramento e respostas a interações\n" +
                "3. Relatórios de desempenho\n\n" +
                "Digite o número da opção para saber mais detalhes."
            );
        } else if (message.body === '3') {
            userStage[user] = 'consultoria_crescimento'; // Avança o estágio para a próxima fase
            message.reply(
                "📈 *Consultoria para Crescimento* 📈\n\n" +
                "Nosso serviço de consultoria ajuda você a crescer com estratégias personalizadas:\n" +
                "1. Análise de perfil\n" +
                "2. Estratégias para engajamento\n" +
                "3. Dicas de conteúdo\n\n" +
                "Digite o número da opção para saber mais detalhes."
            );
        } else if (message.body === '4') {
            message.reply("Um de nossos especialistas entrará em contato com você em breve para entender suas necessidades e fornecer uma solução personalizada.");
            delete userStage[user]; // Reseta o estágio para permitir reiniciar o fluxo no próximo contato
        } else {
            enviarMenu(message); // Reinicia o menu inicial se a entrada for inválida
        }
    }
    // Estágio "Criação de Posts"
    else if (stage === 'criacao_posts') {
        if (message.body === '1') {
            message.reply("O *Pacote Básico* inclui 10 posts mensais com design personalizado, alinhados com a identidade visual da sua marca. Entre em contato para detalhes de valores!");
            delete userStage[user]; // Reseta o estágio após resposta final
        } else if (message.body === '2') {
            message.reply("O *Pacote Completo* inclui 20 posts mensais, stories interativos e otimização visual para engajamento. Um pacote ideal para quem quer crescer nas redes!");
            delete userStage[user];
        } else if (message.body === '3') {
            message.reply("Oferecemos também criação de *Posts Avulsos*, perfeitos para ocasiões especiais ou campanhas pontuais. Entre em contato para discutir seu projeto.");
            delete userStage[user];
        } else {
            userStage[user] = 'menu_principal'; // Volta ao menu principal se a entrada for inválida
            enviarMenu(message);
        }
    }
    // Estágio "Gerenciamento de Redes Sociais"
    else if (stage === 'gerenciamento_redes') {
        if (message.body === '1') {
            message.reply("No serviço de *Planejamento e criação de conteúdo*, desenvolvemos um calendário editorial com postagens alinhadas à estratégia da sua marca.");
            delete userStage[user];
        } else if (message.body === '2') {
            message.reply("O *Monitoramento e resposta a interações* garante que seu público seja atendido de forma rápida e eficiente.");
            delete userStage[user];
        } else if (message.body === '3') {
            message.reply("Com nossos *Relatórios de desempenho*, você acompanha os resultados e engajamento, identificando o que funciona melhor para seu público.");
            delete userStage[user];
        } else {
            userStage[user] = 'menu_principal';
            enviarMenu(message);
        }
    }
    // Estágio "Consultoria para Crescimento"
    else if (stage === 'consultoria_crescimento') {
        if (message.body === '1') {
            message.reply("Na *Análise de perfil*, identificamos pontos fortes e oportunidades de melhoria, ajudando seu perfil a se destacar.");
            delete userStage[user];
        } else if (message.body === '2') {
            message.reply("Oferecemos *Estratégias para engajamento* focadas em aumentar o alcance e a interação com seus seguidores.");
            delete userStage[user];
        } else if (message.body === '3') {
            message.reply("Com nossas *Dicas de conteúdo*, você aprende como criar posts que atraem e retêm a atenção do público.");
            delete userStage[user];
        } else {
            userStage[user] = 'menu_principal';
            enviarMenu(message);
        }
    }
    // Se o usuário enviar uma mensagem que não corresponde ao menu atual, mostra o menu inicial novamente
    else {
        enviarMenu(message);
    }
});

client.initialize();
