import server from "./src/app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Carregando as variáveis de ambieante
dotenv.config();


// Definindo variáveis globais
const PORT = 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Conectando com o MongoDB
mongoose.connect(MONGODB_URI);

server.listen(PORT, () => {console.log("Servidor funcionando.\n")})