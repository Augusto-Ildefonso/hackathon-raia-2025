from flask import Flask, request, jsonify
from openai import OpenAI
from scrapper import extrair_tags_article
import os
import json
import logging

# Define the base system prompt. This should NOT be modified globally.
BASE_SYSTEM_PROMPT = """
Você é um especialista em detecção de notícias falsas, com extenso conhecimento em diversas áreas, como política,
medicina, automóveis, vacinas, etc. Você vai receber notícias dos mais diversos ambitos e sua função é analisa-las
e baseadas em outras notícias de outras fontes que você terá que pesquisar, você irá me fazer as seguintes coisas:
1) Indique se essa notícia é possivelmente fake news.
2) Caso seja fakenews, indique os principais motivos, com referências, dentro da própria notícia. Caso não seja fakenews,
faça um resumo com as principais informações da notícia
3) Caso seja fakenews, apresente contrapontos com outras notícias confiáveis.
4) Dê um score entre 0 a 100% de qual a probabilidade dessa notícia ser fakenews. Entre 0 a 10, fale o quanto essa notícia
é enviésada.
5) Termine sua prompt ou com a palavra verdadeiro, caso a noticia, provavelmente, não seja veridica ou com a palavra falso, caso ela seja,
provavelmente, fake news.
6) Não escreva com sintáxe de markdown. Então nada de tentar enfâse com '**', ou coisas similares.
IMPORTANTE: Sua resposta DEVE ser um objeto JSON válido com a seguinte estrutura:
{
  "lineuzinho": "Sua análise completa da notícia aqui, seguindo os pontos 1, 2, 3 e 4.",
  "veridico": true // ou false. Use 'true' se a notícia for provavelmente VERDADEIRA (não é fake news). Use 'false' se a notícia for provavelmente FALSA (é fake news).
}
A mensagem segue abaixo:
"""

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class OpenAiManager:
    def __init__(self):
        self.chat_history = []  # Stores the entire conversation
        try:
            self.client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
        except KeyError:
            exit("Ooops! You forgot to set OPENAI_API_KEY in your environment!")
        except Exception as e:
            exit(f"An error occurred while initializing OpenAI client: {e}")

    def chat(self, system_prompt, user_content):
        """
        Asks a question using a system prompt and user content, expecting a JSON response.
        """
        if not user_content:
            raise ValueError("User content cannot be empty")

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_content},
        ]

        logger.info("Asking ChatGPT a question...")
        completion = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            response_format={
                "type": "json_object"
            },  # This forces the model to return JSON
        )

        # Get the raw response
        raw_response = completion.choices[0].message.content

        try:
            # Parse the JSON response
            parsed_response = json.loads(raw_response)
            # Extract the fields
            analysis = parsed_response.get("lineuzinho", "")
            is_veridical = parsed_response.get(
                "veridico", None
            )  # This will be True or False

            if is_veridical is None:
                raise ValueError(
                    "The 'is_veridical' field is missing from the JSON response."
                )

            # Convert is_veridical to the 'veridico' field as per your original spec.
            # Note: 'is_veridical' being True means the news is TRUE, so 'veridico' should also be True.
            veridico = is_veridical

            logger.info(f"Response is verdict: {veridico}")
            return {"lineuzinho": analysis, "veridico": veridico}

        except json.JSONDecodeError as je:
            logger.error(f"Failed to parse JSON from OpenAI response: {raw_response}")
            raise ValueError(f"The model did not return valid JSON: {je}")
        except Exception as e:
            logger.error(f"Error processing OpenAI response: {e}")
            raise ValueError(f"Failed to process the model's response: {e}")


# Initialize Flask app and OpenAiManager
app = Flask(__name__)
openai_manager = OpenAiManager()


@app.route("/ask", methods=["POST"])
def ask_chatgpt():
    """
    Endpoint to analyze a news article from a URL.
    Expects a JSON payload: {"url": "https://example.com/news-article"}
    Returns a JSON response: {"lineuzinho": "Analysis", "veridico": true/false}
    """
    try:
        data = request.get_json()
        if not data or "url" not in data:
            return jsonify({"error": "Missing 'url' in JSON request"}), 400

        url = data["url"]
        logger.info(f"Fetching content from URL: {url}")

        # Extract text from the website
        extracted_text = extrair_tags_article(url)
        if not extracted_text:
            return (
                jsonify({"error": "Failed to extract content from the provided URL"}),
                400,
            )

        # Use the base system prompt and append the extracted text as the user's message.
        # We pass the full prompt and the user content separately to the chat method.
        result = openai_manager.chat(
            system_prompt=BASE_SYSTEM_PROMPT, user_content=extracted_text
        )

        return jsonify(result), 200

    except ValueError as ve:
        logger.error(f"Value Error: {ve}")
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        logger.error(f"Internal Server Error: {e}")
        return (
            jsonify(
                {"error": "An internal error occurred while processing your request."}
            ),
            500,
        )


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
