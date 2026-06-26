import fitz
import io
from typing import Dict, List
import re
from datetime import datetime

def parse_pdf_resume(pdf_bytes: bytes) -> Dict:
    """
    Parse resume from PDF bytes using PyMuPDF
    Returns structured data: name, email, phone, skills, experience, education
    """
    text = ""
    
    try:
        pdf_document = fitz.open(stream=pdf_bytes, filetype="pdf")
        for page in pdf_document:
            text += page.get_text()
        pdf_document.close()
    except Exception as e:
        return {"error": f"Failed to parse PDF: {str(e)}"}
    
    return extract_resume_data(text)

def parse_docx_resume(docx_bytes: bytes) -> Dict:
    """
    Parse resume from DOCX bytes
    """
    try:
        from docx import Document
        doc = Document(io.BytesIO(docx_bytes))
        text = "\n".join([para.text for para in doc.paragraphs])
        return extract_resume_data(text)
    except Exception as e:
        return {"error": f"Failed to parse DOCX: {str(e)}"}

def extract_resume_data(text: str) -> Dict:
    """
    Extract structured data from resume text with enhanced work experience and education parsing
    """
    data = {
        "full_name": "",
        "email": "",
        "phone": "",
        "location": "",
        "linkedin": "",
        "website": "",
        "summary": "",
        "skills": [],
        "work_experience": [],
        "education": [],
        "raw_text": text
    }
    
    lines = text.split('\n')
    
    # Extract email
    email_match = re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', text)
    if email_match:
        data["email"] = email_match.group()
    
    # Extract phone
    phone_match = re.search(r'[\+\(]?[0-9][0-9 .\-\(\)]{8,}[0-9]', text)
    if phone_match:
        data["phone"] = phone_match.group().strip()
    
    # Extract LinkedIn
    linkedin_match = re.search(r'linkedin\.com/in/[a-zA-Z0-9\-]+', text, re.IGNORECASE)
    if linkedin_match:
        data["linkedin"] = linkedin_match.group()
    
    # Extract name (first line that's not email/phone and is capitalized)
    for line in lines[:10]:
        line = line.strip()
        if len(line) > 3 and len(line) < 50 and line[0].isupper() and '@' not in line and not re.match(r'^[0-9\+\(]', line):
            # Skip common header words
            if not any(word in line.lower() for word in ['resume', 'curriculum', 'vitae', 'cv', 'profile']):
                data["full_name"] = line
                break
    
    # Extract location (look for city, state/country patterns)
    location_match = re.search(r'([A-Z][a-zA-Z\s]+,\s*[A-Z]{2}(?:\s+\d{5})?)|([A-Z][a-zA-Z\s]+,\s*[A-Z][a-zA-Z\s]+)', text)
    if location_match:
        data["location"] = location_match.group().strip()
    
    # Extract Skills section
    skills_section = re.search(
        r'(?:SKILLS?|TECHNICAL SKILLS?|COMPETENCIES|CORE COMPETENCIES|EXPERTISE)[:\s]*\n([^\n]+(?:\n(?![A-Z\s]{3,}:)[^\n]+)*)',
        text,
        re.IGNORECASE | re.MULTILINE
    )
    if skills_section:
        skills_text = skills_section.group(1)
        # Split by common delimiters and clean
        skills = re.split(r'[,;•\|●◆▪]|\n', skills_text)
        data["skills"] = [s.strip() for s in skills if s.strip() and len(s.strip()) > 2 and len(s.strip()) < 100][:20]
    
    # Extract Professional Summary
    summary_section = re.search(
        r'(?:PROFESSIONAL SUMMARY|SUMMARY|PROFILE|OBJECTIVE|CAREER SUMMARY)[:\s]*\n([^\n]+(?:\n(?![A-Z\s]{3,}:)[^\n]+)*)',
        text,
        re.IGNORECASE | re.MULTILINE
    )
    if summary_section:
        data["summary"] = summary_section.group(1).strip()[:500]
    
    # Extract Work Experience
    work_exp = extract_work_experience(text)
    data["work_experience"] = work_exp
    
    # Extract Education
    education = extract_education(text)
    data["education"] = education
    
    return data

def extract_work_experience(text: str) -> List[Dict]:
    """
    Extract work experience entries from resume text
    """
    work_experience = []
    
    # Find work experience section
    work_section_match = re.search(
        r'(?:WORK EXPERIENCE|PROFESSIONAL EXPERIENCE|EXPERIENCE|EMPLOYMENT HISTORY|CAREER HISTORY)[:\s]*\n(.*?)(?=\n(?:EDUCATION|SKILLS|CERTIFICATIONS|PROJECTS|$))',
        text,
        re.IGNORECASE | re.DOTALL
    )
    
    if not work_section_match:
        return work_experience
    
    work_section = work_section_match.group(1)
    
    # Split by date patterns to identify individual jobs
    date_pattern = r'([A-Za-z]+\s+\d{4}\s*[-–—to]*\s*(?:[A-Za-z]+\s+\d{4}|Present|Current))'
    
    # Find all date ranges
    dates = list(re.finditer(date_pattern, work_section))
    
    for i, date_match in enumerate(dates):
        try:
            # Get text before this date (job title, company, location)
            start_pos = dates[i-1].end() if i > 0 else 0
            end_pos = date_match.start()
            header_text = work_section[start_pos:end_pos].strip()
            
            # Get text after this date until next date (description)
            desc_start = date_match.end()
            desc_end = dates[i+1].start() if i < len(dates)-1 else len(work_section)
            description_text = work_section[desc_start:desc_end].strip()
            
            # Parse header (position, company, location)
            header_lines = [line.strip() for line in header_text.split('\n') if line.strip()]
            
            position = header_lines[0] if len(header_lines) > 0 else ""
            company = header_lines[1] if len(header_lines) > 1 else ""
            location = header_lines[2] if len(header_lines) > 2 else ""
            
            # Parse dates
            date_str = date_match.group(1)
            dates_parts = re.split(r'[-–—to]+', date_str.strip())
            start_date = dates_parts[0].strip() if len(dates_parts) > 0 else ""
            end_date = dates_parts[1].strip() if len(dates_parts) > 1 else "Present"
            
            # Clean description (take first 300 chars)
            description = description_text[:300] if description_text else ""
            
            # Extract bullet points from description
            achievements = re.findall(r'[•●▪◆\-]\s*(.+)', description_text)
            achievements = [a.strip() for a in achievements if a.strip()][:5]
            
            work_experience.append({
                "id": str(len(work_experience) + 1),
                "position": position[:100],
                "company": company[:100],
                "location": location[:100],
                "start_date": start_date,
                "end_date": end_date,
                "current": "present" in end_date.lower() or "current" in end_date.lower(),
                "description": description,
                "achievements": achievements
            })
        except Exception:
            continue
    
    return work_experience[:5]  # Return max 5 jobs

def extract_education(text: str) -> List[Dict]:
    """
    Extract education entries from resume text
    """
    education = []
    
    # Find education section
    edu_section_match = re.search(
        r'(?:EDUCATION|ACADEMIC BACKGROUND|ACADEMIC QUALIFICATIONS)[:\s]*\n(.*?)(?=\n(?:EXPERIENCE|WORK|SKILLS|CERTIFICATIONS|PROJECTS|$))',
        text,
        re.IGNORECASE | re.DOTALL
    )
    
    if not edu_section_match:
        return education
    
    edu_section = edu_section_match.group(1)
    
    # Pattern to match degree, institution, dates
    # Look for degree patterns
    degree_pattern = r'((?:Bachelor|Master|PhD|Ph\.D\.|Associate|B\.S\.|M\.S\.|B\.A\.|M\.A\.|B\.Tech|M\.Tech)[^\n]*)'
    
    degrees = list(re.finditer(degree_pattern, edu_section, re.IGNORECASE))
    
    for i, degree_match in enumerate(degrees):
        try:
            # Get degree line
            degree = degree_match.group(1).strip()
            
            # Get next few lines for institution and dates
            start_pos = degree_match.end()
            end_pos = degrees[i+1].start() if i < len(degrees)-1 else len(edu_section)
            rest_text = edu_section[start_pos:end_pos].strip()
            
            lines = [line.strip() for line in rest_text.split('\n') if line.strip()]
            
            # First line is usually institution
            institution = lines[0] if len(lines) > 0 else ""
            
            # Look for dates (4-digit years)
            date_match = re.search(r'(\d{4})\s*[-–—to]*\s*(\d{4}|Present|Current)?', rest_text)
            start_date = ""
            end_date = ""
            if date_match:
                start_date = date_match.group(1)
                end_date = date_match.group(2) if date_match.group(2) else ""
            
            # Extract field of study from degree
            field_match = re.search(r'(?:in|of)\s+([A-Za-z\s&,]+)', degree)
            field = field_match.group(1).strip() if field_match else ""
            
            # Look for GPA
            gpa_match = re.search(r'GPA[:\s]+([0-9.]+)', rest_text, re.IGNORECASE)
            gpa = gpa_match.group(1) if gpa_match else ""
            
            education.append({
                "id": str(len(education) + 1),
                "degree": degree[:100],
                "institution": institution[:150],
                "field": field[:100],
                "location": "",
                "start_date": start_date,
                "end_date": end_date,
                "gpa": gpa
            })
        except Exception:
            continue
    
    return education[:5]  # Return max 5 education entries
