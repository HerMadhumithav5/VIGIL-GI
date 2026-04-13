class DecisionRouterAgent:
    def __init__(self):
        print("   ✅ Decision Router Ready (with Esophagitis special case)")
    
    def route(self, prediction, uncertainty, risk, metadata):
        confidence = uncertainty['confidence_score']
        risk_level = risk['risk_level']
        predicted_class = prediction['class']
        
        # Define categories
        cancer_classes = ['polyps', 'dyed-lifted-polyps']
        post_resection_classes = ['dyed-resection-margins']
        inflammation_classes = ['esophagitis']
        normal_classes = ['normal-cecum']
        
        is_cancer = predicted_class in cancer_classes
        is_post_resection = predicted_class in post_resection_classes
        is_inflammation = predicted_class in inflammation_classes
        is_normal = predicted_class in normal_classes
        
        # CASE 1a: CANCER DETECTED (Polyps, Dyed-lifted polyps)
        if confidence >= 85 and is_cancer:
            return {
                'case': 'CANCER_DETECTED',
                'action': 'TREAT',
                'urgency': 'IMMEDIATE',
                'color': 'red',
                'icon': '🔴',
                'header': 'CANCER DETECTED - Immediate Action Required',
                'message': f'⚠️ High probability of {predicted_class} detected with {confidence:.1f}% confidence. Immediate gastroenterology consultation required.',
                'next_steps': [
                    f'Schedule {predicted_class} treatment within 48 hours',
                    'Refer to gastroenterologist immediately',
                    'Consider biopsy for histopathological confirmation'
                ]
            }
        
        # CASE 1b: POST-RESECTION (Follow up needed)
        elif confidence >= 85 and is_post_resection:
            return {
                'case': 'POST_RESECTION',
                'action': 'REVIEW',
                'urgency': 'SCHEDULED',
                'color': 'orange',
                'icon': '🟠',
                'header': 'POST-RESECTION - Follow Up Required',
                'message': f'⚠️ Resection margins detected with {confidence:.1f}% confidence. Follow-up surveillance required.',
                'next_steps': [
                    'Schedule follow-up endoscopy in 6 months',
                    'Review pathology report',
                    'Monitor for recurrence'
                ]
            }
        
        # CASE 2a: ESOPHAGITIS (Inflammation, not cancer)
        elif confidence >= 85 and is_inflammation:
            return {
                'case': 'ESOPHAGITIS',
                'action': 'TREAT_MEDICATION',
                'urgency': 'SCHEDULED',
                'color': 'yellow',
                'icon': '🟡',
                'header': 'ESOPHAGITIS DETECTED - Treatment Required',
                'message': f'⚠️ Inflammation detected in esophagus with {confidence:.1f}% confidence. This is NOT cancer, but requires medical treatment.',
                'next_steps': [
                    'Prescribe proton pump inhibitors (PPIs)',
                    'Lifestyle modifications (avoid spicy foods, alcohol)',
                    'Follow-up endoscopy in 6-8 weeks',
                    'Test for H. pylori if indicated'
                ]
            }
        
        # CASE 2b: NORMAL (No cancer, positive note)
        elif confidence >= 85 and is_normal:
            return {
                'case': 'NO_CANCER',
                'action': 'REVIEW',
                'urgency': 'SCHEDULED',
                'color': 'green',
                'icon': '🟢',
                'header': 'NO CANCER DETECTED - Positive Result',
                'message': f'✅ No GI cancer detected with {confidence:.1f}% confidence. Your results are normal.',
                'next_steps': [
                    'Continue routine cancer screening',
                    'Schedule next checkup in 1 year',
                    'Consult doctor for other health concerns'
                ]
            }
        
        # CASE 3: AI UNCERTAIN (Low confidence)
        elif confidence < 60:
            return {
                'case': 'AI_UNCERTAIN',
                'action': 'ESCALATE',
                'urgency': 'IMMEDIATE',
                'color': 'amber',
                'icon': '🟡',
                'header': 'AI UNCERTAIN - Specialist Review Required',
                'message': f'⚠️ AI cannot determine with confidence ({confidence:.1f}%). This is a rare case requiring specialist review.',
                'next_steps': [
                    'IMMEDIATE senior specialist review',
                    'DO NOT treat based on AI alone',
                    'Repeat endoscopy with NBI',
                    'Consider biopsy or CT scan'
                ]
            }
        
        # Default: Medium confidence case
        else:
            return {
                'case': 'MEDIUM_CONFIDENCE',
                'action': 'REVIEW',
                'urgency': 'SCHEDULED',
                'color': 'blue',
                'icon': '🔵',
                'header': 'MEDIUM CONFIDENCE - Further Review Needed',
                'message': f'ℹ️ {predicted_class} detected with {confidence:.1f}% confidence. Confirmatory tests recommended.',
                'next_steps': [
                    'Order confirmatory endoscopy',
                    'Request second opinion',
                    'Review patient history'
                ]
            }