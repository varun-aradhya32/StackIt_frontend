import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, false] }],
      [
        { align: '' },
        { align: 'center' },
        { align: 'right' },
        { align: 'justify' }
      ],
      ['bold', 'italic', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['clean']
    ]
  }
};

const formats = [
  'header', 'align', 'bold', 'italic', 'strike',
  'list', 'bullet'
];

const PostQuestion = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // ✅ Add tooltips for Quill buttons
  useEffect(() => {
    const tooltipMap = {
      bold: 'Bold',
      italic: 'Italic',
      strike: 'Strikethrough',
      'list:ordered': 'Numbered List',
      'list:bullet': 'Bulleted List',
      'align:': 'Align Left',
      'align:center': 'Align Center',
      'align:right': 'Align Right',
      'align:justify': 'Justify',
      clean: 'Remove Formatting'
    };

    const buttons = document.querySelectorAll('.ql-toolbar button');
    buttons.forEach((btn) => {
      const classList = Array.from(btn.classList);
      const qlClass = classList.find(cls => cls.startsWith('ql-'));
      const value = btn.value || '';
      const key = qlClass?.replace('ql-', '') + (value ? `:${value}` : '');

      if (tooltipMap[key]) {
        btn.setAttribute('title', tooltipMap[key]);
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !tags.trim()) {
      setError('All fields are required.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to post a question.');
        return;
      }

      const response = await axios.post(
        '${process.env.REACT_APP_API_URL}/api/questions',
        {
          title: title.trim(),
          description: description.trim(), // HTML from Quill
          tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate(`/question/${response.data._id}`);
    } catch (err) {
      console.error(err);
      setError('Error posting question. Please try again later.');
    }
  };

  return (
    <div className="mx-auto my-5" style={{ maxWidth: '700px' }}>
      <h2 className="mb-4 text-center">Ask a New Question</h2>

      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="questionTitle" className="mb-3">
          <Form.Label><strong>Title</strong></Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter the question title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={150}
            required
          />
          <Form.Text muted>
            Keep your title concise and descriptive (max 150 characters).
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="questionDescription" className="mb-3">
          <Form.Label><strong>Description</strong></Form.Label>
          <ReactQuill
            value={description}
            onChange={setDescription}
            modules={modules}
            formats={formats}
            placeholder="Provide more details about your question"
          />
          <Form.Text muted>
            Use formatting options above to make your question clearer.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="questionTags" className="mb-4">
          <Form.Label><strong>Tags</strong></Form.Label>
          <Form.Control
            type="text"
            placeholder="Add tags separated by commas (e.g., react, javascript)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            required
          />
          <Form.Text muted>
            Tags help categorize your question. Use relevant keywords.
          </Form.Text>
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Post Question
        </Button>
      </Form>
    </div>
  );
};

export default PostQuestion;
