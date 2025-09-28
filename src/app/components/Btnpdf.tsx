'use client';
import { useCallback } from 'react';
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';

type Props = {
  targetRef: React.MutableRefObject<HTMLElement | null>;
  filename?: string;
  orientation?: 'portrait' | 'landscape';
  scale?: number; // calidad (pixelRatio)
  className?: string;
};

export default function Btnpdf({
  targetRef,
  filename = 'dashboard.pdf',
  orientation = 'landscape',
  scale = 2,
  className,
}: Props) {
  const handleExport = useCallback(async () => {
    const el = targetRef.current;
    if (!el) return;

    const dataUrl = await toPng(el, {
      cacheBust: true,
      pixelRatio: scale,
      backgroundColor: '#ffffff',
    });

    const img = new Image();
    img.src = dataUrl;
    await img.decode();

    const pdf = new jsPDF(orientation === 'landscape' ? 'l' : 'p', 'mm', 'a4');
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();

    const imgW = pageW;
    const imgH = (img.height * imgW) / img.width;

    let heightLeft = imgH;
    let position = 0;

    pdf.addImage(dataUrl, 'PNG', 0, position, imgW, imgH);
    heightLeft -= pageH;

    while (heightLeft > 0) {
      position = heightLeft - imgH;
      pdf.addPage();
      pdf.addImage(dataUrl, 'PNG', 0, position, imgW, imgH);
      heightLeft -= pageH;
    }

    pdf.save(filename);
  }, [targetRef, filename, orientation, scale]);

  return (
    <button onClick={handleExport} className={className}>
      Exportar PDF
    </button>
  );
}
