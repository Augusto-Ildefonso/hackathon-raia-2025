// Importações necessárias
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Importa suas rotas
import IARouter from './src/routers/IARouter.js';

// --- 1. CONFIGURAÇÃO INICIAL ---

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config({ path: "../.env" });

// Cria a aplicação Express
const app = express();

// Define as variáveis a partir do ambiente ou usa valores padrão
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
// URL para seu próprio microserviço de verificação
const API_VERIFICATION_URL = `http://localhost:6969/ia/verification`;


// --- 2. MIDDLEWARES E ROTAS ---

// Habilita CORS para permitir requisições do frontend
app.use(cors());
// Habilita o Express a entender requisições com corpo em JSON
app.use(express.json());
// Serve os arquivos estáticos (HTML, CSS, JS do cliente) da pasta 'public'
app.use(express.static('public'));

// Usa seu router de IA para todas as rotas que começam com /ia
app.use("/ia", IARouter);


// --- 3. CRIAÇÃO DO SERVIDOR HTTP E SOCKET.IO ---

// Cria o servidor HTTP a partir da aplicação Express
const server = http.createServer(app);

// Anexa o Socket.IO ao servidor HTTP
const io = new Server(server, {
    cors: {
        origin: "*", // Permite qualquer origem se conectar via WebSocket
        methods: ["GET", "POST"]
    }
});


// --- 4. LÓGICA DO CHAT (SOCKET.IO) ---

// Função auxiliar para encontrar a primeira URL em um texto
function findUrlInText(text) {
    if (typeof text !== 'string') return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = text.match(urlRegex);
    return matches ? matches[0] : null;
}

io.on('connection', (socket) => {
    console.log('✅ Um usuário se conectou via WebSocket');

    socket.on('disconnect', () => {
        console.log('❌ Usuário desconectado');
    });

    // Escuta por mensagens do chat
    socket.on('chat message', async (originalMessage) => {
        console.log(`Mensagem recebida: "${originalMessage}"`);
        const urlFound = findUrlInText(originalMessage);
        let finalMessage = originalMessage;

        // Se encontrou um link, chama a API de verificação
        if (urlFound) {
            console.log(`Link encontrado: ${urlFound}. Verificando...`);
            try {
                const response = await axios.post(API_VERIFICATION_URL, {
                    message: originalMessage,
                    url: urlFound
                });
                // A mensagem final será a que sua API retornou
                finalMessage = response.data.finalMessage;
                console.log(`Mensagem processada pela IA: "${finalMessage}"`);
            } catch (error) {
                console.error("Erro ao verificar mensagem com a API:", error.message);
                finalMessage = `${originalMessage} (⚠️ Verificação falhou)`;
            }
        }
        
        // Transmite a mensagem final para todos os clientes conectados
        io.emit('chat message', finalMessage);
    });
});


// --- 5. INICIALIZAÇÃO DO SERVIDOR E CONEXÃO COM O BANCO ---

// Função principal para iniciar tudo
const startServer = async () => {
    try {
        if (!MONGODB_URI) {
            throw new Error("URI do MongoDB não definida no arquivo .env");
        }
        await mongoose.connect(MONGODB_URI);
        console.log("💾 Conectado ao MongoDB com sucesso.");
        
        server.listen(PORT, () => {
            console.log(`🚀 Servidor de Chat rodando em http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Falha ao iniciar o servidor:", error.message);
        process.exit(1); // Encerra o processo se não conseguir conectar ao DB
    }
};

// Chama a função para iniciar o servidor
startServer();