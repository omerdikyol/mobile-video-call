import React, { useState } from 'react';
import { Image, StyleSheet, Platform, TextInput, Button, View, useColorScheme } from 'react-native';
import { useNavigation } from 'expo-router';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const [url, setUrl] = useState('');
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const handleJoinCall = () => {
    if (url) {
      // Store the URL or do something with it here (e.g., validation)
      console.log('Joining call with URL:', url);
      // Navigate to the Video Call tab
      navigation.navigate('VideoCallScreen');
    } else {
      alert('Please enter a URL');
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>

      {/* New Join Call Section */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Join a Video Call</ThemedText>
        <TextInput
          style={[
            styles.input,
            { color: colorScheme === 'dark' ? '#ffffff' : '#000000' }
          ]}
          placeholder="Enter Google Meet URL"
          placeholderTextColor={colorScheme === 'dark' ? '#aaaaaa' : '#666666'}
          value={url}
          onChangeText={setUrl}
        />
        <View style={styles.buttonContainer}>
          <Button title="Join Call" onPress={handleJoinCall} />
        </View>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    alignItems: 'flex-start',
  },
});
