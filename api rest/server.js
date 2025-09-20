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
const API_VERIFICATION_URL = `http://172.16.21.149:5000/ask`;


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
        console.log(`Mensagem recebida de ${socket.id}: "${originalMessage}"`);
        const urlFound = findUrlInText(originalMessage);
        let finalMessage = originalMessage;

        // Se encontrou um link, chama a API de verificação
        if (urlFound) {
            console.log(`Link encontrado: ${urlFound}. Verificando...`);
            try {
                const response = await axios.post(API_VERIFICATION_URL, {
                    url: urlFound
                });
                
                console.log('Resposta completa da API:', response.data);
                
                // Extrai os campos corretos da resposta
                const { lineuzinho, veridico } = response.data;
                
                if (veridico) {
                    // Se a notícia é verídica, mantém a mensagem original
                    finalMessage = originalMessage;
                    console.log(`Notícia verídica - mantendo mensagem original`);
                } else {
                    // Se a notícia é falsa, usa a mensagem do GPT
                    if (lineuzinho) {
                        finalMessage = `❌ ${lineuzinho}`;
                        console.log(`Notícia falsa - usando resposta do GPT`);
                    } else {
                        console.warn('Campo "lineuzinho" não encontrado na resposta da API');
                        finalMessage = `❌ ${originalMessage} (Notícia não verificada - resposta da API inválida)`;
                    }
                }
                
                console.log(`Mensagem processada: "${finalMessage}"`);
                console.log(`Veracidade do link: ${veridico ? 'Verdadeiro' : 'Falso'}`);
                
            } catch (error) {
                console.error("Erro ao verificar mensagem com a API:", error.message);
                if (error.response) {
                    console.error("Dados de erro da API:", error.response.data);
                }
                finalMessage = `${originalMessage} (⚠️ Verificação falhou)`;
            }
        }
        
        // Garantir que finalMessage nunca seja undefined, null ou vazio
        if (!finalMessage || finalMessage === 'undefined' || finalMessage === 'null') {
            finalMessage = originalMessage || 'Mensagem vazia';
        }
        
        // Transmite a mensagem final para todos os clientes conectados
        io.emit('chat message', {
            message: finalMessage,
            senderId: socket.id,
            timestamp: new Date().toISOString()
        });
        
        console.log(`Mensagem enviada para todos os clientes: "${finalMessage}"`);
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