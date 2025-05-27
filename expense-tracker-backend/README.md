# Create & activate virtual environment
python -m venv venv
source venv/bin/activate  
# or
 venv\Scripts\activate (Windows)

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn app.main:app --reload

# Browse 
http://127.0.0.1:8000/