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
    
    # Extract phone - but avoid matching years (4 digits)
    phone_match = re.search(r'[\+\(]?[0-9][0-9 .\-\(\)]{8,}[0-9](?!\s*[-–—]\s*\d{4})', text)
    if phone_match:
        phone_candidate = phone_match.group().strip()
        # Verify it's not a year range
        if not re.match(r'^\d{4}$', phone_candidate.replace(' ', '').replace('-', '')):
            data["phone"] = phone_candidate
    
    # Extract LinkedIn
    linkedin_match = re.search(r'linkedin\.com/in/[a-zA-Z0-9\-]+', text, re.IGNORECASE)
    if linkedin_match:
        data["linkedin"] = linkedin_match.group()
    
    # Extract name (first line that's not email/phone and is capitalized)
    for line in lines[:10]:
        line = line.strip()
        if len(line) > 3 and len(line) < 50 and line[0].isupper() and '@' not in line and not re.match(r'^[0-9\+\(]', line):
            # Skip common header words
            if not any(word in line.lower() for word in ['resume', 'curriculum', 'vitae', 'cv', 'profile', 'skills', 'experience', 'education']):
                data["full_name"] = line
                break
    
    # Extract location (look for city, state/country patterns) - before sections
    location_pattern = r'([A-Z][a-zA-Z\s]+,\s*[A-Z]{2}(?:\s+\d{5})?)|([A-Z][a-zA-Z\s]+,\s*[A-Z][a-zA-Z\s]+)'
    # Only search in first 15 lines to avoid getting location from work experience
    header_text = '\n'.join(lines[:15])
    location_match = re.search(location_pattern, header_text)
    if location_match:
        location_candidate = location_match.group().strip()
        # Make sure it's not part of a section header
        if not re.search(r'(EXPERIENCE|EDUCATION|SKILLS|SUMMARY)', location_candidate, re.IGNORECASE):
            data["location"] = location_candidate
    
    # Extract Skills section - limit to just the skills section
    skills_section = re.search(
        r'(?:SKILLS?|TECHNICAL SKILLS?|COMPETENCIES|CORE COMPETENCIES|EXPERTISE)[:\s]*\n(.*?)(?=\n\s*(?:[A-Z]{3,}(?:\s+[A-Z]{3,})*|$))',
        text,
        re.IGNORECASE | re.MULTILINE
    )
    if skills_section:
        skills_text = skills_section.group(1)
        # Split by common delimiters and clean
        skills = re.split(r'[,;•\|●◆▪]|\n', skills_text)
        data["skills"] = [s.strip() for s in skills if s.strip() and len(s.strip()) > 2 and len(s.strip()) < 100][:20]
    
    # Extract Professional Summary - limited to summary section only
    summary_section = re.search(
        r'(?:PROFESSIONAL SUMMARY|SUMMARY|PROFILE|OBJECTIVE|CAREER SUMMARY)[:\s]*\n(.*?)(?=\n\s*(?:[A-Z]{3,}(?:\s+[A-Z]{3,})*|$))',
        text,
        re.IGNORECASE | re.MULTILINE
    )
    if summary_section:
        summary_text = summary_section.group(1).strip()
        # Limit to reasonable summary length
        data["summary"] = summary_text[:500]
    
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
        r'(?:WORK EXPERIENCE|PROFESSIONAL EXPERIENCE|EXPERIENCE|EMPLOYMENT HISTORY|CAREER HISTORY)[:\s]*\n(.*?)(?=\n\s*(?:EDUCATION|SKILLS|CERTIFICATIONS|PROJECTS|VOLUNTEER|AWARDS|REFERENCES|$))',
        text,
        re.IGNORECASE | re.DOTALL
    )
    
    if not work_section_match:
        return work_experience
    
    work_section = work_section_match.group(1)
    
    # Split by date patterns to identify individual jobs
    date_pattern = r'([A-Za-z]+\s+\d{4}\s*[-–—to\s]+\s*(?:[A-Za-z]+\s+\d{4}|Present|Current))'
    
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
            
            # Skip if this looks like a bullet point (starts with - or •)
            if header_text.strip().startswith(('-', '•', '●', '▪', '◆')):
                continue
            
            # Parse header (position, company, location)
            header_lines = [line.strip() for line in header_text.split('\n') if line.strip() and not line.strip().startswith(('-', '•', '●', '▪', '◆'))]
            
            position = ""
            company = ""
            location = ""
            
            if len(header_lines) > 0:
                # Check if first line has | or – delimiter (Position | Company)
                first_line = header_lines[0]
                if '|' in first_line:
                    parts = first_line.split('|')
                    position = parts[0].strip() if len(parts) > 0 else ""
                    company = parts[1].strip() if len(parts) > 1 else ""
                elif ' – ' in first_line or ' - ' in first_line:
                    # Try splitting on dash
                    parts = re.split(r'\s+[-–—]\s+', first_line)
                    position = parts[0].strip() if len(parts) > 0 else ""
                    company = parts[1].strip() if len(parts) > 1 else ""
                else:
                    position = first_line
                    
            if len(header_lines) > 1 and not company:
                company = header_lines[1]
            if len(header_lines) > 2:
                location = header_lines[2]
            
            # Parse dates - fix truncation issue
            date_str = date_match.group(1).strip()
            # Split on dash/to but not on spaces within words
            dates_parts = re.split(r'\s*[-–—]\s*(?:to\s+)?|\s+to\s+', date_str)
            dates_parts = [d.strip() for d in dates_parts if d.strip()]
            start_date = dates_parts[0] if len(dates_parts) > 0 else ""
            end_date = dates_parts[-1] if len(dates_parts) > 1 else "Present"
            
            # Clean description (take first 300 chars of non-bullet text)
            desc_lines = [line for line in description_text.split('\n') if line.strip() and not line.strip().startswith(('-', '•', '●', '▪', '◆'))]
            description = ' '.join(desc_lines)[:300] if desc_lines else ""
            
            # Extract bullet points from description
            achievements = re.findall(r'[•●▪◆\-]\s*(.+)', description_text)
            achievements = [a.strip() for a in achievements if a.strip() and len(a.strip()) > 10][:5]
            
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
        r'(?:EDUCATION|ACADEMIC BACKGROUND|ACADEMIC QUALIFICATIONS)[:\s]*\n(.*?)(?=\n\s*(?:EXPERIENCE|WORK|SKILLS|CERTIFICATIONS|PROJECTS|VOLUNTEER|AWARDS|REFERENCES|$))',
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
            date_match = re.search(r'(\d{4})\s*[-–—to\s]+\s*(\d{4}|Present|Current)?', rest_text)
            start_date = ""
            end_date = ""
            if date_match:
                start_date = date_match.group(1)
                end_date = date_match.group(2) if date_match.group(2) else ""
            
            # Extract field of study from degree - improved logic to avoid duplication
            field = ""
            # Look for "in [Field]" pattern - match the LAST occurrence to avoid "of Science in CS" duplication
            field_matches = list(re.finditer(r'(?:in)\s+([A-Za-z\s&,]+?)(?:\s*$|\s+(?:from|at|,))', degree, re.IGNORECASE))
            if field_matches:
                # Take the last match (e.g., "in Computer Science" not "of Science")
                field = field_matches[-1].group(1).strip()
            elif 'of' in degree.lower():
                # Try "of [Field]" but be more careful
                of_matches = list(re.finditer(r'(?:of)\s+([A-Za-z\s&,]+?)(?:\s*$|\s+(?:from|at|,|in))', degree, re.IGNORECASE))
                if of_matches:
                    # Get the match closest to the end that's not followed by "in"
                    for match in reversed(of_matches):
                        candidate = match.group(1).strip()
                        # Avoid "Science" if followed by "in"
                        if 'science' not in candidate.lower() or len(candidate.split()) > 1:
                            field = candidate
                            break
            
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
