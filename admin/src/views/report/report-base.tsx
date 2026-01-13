import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import CustomButton from "../../components/common/custom-button";
import { getFileName } from "../../utils/get-file-name";

interface ReportBaseProps {
  data: string;
  reportTitle?: string;
  reportFileName?: string;
  exportExcel: () => void;
}

const ReportBase: React.FC<ReportBaseProps> = ({ data, reportTitle = "Báo cáo",reportFileName="report", exportExcel }) => {
  const previewRef = useRef<HTMLDivElement>(null);

  const exportPDF = async () => {
    if (!previewRef.current) return;

    const element = previewRef.current;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "mm", "a4");
    const pdfWidth = 297;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${getFileName(reportFileName)}.pdf`);
  };

  const exportHTML = () => {
    if (!data) return;

    const blob = new Blob([data], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${getFileName(reportFileName)}.html`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">{reportTitle}</h2>
        <div className="flex gap-2">
          <CustomButton variant="success" label="Xuất Excel" onClick={exportExcel} />
          <CustomButton variant="info" label="Xuất PDF" onClick={exportPDF} />
          <CustomButton variant="warming" label="Xuất HTML" onClick={exportHTML} />
        </div>
      </div>

      <div
        ref={previewRef}
        style={{ overflowX: "auto", padding: "16px", fontSize: "12px" }}
        dangerouslySetInnerHTML={{ __html: data || "" }}
      />
    </>
  );
};

export default ReportBase;
