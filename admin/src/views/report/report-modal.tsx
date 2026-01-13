import React, { useRef } from "react";
import CustomModal from "../../components/common/custom-modal";
import { useReportInventory } from "../../queries/report.query";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import CustomButton from "../../components/common/custom-button";

export default function ReportModal() {
  const { data } = useReportInventory();
  const containerRef = useRef<HTMLDivElement>(null);

  const exportPDF = async () => {
    if (!containerRef.current) return;
    const canvas = await html2canvas(containerRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "pt", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight);
    pdf.save("report.pdf");
  };

  const exportExcel = () => {
    if (!containerRef.current) return;
    const table = containerRef.current.querySelector("table");
    if (!table) return;
    const wb = XLSX.utils.table_to_book(table);
    XLSX.writeFile(wb, "report.xlsx");
  };

  return (
    <CustomModal onClose={() => {}} open width="w-7xl">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Báo cáo tồn kho</h2>
        <div className="flex gap-2">
          <CustomButton label=" Xuất PDF" onClick={exportPDF}/>
          <CustomButton label=" Xuất Excel" onClick={exportExcel}/>
        </div>
      </div>

      <div
        ref={containerRef}
        className="overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: data || "" }}
      />
    </CustomModal>
  );
}
