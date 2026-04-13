import cv2
import numpy as np

class InputProcessor:
    def __init__(self, target_size=(224, 224)):
        self.target_size = target_size
        
    def process(self, image_bytes, metadata=None):
        try:
            nparr = np.frombuffer(image_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if img is None:
                raise ValueError("Invalid image data")
            
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            img = cv2.resize(img, self.target_size)
            img = img.astype(np.float32) / 255.0
            
            if metadata:
                validated = {
                    "age": int(metadata.get("age", 50)),
                    "gender": metadata.get("gender", "unknown"),
                    "region": metadata.get("region", "unknown")
                }
            else:
                validated = {"age": 50, "gender": "unknown", "region": "unknown"}
            
            return {
                "image": img,
                "metadata": validated,
                "original_shape": img.shape[:2],
                "success": True
            }
              
        except Exception as e:
            return {"success": False, "error": str(e)}