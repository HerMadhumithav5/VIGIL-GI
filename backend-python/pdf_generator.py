from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from datetime import datetime
import io
import os

def generate_pdf(patient_data, scan_result, prediction_result, output_case):
    """Generate clinical PDF report"""
    
    try:
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, 
                                rightMargin=20*mm, leftMargin=20*mm,
                                topMargin=20*mm, bottomMargin=20*mm)
        styles = getSampleStyleSheet()
        
        # Colors based on case
        if output_case == 'CANCER_DETECTED':
            header_color = colors.HexColor('#dc3545')
        elif output_case == 'NO_CANCER':
            header_color = colors.HexColor('#28a745')
        elif output_case == 'ESOPHAGITIS':
            header_color = colors.HexColor('#f97316')
        else:
            header_color = colors.HexColor('#0B2F9E')
        
        # Custom styles
        title_style = ParagraphStyle(
            'Title', 
            parent=styles['Heading1'], 
            fontSize=18, 
            alignment=TA_CENTER, 
            textColor=header_color,
            spaceAfter=20
        )
        
        heading_style = ParagraphStyle(
            'Heading',
            parent=styles['Heading2'],
            fontSize=14,
            textColor=colors.HexColor('#1a1a2e'),
            spaceAfter=10,
            spaceBefore=10
        )
        
        normal_style = ParagraphStyle(
            'Normal',
            parent=styles['Normal'],
            fontSize=10,
            spaceAfter=6
        )
        
        story = []
        
        # Title
        story.append(Paragraph("VIGIL-GI CLINICAL REPORT", title_style))
        story.append(Spacer(1, 5))
        
        # Date
        story.append(Paragraph(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", styles['Normal']))
        story.append(Spacer(1, 15))
        
        # Patient Information
        story.append(Paragraph("PATIENT INFORMATION", heading_style))
        patient_data_table = Table([
            ["Patient Name:", patient_data.get('name', 'Unknown')],
            ["Age / Gender:", f"{patient_data.get('age', '-')} / {patient_data.get('gender', '-')}"],
            ["GI Region:", patient_data.get('region', '-')],
            ["Report ID:", f"VGI-{datetime.now().strftime('%Y%m%d%H%M%S')}"]
        ], colWidths=[60*mm, 100*mm])
        patient_data_table.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('FONTSIZE', (0,0), (-1,-1), 10),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ]))
        story.append(patient_data_table)
        story.append(Spacer(1, 15))
        
        # AI Analysis Results
        story.append(Paragraph("AI ANALYSIS RESULTS", heading_style))
        
        results_table = Table([
            ["Finding:", scan_result.get('finding', '-')],
            ["Confidence:", f"{scan_result.get('confidence', 0):.1f}%"],
            ["Risk Level:", scan_result.get('risk_level', '-')],
            ["Action:", prediction_result.get('action', '-')],
            ["Urgency:", prediction_result.get('urgency', '-')]
        ], colWidths=[50*mm, 110*mm])
        results_table.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('FONTSIZE', (0,0), (-1,-1), 10),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ]))
        story.append(results_table)
        story.append(Spacer(1, 15))
        
        # Clinical Message
        story.append(Paragraph("CLINICAL MESSAGE", heading_style))
        story.append(Paragraph(prediction_result.get('message', '-'), normal_style))
        story.append(Spacer(1, 10))
        
        # Next Steps
        story.append(Paragraph("RECOMMENDED NEXT STEPS", heading_style))
        next_steps = prediction_result.get('next_steps', [])
        if next_steps:
            for i, step in enumerate(next_steps, 1):
                story.append(Paragraph(f"{i}. {step}", normal_style))
        else:
            story.append(Paragraph("No specific next steps identified.", normal_style))
        story.append(Spacer(1, 15))
        
        # Disclaimer
        story.append(Paragraph("DISCLAIMER", heading_style))
        disclaimer = "This report is AI-assisted and for clinical decision support only. "
        disclaimer += "Final diagnosis and treatment decisions must be made by a qualified medical professional. "
        disclaimer += "The AI confidence score indicates model reliability, not diagnostic certainty."
        story.append(Paragraph(disclaimer, normal_style))
        
        # Build PDF
        doc.build(story)
        buffer.seek(0)
        print("✅ PDF generated successfully")
        return buffer
        
    except Exception as e:
        print(f"❌ PDF generation error: {str(e)}")
        # Return empty buffer instead of failing
        buffer = io.BytesIO()
        return buffer