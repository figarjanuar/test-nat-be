export interface Criterion {
  name: string;
  score: number;
  feedback: string;
}

export interface Review {
  id: number;
  employeeName: string;
  position: string;
  criteria: Criterion[];
  totalScore: number;
  generalFeedback: string;
}

const reviews: Review[] = [];

export default reviews;
