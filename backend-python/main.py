from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from agents.pipeline import VIGILGIPipeline
from pdf_generator import generate_pdf
import base64
import json

app = FastAPI(title="VIGIL-GI Python Backend")
pipeline = VIGILGIPipeline()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"project": "VIGIL-GI", "status": "running", "version": "1.0.0"}

@app.post("/api/predict")
async def predict(
    file: UploadFile = File(...),
    age: int = Form(50),
    gender: str = Form("unknown"),
    region: str = Form("unknown"),
    name: str = Form("Unknown")
):
    contents = await file.read()
    metadata = {"age": age, "gender": gender, "region": region, "name": name}
    result = pipeline.process(contents, metadata)
    
    # Generate PDF
    pdf_base64 = None
    try:
        pdf_buffer = generate_pdf(
            patient_data=metadata,
            scan_result={
                'finding': result['summary']['prediction'],
                'confidence': result['summary']['confidence'],
                'risk_level': result['summary']['risk_level']
            },
            prediction_result=result['agents']['agent6']['output'],
            output_case=result['summary'].get('output_case', 'UNKNOWN')
        )
        pdf_base64 = base64.b64encode(pdf_buffer.getvalue()).decode('utf-8')
        print(f"✅ PDF generated, length: {len(pdf_base64)}")
    except Exception as e:
        print(f"❌ PDF error: {e}")
    
    # Return response
    response_data = {
        "filename": file.filename,
        "metadata": metadata,
        "pipeline_result": result,
        "pdf_base64": pdf_base64
    }
    
    return JSONResponse(content=response_data)

@app.get("/api/health")
def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)