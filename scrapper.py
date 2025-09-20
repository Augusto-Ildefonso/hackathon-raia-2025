import requests
from bs4 import BeautifulSoup

def extrair_tags_article(url: str):
    print(f"Iniciando busca por tags <article> em: {url}\n")
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.content, 'html.parser')
        lista_de_articles = soup.find_all('article')

        if not lista_de_articles:
            print("Nenhuma tag <article> foi encontrada na página.")
            return

        for i, article_tag in enumerate(lista_de_articles, 1):
            texto_do_article = article_tag.get_text(separator='\n', strip=True)
            
            print(texto_do_article)

    except requests.exceptions.RequestException as e:
        print(f"Erro de conexão ao tentar acessar a URL: {e}")
    except Exception as e:
        print(f"Ocorreu um erro inesperado: {e}")


if __name__ == "__main__":
    url_alvo = input("Insira a URL: ")
    
    extrair_tags_article(url_alvo)