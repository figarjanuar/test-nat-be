import { Request, Response } from 'express';
import reviews, { Review } from '../models/reviewModel';
import { generatePDF } from '../utils/pdfGenerator';

export const createReview = (req: Request, res: Response): void => {
  const { employeeName, position, criteria, generalFeedback } = req.body;

  const totalScore = criteria.reduce((sum: number, item: any) => sum + item.score, 0);
  const newReview: Review = {
    id: reviews.length + 1,
    employeeName,
    position,
    criteria,
    totalScore,
    generalFeedback,
  };

  reviews.push(newReview);
  res.status(201).json(newReview);
};

export const getAllReviews = (req: Request, res: Response): void => {
  res.json(reviews);
};

export const getReviewById = (req: Request, res: Response): void => {
  const id = parseInt(req.params.id);
  const review = reviews.find((r) => r.id === id);

  if (!review) {
    res.status(404).json({ message: 'Review not found' });
    return;
  }

  res.json(review);
};

export const updateReview = (req: Request, res: Response): void => {
  const id = parseInt(req.params.id);
  const index = reviews.findIndex((r) => r.id === id);

  if (index === -1) {
    res.status(404).json({ message: 'Review not found' });
    return;
  }

  const { employeeName, position, criteria, generalFeedback } = req.body;
  const totalScore = criteria.reduce((sum: number, item: any) => sum + item.score, 0);
  reviews[index] = { id, employeeName, position, criteria, totalScore, generalFeedback };

  res.json(reviews[index]);
};

export const deleteReview = (req: Request, res: Response): void => {
  const id = parseInt(req.params.id);
  const index = reviews.findIndex((r) => r.id === id);

  if (index === -1) {
    res.status(404).json({ message: 'Review not found' });
    return;
  }

  reviews.splice(index, 1);
  res.status(204).send();
};

export const getPDF = (req: Request, res: Response): void => {
  const id = parseInt(req.params.id);
  const review = reviews.find((r) => r.id === id);

  if (!review) {
    res.status(404).json({ message: 'Review not found' });
    return;
  }

  res.setHeader('Content-Type', 'application/pdf');
  generatePDF(review, res);
};
