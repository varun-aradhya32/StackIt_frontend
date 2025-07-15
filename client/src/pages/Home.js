// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, InputGroup, Spinner } from 'react-bootstrap';
import { AiOutlineSearch } from 'react-icons/ai';

function Home() {
  const [questions, setQuestions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/questions')
      .then(res => {
        setQuestions(res.data);
        setFiltered(res.data);
      })
      .catch(err => {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions. Try again later.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    const q = e.target.value.toLowerCase();
    setQuery(q);
    if (!q) return setFiltered(questions);

    const result = questions.filter(qn =>
      qn.title.toLowerCase().includes(q) ||
      qn.tags?.some(tag => tag.toLowerCase().includes(q))
    );
    setFiltered(result);
  };

  return (
    <Container>
      <h1 className="my-4">All Questions</h1>

      <InputGroup className="mb-4">
        <InputGroup.Text><AiOutlineSearch /></InputGroup.Text>
        <Form.Control
          placeholder="Search by title or tag"
          value={query}
          onChange={handleSearch}
        />
      </InputGroup>

      {loading && <Spinner animation="border" />}

      {error && <p className="text-danger">{error}</p>}

      {!loading && filtered.length === 0 && <p>No matching questions.</p>}

      <Row xs={1} md={2} lg={3} className="g-4">
        {filtered.map(qn => (
          <Col key={qn._id}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>
                  <Link to={`/question/${qn._id}`}>{qn.title}</Link>
                </Card.Title>
                <Card.Text>
                  {qn.description.length > 120
                    ? qn.description.substring(0, 120) + '…'
                    : qn.description}
                </Card.Text>
                {qn.tags && qn.tags.length > 0 && (
                  <div>
                    {qn.tags.map(tag => (
                      <span key={tag} className="badge bg-secondary me-1">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Card.Body>
              <Card.Footer className="text-muted">
                By {qn.user?.username || qn.user?.name || 'Unknown'}
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Home;
