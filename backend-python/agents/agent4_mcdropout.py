import torch
import numpy as np
import random

class MCDropoutAgent:
    def __init__(self, model, num_passes=20):
        self.model = model
        self.num_passes = num_passes
        
    def enable_dropout(self):
        for module in self.model.modules():
            if module.__class__.__name__.startswith('Dropout'):
                module.train()
    
    def predict_with_uncertainty(self, image, preprocess_fn):
        self.enable_dropout()
        image_tensor = preprocess_fn(image)
        
        predictions = []
        
        for _ in range(self.num_passes):
            with torch.no_grad():
                output = self.model(pixel_values=image_tensor)
                logits = output.logits
                prob = torch.softmax(logits, dim=1)
                predictions.append(prob.cpu().numpy())
        
        predictions = np.stack(predictions)
        mean_pred = np.mean(predictions, axis=0)[0]
        std_pred = np.std(predictions, axis=0)[0]
        
        cv = std_pred / (mean_pred + 1e-8)
        confidence_score = 100 * (1 - np.mean(cv))
        
        # Add slight variation for demo (removed the bug)
        # confidence_score = min(95, max(65, confidence_score + random.randint(-5, 5)))
        
        if confidence_score >= 85:
            uncertainty_level = "LOW"
        elif confidence_score >= 60:
            uncertainty_level = "MEDIUM"
        else:
            uncertainty_level = "HIGH"
        
        return {
            'mean_probabilities': mean_pred.tolist(),
            'std_probabilities': std_pred.tolist(),
            'confidence_score': float(confidence_score),
            'uncertainty_level': uncertainty_level,
            'num_passes': self.num_passes
        }