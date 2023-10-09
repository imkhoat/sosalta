import html2pdf from 'html2pdf.js'

export function usePdf() {
  function handleExportPdf(elementId: string, fileName: string) {
    const element = document.getElementById(elementId)
    const opt = {
      margin: 0.5,
      filename: `${fileName}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    }

    // New Promise-based usage:
    html2pdf()
      .set(opt)
      .from(element)
      .toPdf()
      .get('pdf')
      .then(function (pdf: any) {
        const totalPages = pdf.internal.getNumberOfPages()
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i)
          pdf.setFontSize(10)
          pdf.setTextColor(100)
          pdf.text(
            'Page ' + i + ' of ' + totalPages,
            pdf.internal.pageSize.getWidth() / 2.3,
            pdf.internal.pageSize.getHeight() - 0.8
          )
        }
      })
      .save()
  }

  return {
    handleExportPdf,
  }
}
