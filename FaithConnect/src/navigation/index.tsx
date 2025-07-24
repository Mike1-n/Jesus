import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { supabase } from '../services/supabase';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import { Session } from '@supabase/supabase-js';

const MainNavigator = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      {session && session.user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default MainNavigator;
