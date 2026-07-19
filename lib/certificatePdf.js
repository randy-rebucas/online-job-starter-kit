import { PDF_INK, PDF_DIM, PDF_ACCENT, PDF_RULE } from "@/lib/pdfTheme";

export async function buildCertificatePdf({ name, title, subtitle }) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter", orientation: "landscape" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const centerX = pageWidth / 2;

  doc.setDrawColor(...PDF_ACCENT);
  doc.setLineWidth(3);
  doc.rect(28, 28, pageWidth - 56, pageHeight - 56);
  doc.setDrawColor(...PDF_RULE);
  doc.setLineWidth(1);
  doc.rect(38, 38, pageWidth - 76, pageHeight - 76);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...PDF_ACCENT);
  doc.text("ONLINE JOB STARTER KIT", centerX, 100, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(30);
  doc.setTextColor(...PDF_INK);
  doc.text("Certificate of Completion", centerX, 150, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(...PDF_DIM);
  doc.text("This certifies that", centerX, 195, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(...PDF_INK);
  doc.text(name || "Your Name", centerX, 235, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor(...PDF_DIM);
  doc.text(`has successfully completed the ${title}`, centerX, 265, { align: "center" });
  if (subtitle) doc.text(subtitle, centerX, 285, { align: "center" });

  doc.setFontSize(10);
  doc.text(
    new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }),
    centerX,
    pageHeight - 60,
    { align: "center" }
  );

  return doc;
}
