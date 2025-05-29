from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY

def generate_project_pdf():
    doc = SimpleDocTemplate(
        "Grower_Project_Documentation.pdf",
        pagesize=letter,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=72
    )
    
    # Styles
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(
        name='Heading1Center',
        parent=styles['Heading1'],
        alignment=TA_CENTER,
        spaceAfter=12
    ))
    styles.add(ParagraphStyle(
        name='BodyJustify',
        parent=styles['BodyText'],
        alignment=TA_JUSTIFY,
        spaceAfter=6
    ))
    
    # Content
    content = []
    
    # Title
    content.append(Paragraph("Grower: A Web Platform for Startup Investment and Growth", styles['Heading1Center']))
    content.append(Spacer(1, 0.25*inch))
    
    # 1. Introduction
    content.append(Paragraph("1. Introduction", styles['Heading1']))
    content.append(Paragraph(
        """Grower is a comprehensive web platform designed to connect early-stage startups with potential 
        investors. The platform facilitates idea sharing, investment proposals, and community building for 
        entrepreneurs and investors. Grower provides a streamlined process for startups to present their 
        business ideas through detailed articles and receive investment offers from verified investors. 
        This document outlines the objectives, design, implementation, and evaluation of the Grower platform.""",
        styles['BodyJustify']
    ))
    content.append(Spacer(1, 0.25*inch))
    
    # 2. Motivation
    content.append(Paragraph("2. Motivation", styles['Heading1']))
    content.append(Paragraph(
        """The primary motivation behind developing Grower stems from the challenges faced by early-stage 
        startups in securing investment and guidance. Traditional funding routes often require extensive 
        networking, formal pitch presentations, and business planning that can be intimidating for new 
        entrepreneurs. Furthermore, potential investors struggle to discover promising startups in their 
        early stages. Grower aims to bridge this gap by providing a simplified approach for entrepreneurs 
        to present ideas without formal pitching, a secure environment for investors to discover opportunities,
        and a community-focused platform that values both financial investment and mentorship.""",
        styles['BodyJustify']
    ))
    
    # Build PDF
    doc.build(content)
    print("PDF generated successfully: Grower_Project_Documentation.pdf")

if __name__ == "__main__":
    generate_project_pdf() 