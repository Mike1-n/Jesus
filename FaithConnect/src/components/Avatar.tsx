import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { StyleSheet, View, Alert, Image, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface Props {
  url: string | null;
  size: number;
  onUpload: (filePath: string) => void;
}

export default function Avatar({ url, size = 150, onUpload }: Props) {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const avatarSize = { height: size, width: size };

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path);
      if (error) {
        throw error;
      }
      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => {
        setAvatarUrl(fr.result as string);
      };
    } catch (error) {
      console.log('Error downloading image: ', error.message);
    }
  }

  async function uploadAvatar() {
    try {
      setUploading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (result.cancelled) {
        return;
      }

      const { uri } = result;
      const fileExt = uri.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const formData = new FormData();
      formData.append('file', {
        uri,
        name: fileName,
        type: `image/${fileExt}`,
      } as any);

      const { error } = await supabase.storage.from('avatars').upload(filePath, formData);

      if (error) {
        throw error;
      }

      onUpload(filePath);
    } catch (error) {
      Alert.alert('Error uploading avatar:', error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <View>
      {avatarUrl ? (
        <Image source={{ uri: avatarUrl }} style={avatarSize} />
      ) : (
        <View style={[styles.avatar, styles.noImage, avatarSize]} />
      )}
      <View>
        <Button
          title={uploading ? 'Uploading ...' : 'Upload'}
          onPress={uploadAvatar}
          disabled={uploading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 5,
    overflow: 'hidden',
    maxWidth: '100%',
  },
  noImage: {
    backgroundColor: '#333',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgb(200, 200, 200)',
    borderRadius: 5,
  },
});
