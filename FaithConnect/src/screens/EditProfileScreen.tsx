import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { supabase } from '../services/supabase';
import { Session } from '@supabase/supabase-js';
import Avatar from '../components/Avatar';

const EditProfileScreen = ({ navigation }: any) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

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
      setLoading(true);
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
        setUsername(data.username);
        setBio(data.bio);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.error('Error getting profile:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      const { user } = session;

      const updates = {
        id: user.id,
        username,
        bio,
        avatar_url: avatarUrl,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error updating profile:', error.message);
    } finally {
      setLoading(false);
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Avatar
        size={200}
        url={avatarUrl}
        onUpload={(url: string) => {
          setAvatarUrl(url);
          updateProfile();
        }}
      />
      <Text>Edit Profile</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Bio"
        value={bio}
        onChangeText={setBio}
        style={styles.input}
      />
      <Button
        title={loading ? 'Loading ...' : 'Update'}
        onPress={updateProfile}
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 10,
  },
});

export default EditProfileScreen;
