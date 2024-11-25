import { Response } from 'express';
import PDFDocument from 'pdfkit';
import { Review } from '../models/reviewModel';

export const generatePDF = (data: Review, res: Response): void => {
  const doc = new PDFDocument();
  doc.pipe(res);

  doc.fontSize(16).text(`Performance Review Report`, { align: 'center' });
  doc.moveDown();
  doc.text(`Name: ${data.employeeName}`);
  doc.text(`Position: ${data.position}`);
  doc.text(`Total Score: ${data.totalScore}`);
  doc.text(`General Feedback: ${data.generalFeedback}`);

  data.criteria.forEach((criterion) => {
    doc.moveDown();
    doc.text(`${criterion.name}: ${criterion.score}`);
    doc.text(`Feedback: ${criterion.feedback}`);
  });

  doc.end();
};
