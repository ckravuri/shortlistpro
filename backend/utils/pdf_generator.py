from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER
import io
from typing import Dict

def generate_resume_pdf(resume_data: Dict) -> bytes:
    """
    Generate ATS-safe PDF resume from structured data
    Single-column, clean format
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, topMargin=0.5*inch, bottomMargin=0.5*inch)
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=18,
        textColor=colors.HexColor('#001F3F'),
        spaceAfter=6,
        alignment=TA_CENTER
    )
    
    contact_style = ParagraphStyle(
        'Contact',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor('#708090'),
        alignment=TA_CENTER,
        spaceAfter=12
    )
    
    heading_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontSize=12,
        textColor=colors.HexColor('#001F3F'),
        spaceBefore=12,
        spaceAfter=6,
        borderWidth=1,
        borderColor=colors.HexColor('#E2E8F0'),
        borderPadding=4
    )
    
    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor('#001F3F'),
        spaceAfter=6
    )
    
    story = []
    
    personal = resume_data.get('personal_info', {})
    
    # Name
    if personal.get('full_name'):
        story.append(Paragraph(personal['full_name'], title_style))
    
    # Contact info
    contact_parts = []
    if personal.get('email'):
        contact_parts.append(personal['email'])
    if personal.get('phone'):
        contact_parts.append(personal['phone'])
    if personal.get('location'):
        contact_parts.append(personal['location'])
    
    if contact_parts:
        story.append(Paragraph(' | '.join(contact_parts), contact_style))
    
    # LinkedIn and Website
    links = []
    if personal.get('linkedin'):
        links.append(personal['linkedin'])
    if personal.get('website'):
        links.append(personal['website'])
    if links:
        story.append(Paragraph(' | '.join(links), contact_style))
    
    story.append(Spacer(1, 0.2*inch))
    
    # Professional Summary
    if personal.get('summary'):
        story.append(Paragraph('PROFESSIONAL SUMMARY', heading_style))
        story.append(Paragraph(personal['summary'], body_style))
        story.append(Spacer(1, 0.1*inch))
    
    # Work Experience
    work_exp = resume_data.get('work_experience', [])
    if work_exp:
        story.append(Paragraph('WORK EXPERIENCE', heading_style))
        for exp in work_exp:
            if exp.get('position') and exp.get('company'):
                title_line = f"<b>{exp['position']}</b> - {exp['company']}"
                if exp.get('location'):
                    title_line += f" ({exp['location']})"
                story.append(Paragraph(title_line, body_style))
                
                if exp.get('start_date') or exp.get('end_date'):
                    date_line = f"{exp.get('start_date', '')} - {exp.get('end_date', 'Present')}"
                    story.append(Paragraph(date_line, contact_style))
                
                if exp.get('description'):
                    story.append(Paragraph(exp['description'], body_style))
                
                if exp.get('achievements'):
                    for achievement in exp['achievements']:
                        story.append(Paragraph(f"• {achievement}", body_style))
                
                story.append(Spacer(1, 0.1*inch))
    
    # Education
    education = resume_data.get('education', [])
    if education:
        story.append(Paragraph('EDUCATION', heading_style))
        for edu in education:
            if edu.get('degree') and edu.get('institution'):
                edu_line = f"<b>{edu['degree']}</b>"
                if edu.get('field'):
                    edu_line += f" in {edu['field']}"
                story.append(Paragraph(edu_line, body_style))
                story.append(Paragraph(edu['institution'], body_style))
                
                if edu.get('start_date') or edu.get('end_date'):
                    date_line = f"{edu.get('start_date', '')} - {edu.get('end_date', '')}"
                    story.append(Paragraph(date_line, contact_style))
                
                if edu.get('gpa'):
                    story.append(Paragraph(f"GPA: {edu['gpa']}", body_style))
                
                story.append(Spacer(1, 0.1*inch))
    
    # Skills
    skills = resume_data.get('skills', [])
    if skills:
        story.append(Paragraph('SKILLS', heading_style))
        story.append(Paragraph(', '.join(skills), body_style))
    
    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()
