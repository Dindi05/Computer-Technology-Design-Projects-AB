import React, { useState, useEffect } from 'react';
import { Container, Card, Button, ButtonGroup } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import moment from 'moment';
import axios from 'axios';

const Events = () => {
  const [view, setView] = useState('upcoming');
  const [allEvents, setAllEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/events`);
        setAllEvents(res.data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchEvents();
  }, []);

  const today = moment();

  const upcomingEvents = allEvents
    .filter(event => moment(event.date).isSameOrAfter(today, 'day'))
    .sort((a, b) => moment(a.date).diff(moment(b.date)));

  const pastEvents = allEvents
    .filter(event => moment(event.date).isBefore(today, 'day'))
    .sort((a, b) => moment(b.date).diff(moment(a.date)));

  const renderEvents = (events) =>
    events.map((event) => (
      <Card key={event._id} className="mb-3 shadow-sm hover-shadow">
        <Card.Body style={{ color: '#2b333d' }}>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
            <div className="mb-2 mb-md-0">
              <Card.Title className="fw-bold">{event.title}</Card.Title>
              <Card.Subtitle className="text-muted mb-2">
                {moment(event.date).format('MMMM D, YYYY')}
              </Card.Subtitle>
              <Card.Text>{event.description}</Card.Text>
            </div>
            <div>
              <Button variant="primary" size="sm" className="fw-semibold text-uppercase">
                Read More
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    ));

  return (
    <div style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <div className="section-pale-sage py-5">
        <Container>
          <h2 className="mb-4 text-center fw-bold display-5" style={{ color: '#2b333d' }}>
            Events
          </h2>

          <ButtonGroup className="d-flex justify-content-center mb-4">
            <Button
              variant={view === 'upcoming' ? 'primary' : 'outline-primary'}
              onClick={() => setView('upcoming')}
            >
              Upcoming Events
            </Button>
            <Button
              variant={view === 'past' ? 'primary' : 'outline-primary'}
              onClick={() => setView('past')}
            >
              Past Events
            </Button>
          </ButtonGroup>

          <div style={{ minHeight: '400px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ x: view === 'past' ? 300 : -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: view === 'past' ? -300 : 300, opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {view === 'upcoming'
                  ? renderEvents(upcomingEvents)
                  : renderEvents(pastEvents)}
              </motion.div>
            </AnimatePresence>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Events;
