Create a python venvironment and install the required packages.

## Backend:
cd into the backend directory and
```bash
cd backend_py
```
 create a .env file, with these variables:
```
GEMINI_API_KEY=
ELEVENLABS_API_KEY=
```
Then, create a python virtual environment and install the required packages.
```bash
# Create a virtual environment
python3 -m venv venv
# Activate the virtual environment
source venv/bin/activate
# Install the required packages
pip install -r requirements.txt
```

## Frontend:
In the root directory.
Install the npm packages

```bash
# Install the npm packages
npm install
```

development
```bash
# Start the development server
npm run dev
```