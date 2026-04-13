from agents.agent1_input import InputProcessor
from agents.agent2_nbi import NBITransformer
from agents.agent3_efficientnet import EfficientNetB5Agent
from agents.agent4_mcdropout import MCDropoutAgent
from agents.agent5_risk import RiskScorerAgent
from agents.agent6_router import DecisionRouterAgent

class VIGILGIPipeline:
    def __init__(self):
        print("=" * 50)
        print("VIGIL-GI: Initializing 6 Agents")
        print("=" * 50)
        
        print("[1/6] Loading Input Processor...")
        self.agent1 = InputProcessor()
        
        print("[2/6] Loading NBI Transformer...")
        self.agent2 = NBITransformer()
        
        print("[3/6] Loading EfficientNet-B5...")
        self.agent3 = EfficientNetB5Agent()
        
        print("[4/6] Loading MC Dropout...")
        self.agent4 = MCDropoutAgent(self.agent3.model)
        
        print("[5/6] Loading Risk Scorer...")
        self.agent5 = RiskScorerAgent()
        
        print("[6/6] Loading Decision Router...")
        self.agent6 = DecisionRouterAgent()
        
        print("=" * 50)
        print("✅ All 6 agents initialized!")
        print("=" * 50)
        
    def process(self, image_bytes, metadata):
        # Agent 1
        result1 = self.agent1.process(image_bytes, metadata)
        if not result1["success"]:
            return {"error": result1["error"]}
        
        # Agent 2
        nbi_image = self.agent2.transform(result1["image"])
        
        # Agent 3
        prediction = self.agent3.predict(nbi_image)
        
        # Agent 4
        uncertainty = self.agent4.predict_with_uncertainty(nbi_image, self.agent3.preprocess)
        
        # Agent 5
        risk = self.agent5.calculate_risk(result1["metadata"], uncertainty['confidence_score'])
        
        # Agent 6
        decision = self.agent6.route(prediction, uncertainty, risk, result1["metadata"])
        
        return {
            "status": "complete",
            "summary": {
                "prediction": prediction['class'],
                "confidence": uncertainty['confidence_score'],
                "risk_level": risk['risk_level'],
                "recommended_action": decision['action'],
                "output_case": decision['case']
            },
            "agents": {
                "agent6": {"output": decision}
            }
        }