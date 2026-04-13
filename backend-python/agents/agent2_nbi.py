import numpy as np

class NBITransformer:
    def __init__(self):
        self.weights = np.array([0.3, 1.4, 1.8])
        
    def transform(self, image):
        nbi = image * self.weights
        nbi = np.clip(nbi, 0, 1)
        return nbi