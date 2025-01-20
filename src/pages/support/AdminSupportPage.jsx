// src/pages/support/AdminSupportPage.jsx
import axios from '@/api/axios';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

// Stats Component
const TicketStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{stats.total || 0}</p>
        </CardContent>
      </Card>
      <Card className="bg-yellow-50">
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{stats.open || 0}</p>
        </CardContent>
      </Card>
      <Card className="bg-green-50">
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium">Answered Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{stats.answered || 0}</p>
        </CardContent>
      </Card>
      <Card className="bg-gray-50">
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium">Closed Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{stats.closed || 0}</p>
        </CardContent>
      </Card>
    </div>
  );
};

// Ticket Card Component
const TicketCard = ({ ticket, onAnswer, onClose }) => {
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return;
    setIsSubmitting(true);
    try {
      await onAnswer(ticket.id, answer);
      setAnswer('');
    } catch (error) {
      console.error('Failed to submit answer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{ticket.subject}</CardTitle>
            <p className="text-sm text-gray-500">
              From: {ticket.userNic} • {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
            </p>
          </div>
          <Badge className={
            ticket.status === 'OPEN' ? 'bg-yellow-100 text-yellow-800' :
            ticket.status === 'ANSWERED' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }>
            {ticket.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="font-medium text-sm text-gray-500">Question:</p>
          <p className="mt-1">{ticket.question}</p>
        </div>
        
        {ticket.answer && (
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="font-medium text-sm text-blue-500">Answer:</p>
            <p className="mt-1">{ticket.answer}</p>
          </div>
        )}

        {ticket.status === 'OPEN' && (
          <div className="space-y-2">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full p-2 border rounded-md min-h-[100px]"
              placeholder="Write your response here..."
            />
            <div className="flex space-x-2">
              <Button
                onClick={handleSubmitAnswer}
                disabled={isSubmitting || !answer.trim()}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Answer
              </Button>
              <Button
                variant="outline"
                onClick={() => onClose(ticket.id)}
                disabled={isSubmitting}
              >
                Close Ticket
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Main Component
export const AdminSupportPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('open');

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/v1/support/all');
      setTickets(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const answerTicket = async (ticketId, answer) => {
    try {
      const response = await axios.post(`/v1/support/${ticketId}/answer`, 
        { answer },
        { params: { adminNic: 'ADMIN' } }
      );
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId ? response.data : ticket
      ));
    } catch (err) {
      throw err.response?.data?.message || 'Failed to answer ticket';
    }
  };

  const closeTicket = async (ticketId) => {
    try {
      const response = await axios.put(`/v1/support/${ticketId}/close`);
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId ? response.data : ticket
      ));
    } catch (err) {
      console.error('Failed to close ticket:', err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'OPEN').length,
    answered: tickets.filter(t => t.status === 'ANSWERED').length,
    closed: tickets.filter(t => t.status === 'CLOSED').length
  };

  const filteredTickets = tickets.filter(ticket => {
    switch (activeTab) {
      case 'open':
        return ticket.status === 'OPEN';
      case 'answered':
        return ticket.status === 'ANSWERED';
      case 'closed':
        return ticket.status === 'CLOSED';
      default:
        return true;
    }
  });

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Support Ticket Management</h1>
      
      <TicketStats stats={stats} />

      <div className="flex space-x-2 mb-4">
        {[
          { id: 'open', label: `Open Tickets (${stats.open})` },
          { id: 'answered', label: `Answered (${stats.answered})` },
          { id: 'closed', label: `Closed (${stats.closed})` },
          { id: 'all', label: `All Tickets (${stats.total})` }
        ].map(tab => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "outline"}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No tickets found in this category
          </div>
        ) : (
          filteredTickets.map(ticket => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onAnswer={answerTicket}
              onClose={closeTicket}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AdminSupportPage;