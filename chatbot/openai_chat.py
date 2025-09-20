from flask import Flask, request, jsonify
from openai import OpenAI
import os
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class OpenAiManager:
    def __init__(self):
        self.chat_history = [] # Stores the entire conversation
        try:
            self.client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])
        except KeyError:
            exit("Ooops! You forgot to set OPENAI_API_KEY in your environment!")
        except Exception as e:
            exit(f"An error occurred while initializing OpenAI client: {e}")

    def chat(self, prompt=""):
        if not prompt:
            raise ValueError("Prompt cannot be empty")

        chat_question = [{"role": "user", "content": prompt}]

        logger.info("Asking ChatGPT a question...")
        completion = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=chat_question
        )

        # Process the answer
        openai_answer = completion.choices[0].message.content

        # Extract verdict from the last word
        try:
            last_word = openai_answer.strip().split()[-1].lower().rstrip('.,!?;:')
            if "verdadeiro" in last_word:
                veridico = True
            elif "falso" in last_word:
                veridico = False
            else:
                raise ValueError(f"Could not determine verdict. Last word received: '{last_word}'")
        except IndexError:
            raise ValueError("Received an empty or malformed response from OpenAI.")

        logger.info(f"Response is verdict: {veridico}")
        return {"lineuzinho": openai_answer, "veridico": veridico}


# Initialize Flask app and OpenAiManager
app = Flask(__name__)
openai_manager = OpenAiManager()

@app.route('/ask', methods=['POST'])
def ask_chatgpt():
    """
    Endpoint to ask a question to ChatGPT.
    Expects a JSON payload: {"prompt": "Your question here"}
    Returns a JSON response: {"lineuzinho": "Answer", "veridico": true/false}
    """
    try:
        data = request.get_json()
        if not data or 'prompt' not in data:
            return jsonify({"error": "Missing 'prompt' in JSON request"}), 400

        prompt = data['prompt']
        result = openai_manager.chat(prompt)

        return jsonify(result), 200

    except ValueError as ve:
        logger.error(f"Value Error: {ve}")
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        logger.error(f"Internal Server Error: {e}")
        return jsonify({"error": "An internal error occurred while processing your request."}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
