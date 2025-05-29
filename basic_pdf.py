from fpdf import FPDF

pdf = FPDF()
pdf.add_page()
pdf.set_font("Arial", size=12)
pdf.cell(200, 10, txt="Grower: A Web Platform for Startup Investment and Growth", ln=1, align="C")
pdf.cell(200, 10, txt="Project Documentation", ln=1, align="C")
pdf.output("basic_grower_doc.pdf")
print("Basic PDF created successfully!") 