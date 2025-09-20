from flask import Flask, request, jsonify
from openai import OpenAI
from scrapper import extrair_tags_article
import os
import json
import logging

SYSTEM_PROMPT = """
Você é um especialista em detecção de notícias falsas, com extenso conhecimento em diversas áreas, como política,
medicina, automóveis, vacinas, etc. Você vai receber o texto de uma notícia.

SUA TAREFA PRINCIPAL É USAR A FERRAMENTA DE NAVEGAÇÃO (browser) PARA PROCURAR NOTÍCIAS RECENTES E CONFIÁVEIS QUE POSSAM
CORROBORAR OU DEBUNKAR A NOTÍCIA FORNECIDA. NÃO CONFIE APENAS NO SEU CONHECIMENTO INTERNO.
BUSQUE SEMPRE FONTES CONFIÁVEIS DOS MAIS DIVERSOS MEIOS E SEMPRE GERE.

Depois de pesquisar, você irá me fazer as seguintes coisas:
1) Indique se essa notícia é possivelmente fake news, com base nas evidências que você encontrou online.
2) Caso seja fakenews, indique os principais motivos, com referências às fontes que você encontrou. Caso não seja fakenews,
faça um resumo com as principais informações da notícia e cite as fontes que a corroboram. Tanto o resumo ou os motivos devem ter NO MÁXIMO 150 PALAVRAS 
3) Apresente contrapontos com outras notícias confiáveis que você encontrou.
4) Dê um score entre 0 a 100% de qual a probabilidade dessa notícia ser fakenews. NÃO SE ESQUEÇA DESSE SCORE. COLOQUE NO INICIO DA MENSAGEM.
5) NÃO USE SINTAXE MARKDOWN. Para colocar links, faça como em referências bibiliográficas, coloque um número e no final, pós texto corrido, e para cada numero assinale a referência correspondente. Então se quiser citar uma noticia que corrabore um ponto de vista, coloque na frase [1] e no final do texto, escreva:
[1]: url da noticia
6) Tente formatar como se fosse uma mensagem do whatsapp, deixando a formatação bonita, com possíveis bullet point, destacando itens importantes.
Segue um exemplo de como deveria ser a resposta:
{
  "lineuzinho": "*Chance de ser fakenews: '{}%'*\nResumo da noticia: '{}'\nReferencias: '{}'",
  "veridico": true // ou false. Use 'true' se a notícia for provavelmente VERDADEIRA (não é fake news). Use 'false' se a notícia for provavelmente FALSA (é fake news).
}

Onde as chaves são onde você deve colocar as partes importantes.
IMPORTANTE: Sua resposta final DEVE ser um objeto JSON válido com a seguinte estrutura:
{
  "lineuzinho": "Sua análise completa da notícia aqui, seguindo os pontos 1, 2, 3 e 4. MENCIONE AS FONTES QUE VOCÊ CONSULTOU.",
  "veridico": true // ou false. Use 'true' se a notícia for provavelmente VERDADEIRA (não é fake news). Use 'false' se a notícia for provavelmente FALSA (é fake news).
}
"""

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class OpenAiManager:
    def __init__(self):
        self.chat_history = []
        try:
            self.client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
        except KeyError:
            exit("Falha, não se tem a OPEN_API_KEY no ambiente")
        except Exception as e:
            exit(
                f"Um erro ocorreu e não foi possível inicializar o cliente OPENAI: {e}"
            )

    def chat(self, system_prompt, user_content):
        """
        Faz uma pergunta com o prompt de sistema e conteúdo de usuário, permitindo
        que o modelo use ferramentas como browser.
        Saída em JSON
        """
        if not user_content:
            raise ValueError("User content cannot be empty")

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_content},
        ]

        logger.info("Asking ChatGPT a question, allowing tool use...")

        # Manda as mensagens para o GPT-4 com pesquisa na web.
        response = self.client.chat.completions.create(
            model="gpt-4o-mini-search-preview",
            messages=messages,
        )

        raw_response = response.choices[0].message.content

        print(raw_response)
        parsed_response = json.loads(raw_response)
        analysis = parsed_response.get("lineuzinho", "")
        is_veridical = parsed_response.get("veridico", None)

        if is_veridical is None:
            None
        veridico = is_veridical
        logger.info(f"Response is verdict: {veridico}")
        print(parsed_response)
        return {"lineuzinho": analysis, "veridico": veridico}


# Inicializa o Flask
app = Flask(__name__)
openai_manager = OpenAiManager()


@app.route("/ask", methods=["POST"])
def ask_chatgpt():
    """
    Endpoint para realizar a analise de uma URL.
    Espera um JSON payload: {"url": "https://example.com/news-article"}
    Espera JSON response: {"lineuzinho": "Analysis", "veridico": true/false}
    """
    data = request.get_json()
    print(data)
    if not data or "url" not in data:
        return jsonify({"error": "Missing 'url' in JSON request"}), 400

    url = data["url"]
    logger.info(f"Fetching content from URL: {url}")

    # Pega o corpo da notícia
    extracted_text = extrair_tags_article(url)
    if not extracted_text:
        return (
            jsonify({"error": "Failed to extract content from the provided URL"}),
            400,
        )

    # Passe a promprt e extrai o texto
    result = openai_manager.chat(
        system_prompt=SYSTEM_PROMPT, user_content=extracted_text
    )

    return jsonify(result), 200

    return (
        jsonify({"error": "An internal error occurred while processing your request."}),
        500,
    )


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
