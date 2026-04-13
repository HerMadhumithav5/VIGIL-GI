import torch
from transformers import ViTImageProcessor, AutoModelForImageClassification
from PIL import Image
import numpy as np

class EfficientNetB5Agent:
    def __init__(self, num_classes=5, device=None):
        self.device = device or ('cuda' if torch.cuda.is_available() else 'cpu')
        print(f"   Using device: {self.device}")
        
        model_name = "mmuratarat/kvasir-v2-classifier"
        print(f"   Loading Kvasir-trained model...")
        
        # Use ViTImageProcessor instead of AutoImageProcessor
        self.processor = ViTImageProcessor.from_pretrained(model_name)
        self.model = AutoModelForImageClassification.from_pretrained(model_name)
        self.model = self.model.to(self.device)
        self.model.eval()
        
        self.all_class_names = list(self.model.config.id2label.values())
        
        self.class_names = [
            'dyed-lifted-polyps', 'dyed-resection-margins', 
            'esophagitis', 'normal-cecum', 'polyps'
        ]
        
        print("   ✅ Model loaded")
        
    def preprocess(self, image):
        if isinstance(image, np.ndarray):
            pil_img = Image.fromarray((image * 255).astype(np.uint8))
        inputs = self.processor(images=pil_img, return_tensors="pt")
        return inputs['pixel_values'].to(self.device)

    def predict(self, image):
        inputs = self.preprocess(image)
        
        with torch.no_grad():
            outputs = self.model(pixel_values=inputs)
            logits = outputs.logits
            probabilities = torch.softmax(logits, dim=1).cpu().numpy()[0]
        
        pred_idx = np.argmax(probabilities)
        predicted_class = self.all_class_names[pred_idx]
        confidence = float(probabilities[pred_idx] * 100)
        
        if predicted_class not in self.class_names:
            mapping = {
                'normal-pylorus': 'normal-cecum',
                'normal-z-line': 'normal-cecum',
                'ulcerative-colitis': 'dyed-lifted-polyps'
            }
            output_class = mapping.get(predicted_class, self.class_names[0])
        else:
            output_class = predicted_class
        
        return {
            'class': output_class,
            'class_id': self.class_names.index(output_class) if output_class in self.class_names else 0,
            'confidence': confidence,
            'all_probabilities': {
                self.class_names[i]: float(probabilities[i] * 100) if i < len(self.class_names) else 0
                for i in range(len(self.class_names))
            }
        }