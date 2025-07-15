import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Alert, Card, ListGroup, ButtonGroup } from 'react-bootstrap';

const QuestionDetail = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}api/questions/${id}`);
        setQuestion(response.data);
        setAnswers(response.data.answers || []);
      } catch (err) {
        console.error('Error fetching question:', err);
      }
    };

    fetchQuestion();
  }, [id]);

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();

    if (!answer.trim()) {
      setError('Answer cannot be empty.');
      return;
    }

    if (answer.trim().length > 1000) {
      setError('Answer is too long (max 1000 characters).');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Please log in to post an answer.');
        return;
      }

      const response = await axios.post(
        '${process.env.REACT_APP_API_URL}api/answers/answer',
        {
          content: answer.trim(),
          questionId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAnswers((prevAnswers) => [...prevAnswers, response.data]);
      setAnswer('');
      setError('');
    } catch (err) {
      console.error('Error submitting answer:', err);
      setError('Error submitting answer. Please try again.');
    }
  };

  // Voting handler
  const handleVote = async (answerId, voteType) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to vote.');
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}api/answers/${answerId}/vote`,
        { voteType },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update answers state with new votes count
      setAnswers((prev) =>
        prev.map((ans) => (ans._id === answerId ? response.data : ans))
      );
    } catch (err) {
      console.error('Error voting:', err);
      setError('Error voting. Please try again.');
    }
  };

  if (!question) return <div>Loading...</div>;

  return (
    <div className="container my-5" style={{ maxWidth: '800px' }}>
      <h1 className="mb-4">{question.title}</h1>
      <p className="mb-5" dangerouslySetInnerHTML={{ __html: question.description }} />

      <h3 className="mb-3">Answers</h3>
      {answers.length === 0 ? (
        <p className="text-muted">No answers yet. Be the first to answer!</p>
      ) : (
        <ListGroup className="mb-4">
          {answers.map((ans) => (
            <ListGroup.Item key={ans._id} className="mb-2">
              <Card>
                <Card.Body>
                  <Card.Text>{ans.content}</Card.Text>
                  <Card.Subtitle className="text-muted mb-2">
                    Answered by: {ans?.user?.username || 'Anonymous'}
                  </Card.Subtitle>
                  <ButtonGroup aria-label="Vote buttons">
                    <Button
                      variant="outline-success"
                      onClick={() => handleVote(ans._id, 'upvote')}
                    >
                      👍 {ans.upvotes || 0}
                    </Button>
                    <Button
                      variant="outline-danger"
                      onClick={() => handleVote(ans._id, 'downvote')}
                    >
                      👎 {ans.downvotes || 0}
                    </Button>
                  </ButtonGroup>
                </Card.Body>
              </Card>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      <h4 className="mb-3">Your Answer</h4>
      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      )}
      <Form onSubmit={handleAnswerSubmit}>
        <Form.Group controlId="answerContent" className="mb-3">
          <Form.Control
            as="textarea"
            rows={5}
            placeholder="Write your answer here..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            maxLength={1000}
            required
          />
          <Form.Text muted>Max 1000 characters.</Form.Text>
        </Form.Group>
        <Button variant="success" type="submit" className="w-100">
          Submit Answer
        </Button>
      </Form>
    </div>
  );
};

export default QuestionDetail;
