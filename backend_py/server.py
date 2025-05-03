import os
import logging
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from diabetes_rag_agent import DiabetesRagAgent

diabetes_rag_agent = DiabetesRagAgent()  # instantiate the agent
import socket

# Add this import:
from flask_cors import CORS

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
PORT = int(os.getenv("PORT", 3001))

# Allow CORS for your frontend domain
CORS(app, origins=[
    "https://diabe-ai-buddy-frontend.onrender.com",
    "http://localhost:5173"  # Optional: for local dev
])

def get_local_ips():
    """Get a list of local IP addresses."""
    ips = []
    hostname = socket.gethostname()
    try:
        local_ip = socket.gethostbyname(hostname)
        ips.append(local_ip)
    except Exception:
        pass
    # Try to get all IPs from interfaces
    try:
        for ip in socket.gethostbyname_ex(hostname)[2]:
            if not ip.startswith("127."):
                ips.append(ip)
    except Exception:
        pass
    return list(set(ips))

@app.route('/api/answerQuestion', methods=['POST'])
def answer_question():
    data = request.get_json()
    question = data.get('question')
    category = data.get('category')
    conversation_history = data.get('conversationHistory')
    try:
        result = diabetes_rag_agent.answer_question(
                question=question,
            category=category,
            conversation_history=conversation_history
        )
        return jsonify(result), 200
    except Exception as e:
        logger.exception(f"Error processing question: {e}")
        return jsonify({'error': 'Failed to process the question.'}), 500

@app.route('/', methods=['GET'])
def home():
    logger.info('GET / - Home route accessed')
    return 'Hello from the backend!', 200

@app.route('/health', methods=['GET'])
def health():
    logger.info('GET /health - Health check accessed')
    return jsonify({
        'status': 'OK',
        'timestamp': __import__('datetime').datetime.utcnow().isoformat() + 'Z',
        'uptime': float(os.times()[4])
    }), 200

@app.errorhandler(404)
def not_found(e):
    logger.warning(f'404 - Route not found: {request.method} {request.url}')
    return jsonify({'error': 'Route not found'}), 404

@app.errorhandler(Exception)
def handle_exception(e):
    logger.exception('Global error handler:')
    return jsonify({
        'error': 'Internal Server Error',
        'message': str(e) if os.getenv('FLASK_ENV') == 'development' else None
    }), 500

def preload_documents():
    logger.info('Preloading diabetes documents and vector stores...')
    diabetes_rag_agent.preload_documents()
    logger.info('Documents loaded.')

if __name__ == '__main__':
    try:
        preload_documents()
        print("Preloading documents...")
    except Exception as err:
        logger.error(f'Failed to preload documents: {err}')
        exit(1)
    local_ips = get_local_ips()
    logger.info('\nServer is running on:')
    logger.info(f'• Local:            http://localhost:{PORT}')
    for ip in local_ips:
        logger.info(f'• Network:          http://{ip}:{PORT}')
    logger.info('\nYou can test the health endpoint at:')
    logger.info(f'• Local:            http://localhost:{PORT}/health')
    for ip in local_ips:
        logger.info(f'• Network:          http://{ip}:{PORT}/health')
    logger.info('\nPress CTRL+C to stop the server')
    app.run(host='0.0.0.0', port=PORT, debug=True)  # Enable hot reloading
