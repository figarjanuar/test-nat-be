import request from 'supertest';
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import reviewRoutes from '../routes/reviewRoutes';

const app: Application = express();
app.use(bodyParser.json());
app.use('/reviews', reviewRoutes);

describe('Performance Review API', () => {
  let createdReviewId: number;

  it('should create a new review', async () => {
    const response = await request(app)
      .post('/reviews')
      .send({
        employeeName: 'John Doe',
        position: 'Software Engineer',
        criteria: [
          { name: 'Technical Skills', score: 5, feedback: 'Excellent.' },
          { name: 'Communication', score: 4, feedback: 'Good.' },
        ],
        generalFeedback: 'Great performance.',
      });
    expect(response.status).toBe(201);
    expect(response.body.totalScore).toEqual(9);
    createdReviewId = response.body.id;
  });

  it('should get all reviews', async () => {
    const response = await request(app).get('/reviews');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should get a review by ID', async () => {
    const response = await request(app).get(`/reviews/${createdReviewId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('employeeName', 'John Doe');
  });

  it('should update a review', async () => {
    const response = await request(app)
      .put(`/reviews/${createdReviewId}`)
      .send({
        employeeName: 'John Doe',
        position: 'Senior Software Engineer',
        criteria: [
          { name: 'Technical Skills', score: 5, feedback: 'Outstanding.' },
          { name: 'Communication', score: 5, feedback: 'Excellent.' },
        ],
        generalFeedback: 'Exceptional performance.',
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('position', 'Senior Software Engineer');
  });

  it('should delete a review', async () => {
    const response = await request(app).delete(`/reviews/${createdReviewId}`);
    expect(response.status).toBe(204);
  });

  it('should generate a PDF for a review', async () => {
    // Create a review first
    const createResponse = await request(app)
      .post('/reviews')
      .send({
        employeeName: 'Jane Doe',
        position: 'QA Engineer',
        criteria: [
          { name: 'Attention to Detail', score: 5, feedback: 'Perfect.' },
          { name: 'Teamwork', score: 4, feedback: 'Very good.' },
        ],
        generalFeedback: 'Excellent contribution.',
      });

    const reviewId = createResponse.body.id;

    // Generate PDF
    const pdfResponse = await request(app).get(`/reviews/${reviewId}/pdf`);
    expect(pdfResponse.status).toBe(200);
    expect(pdfResponse.headers['content-type']).toBe('application/pdf');
  });
});
