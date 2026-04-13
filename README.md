# VIGIL-GI

## Vision-Integrated Agentic Framework for Confidence-Driven Gastrointestinal Cancer Detection

## 📌 Overview

VIGIL-GI is an AI-powered clinical decision support system for gastrointestinal cancer detection. Unlike traditional AI that outputs only labels, VIGIL-GI provides **confidence scores**, **uncertainty quantification**, and **autonomous clinical recommendations**.

## 🎯 Key Features

| Feature                        | Description                                                              |
| ------------------------------ | ------------------------------------------------------------------------ |
| **6-Agent Pipeline**           | Modular, explainable, auditable architecture                             |
| **Uncertainty Quantification** | Monte Carlo Dropout (20 passes) → confidence score                       |
| **Patient Risk Scoring**       | Age (30%) + Gender (20%) + Region (50%)                                  |
| **Clinical Decision Routing**  | HIGH (>85%) → Treat \| MEDIUM (60-85%) → Review \| LOW (<60%) → Escalate |
| **NBI Simulation**             | R×0.3, G×1.4, B×1.8 — simulates clinical imaging                         |
| **PDF Report Generation**      | Downloadable clinical reports                                            |
| **Full-Stack Deployment**      | Accessible from any hospital browser                                     |

---

## 🏗️ System Architecture

User Upload (Image + Age + Gender + Region)
│
▼
┌─────────────────────────────────────────────────────────────┐
│ Agent 1: Input Processor → Validate, resize, normalize │
│ Agent 2: NBI Transformer → R×0.3, G×1.4, B×1.8 │
│ Agent 3: EfficientNet-B5 → Feature extraction & prediction│
│ Agent 4: MC Dropout (20 passes) → Confidence score │
│ Agent 5: Risk Scorer → Age + Gender + Region → Risk level │
│ Agent 6: Decision Router → TREAT / REVIEW / ESCALATE │
└─────────────────────────────────────────────────────────────┘
│
▼
Clinical Report + PDF Download

text

---

## 🛠️ Tech Stack

| Layer              | Technology                       |
| ------------------ | -------------------------------- |
| **Frontend**       | React.js + Vite                  |
| **Backend API**    | Node.js + Express                |
| **Database**       | MongoDB                          |
| **ML/AI**          | Python + FastAPI + PyTorch       |
| **Model**          | EfficientNet-B5 (Kvasir-trained) |
| **Uncertainty**    | Monte Carlo Dropout              |
| **PDF Generation** | ReportLab                        |

---

## 📋 Prerequisites

- Python 3.11+
- Node.js 18+
- MongoDB
- Git

---

## 🚀 Installation

### 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/VIGIL-GI.git
cd VIGIL-GI
2. Python Backend Setup
bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
3. Node Backend Setup
bash
cd backend-node
npm install
4. React Frontend Setup
bash
cd frontend-react
npm install
▶️ Running the Application
Open 3 terminals:

Terminal 1: Python ML Backend (Port 8000)
bash
cd backend-python
python main.py
Terminal 2: Node Backend (Port 5000)
bash
cd backend-node
node server.js
Terminal 3: React Frontend (Port 5173)
bash
cd frontend-react
npm run dev
Open Browser
text
http://localhost:5173
📊 Project Structure
text
VIGIL-GI/
├── backend-python/
│   ├── agents/
│   │   ├── agent1_input.py
│   │   ├── agent2_nbi.py
│   │   ├── agent3_efficientnet.py
│   │   ├── agent4_mcdropout.py
│   │   ├── agent5_risk.py
│   │   ├── agent6_router.py
│   │   └── pipeline.py
│   ├── main.py
│   └── pdf_generator.py
├── backend-node/
│   ├── server.js
│   └── package.json
├── frontend-react/
│   └── src/
│       ├── pages/
│       ├── components/
│       └── App.jsx
├── requirements.txt
└── README.md
📈 Performance Metrics
Metric	Value
Validation Accuracy	93.9%
Sensitivity	92.1%
Specificity	94.2%
AUC Score	0.962
Inference Time	1-2 seconds
MC Dropout Passes	20
Confidence Distribution
Level	Threshold	Percentage
HIGH	>85%	72%
MEDIUM	60-85%	20%
LOW	<60%	8%
📝 Output Cases
Case	Confidence	Output
Cancer Detected	HIGH (>85%) + Abnormal	🔴 Immediate treatment required
No Cancer	HIGH (>85%) + Normal	🟢 Positive result, routine screening
AI Uncertain	LOW (<60%)	🟡 Escalate to specialist
👥 Team
Name	Role
Madhumitha V	Developer
Medha S	Developer
Project Guide: Mrs. S. Kavitha, AP/CSE

📄 License
MIT

🙏 Acknowledgments
Kvasir Dataset (Simula Research Laboratory)

Hugging Face Transformers

EfficientNet-B5
```
