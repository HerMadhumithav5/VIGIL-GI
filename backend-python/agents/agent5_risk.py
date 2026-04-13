class RiskScorerAgent:
    def __init__(self):
        self.age_weights = {(0, 40): 0.2, (41, 60): 0.5, (61, 120): 0.8}
        self.gender_weights = {'male': 0.6, 'female': 0.5, 'other': 0.5}
        self.region_weights = {
            'stomach': 0.7, 'esophagus': 0.6, 'colon': 0.8,
            'rectum': 0.7, 'duodenum': 0.5, 'unknown': 0.5
        }
    
    def _get_age_weight(self, age):
        for (low, high), weight in self.age_weights.items():
            if low <= age <= high:
                return weight
        return 0.5
    
    def calculate_risk(self, metadata, prediction_confidence=None):
        age = int(metadata.get('age', 50))
        gender = metadata.get('gender', 'unknown')
        region = metadata.get('region', 'unknown')
        
        age_risk = self._get_age_weight(age)
        gender_risk = self.gender_weights.get(gender, 0.5)
        region_risk = self.region_weights.get(region, 0.5)
        
        clinical_risk = age_risk * 0.3 + gender_risk * 0.2 + region_risk * 0.5
        
        if prediction_confidence is not None:
            confidence_risk = 1 - (prediction_confidence / 100)
            final_risk = clinical_risk * 0.6 + confidence_risk * 0.4
        else:
            final_risk = clinical_risk
        
        if final_risk < 0.3:
            risk_level = "LOW"
        elif final_risk < 0.6:
            risk_level = "MODERATE"
        else:
            risk_level = "HIGH"
        
        return {
            'clinical_risk': float(clinical_risk),
            'final_risk': float(final_risk),
            'risk_level': risk_level,
            'components': {
                'age': float(age_risk),
                'gender': float(gender_risk),
                'region': float(region_risk)
            }
        }