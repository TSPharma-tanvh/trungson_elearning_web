// src/presentation/components/NotificationForm.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NotificationEntity } from '@/domain/models/Notification';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { Box, Button, TextField } from '@mui/material';

interface Props {
  // optionally pass a callback or route after send
}

const NotificationForm: React.FC<Props> = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { sendNotificationUseCase } = useDI();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const notification = new NotificationEntity({
        title,
        body,
        recipientPhone: phone || undefined,
      });
      // call use case
      await sendNotificationUseCase.executeToUser(notification);
      // show success UI, e.g., navigate or reset form
      // For example:
      alert('Notification sent!');
      // optional: router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to send');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <TextField label="Body" value={body} onChange={(e) => setBody(e.target.value)} required multiline />
      {error && <Box sx={{ color: 'red' }}>{error}</Box>}
      <Button type="submit" variant="contained" disabled={loading}>
        {loading ? 'Sending...' : 'Send Notification'}
      </Button>
    </Box>
  );
};

export default NotificationForm;
