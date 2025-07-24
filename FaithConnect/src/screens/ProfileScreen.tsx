import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { supabase } from '../services/supabase';
import { Session } from '@supabase/supabase-js';

const ProfileScreen = ({ navigation }: any) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);

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

  useEffect(() => {
    if (session) {
      getProfile();
    }
  }, [session]);

  const getProfile = async () => {
    try {
      const { user } = session;
      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, bio, avatar_url`)
        .eq('id', user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error getting profile:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {profile ? (
        <>
          <Text style={styles.username}>{profile.username}</Text>
          <Text style={styles.bio}>{profile.bio}</Text>
          <Button
            title="Edit Profile"
            onPress={() => navigation.navigate('EditProfile')}
          />
        </>
      ) : (
        <Text>Loading...</Text>
      )}
      <Button title="Logout" onPress={() => supabase.auth.signOut()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  bio: {
    fontSize: 16,
    color: 'gray',
  },
});

export default ProfileScreen;
