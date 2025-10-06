
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const navigate = useNavigate();

  // Set up real-time subscription to listen for new claims
  useEffect(() => {
    const channel = supabase
      .channel('claims-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'claims'
        },
        () => {
          window.location.reload();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    // Redirect to dashboard since auth is handled externally
    navigate('/dashboard');
  }, [navigate]);

  return null;
};

export default Index;
