import requests
import numpy as np
from fastapi import FastAPI, Query
from sentence_transformers import SentenceTransformer
import ollama
from fastapi.middleware.cors import CORSMiddleware
#uvicorn chatbot:app --reload


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the embedding model
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

# Your backend API URL
BACKEND_URL = "http://localhost:6005/api/products"

def fetch_products():
    """Fetch products from the database via API"""
    response = requests.get(BACKEND_URL)
    if response.status_code == 200:
        try:
            return response.json().get("products", [])  # Ensure it's a list
        except ValueError:
            return []
    return []

def embed_text(text):
    """Convert text into a numerical vector using SentenceTransformer"""
    return embedding_model.encode(text)

def find_best_matches(query, products, top_n=3):
    """Find best-matching products based on similarity scores"""
    query_embedding = embed_text(query)
    product_embeddings = []
    valid_products = []

    for product in products:
        if not isinstance(product, dict):
            continue  # Skip invalid entries
        
        product_text = f"{product.get('title', '')} {product.get('description', '')} {product.get('type', '')} {product.get('metadata', '')}"
        product_embedding = embed_text(product_text)
        
        product_embeddings.append(product_embedding)
        valid_products.append(product)   
    
    if not valid_products:
        return []
    
    product_embeddings = np.array(product_embeddings)
    
    similarities = np.dot(product_embeddings, query_embedding)  
    best_indices = np.argsort(similarities)[::-1][:top_n]  

    return [valid_products[i] for i in best_indices]

def generate_response(user_query, recommended_products):
    """Use AI to generate a response with product recommendations"""
    if not recommended_products:
        return "Sorry, I couldn't find any matching products."

    product_list = "\n".join([f"- {p.get('title', 'Unnamed Product')} ({p.get('type', 'No category')})" for p in recommended_products])

    prompt = f"""
    User Query: "{user_query}"
    Recommended Products:
    {product_list}
    
    Provide a short, natural response recommending these products.
    """

    response = ollama.chat(model="mistral", messages=[{"role": "user", "content": prompt}])
    return response.get('message', {}).get('content', "Sorry, I couldn't generate a response.")

@app.get("/recommend")
def recommend(query: str = Query(..., title="User Query")):
    products = fetch_products()
    recommended_products = find_best_matches(query, products)

    if not recommended_products:
        
        return {"response": "Sorry, I couldn't find any matching products."}

    ai_response = generate_response(query, recommended_products)
    return {"response": ai_response, "products": recommended_products}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)