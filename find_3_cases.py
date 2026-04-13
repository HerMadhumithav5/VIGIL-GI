import sys
import os
import cv2
import numpy as np

sys.path.insert(0, 'backend-python')
from agents.agent3_efficientnet import EfficientNetB5Agent
from agents.agent4_mcdropout import MCDropoutAgent

print("Loading model...")
agent3 = EfficientNetB5Agent()
agent4 = MCDropoutAgent(agent3.model)

# Your 5 classes
classes = ['polyps', 'dyed-lifted-polyps', 'dyed-resection-margins', 'esophagitis', 'normal-cecum']
base_path = 'data/raw/kvasir-5class'

results = {'CASE1_CANCER': [], 'CASE2_NORMAL': [], 'CASE3_UNCERTAIN': []}

for class_name in classes:
    folder = os.path.join(base_path, class_name)
    images = [f for f in os.listdir(folder) if f.endswith('.jpg')][:30]
    
    for img_file in images:
        img_path = os.path.join(folder, img_file)
        img = cv2.imread(img_path)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img = img.astype(np.float32) / 255.0
        
        pred = agent3.predict(img)
        confidence = pred['confidence']
        is_abnormal = pred['class'] in ['polyps', 'dyed-lifted-polyps', 'dyed-resection-margins', 'esophagitis']
        
        if confidence >= 85 and is_abnormal:
            results['CASE1_CANCER'].append((img_path, pred['class'], confidence))
        elif confidence < 60:
            results['CASE3_UNCERTAIN'].append((img_path, pred['class'], confidence))
        else:
            results['CASE2_NORMAL'].append((img_path, pred['class'], confidence))

print("\n" + "="*60)
for case in ['CASE1_CANCER', 'CASE2_NORMAL', 'CASE3_UNCERTAIN']:
    print(f"\n{case}: {len(results[case])} images found")
    for i, (path, cls, conf) in enumerate(results[case][:5]):
        print(f"  {i+1}. {os.path.basename(path)} -> {cls} ({conf:.1f}%)")