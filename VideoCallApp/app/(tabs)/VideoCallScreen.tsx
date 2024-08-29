import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Alert, ScrollView, SafeAreaView, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Camera, CameraType } from 'expo-camera/legacy';
import { useNavigation } from 'expo-router';

const VideoCallScreen: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [transcript, setTranscript] = useState<string[]>(['This is a sample transcript line.']);
  const [isCallActive, setIsCallActive] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState(CameraType.front);
  const [userCount, setUserCount] = useState<number>(0);  // Initialize userCount
  const cameraRef = useRef<Camera>(null);

  const navigation = useNavigation();  // Hook for navigation

  // Placeholder images for participants
  const participants = [
    require('@/assets/images/participant1.png'),
    require('@/assets/images/participant2.png'),
    require('@/assets/images/participant3.png'),
  ];

  // Request camera permissions
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Handle joining the call
  const joinCall = () => {
    const randomUserCount = Math.floor(Math.random() * 3) + 1; // Random number between 1 and 3
    setUserCount(randomUserCount); // Set the user count
    setIsCallActive(true);
    setIsCameraEnabled(true);
    console.log('Joined the call with', randomUserCount, 'participants.');
    Alert.alert('Google Meet', `You have joined the call with ${randomUserCount} participants.`);
  };

  // Simulate ending the call and redirecting to Home
  const endCall = () => {
    setIsCallActive(false);
    setUserCount(0); // Reset user count to clear participant images
    console.log('Call ended.');
    Alert.alert('Google Meet', 'You have ended the call.');
    navigation.navigate('index');  // Navigate back to Home
  };

  // Switch between front and back cameras
  const switchCamera = () => {
    setCameraType(
      cameraType === CameraType.front
        ? CameraType.back
        : CameraType.front
    );
  };

  // Toggle camera on/off
  const toggleCamera = () => {
    setIsCameraEnabled(!isCameraEnabled);
  };

  useEffect(() => {
    // Simulate automatic transcript generation every 5 seconds
    const transcriptInterval = setInterval(() => {
      simulateTranscript();
    }, 5000);

    return () => {
      clearInterval(transcriptInterval); // Clean up the interval on unmount
    };
  }, []);

  // Simulate transcript update every few seconds
  const simulateTranscript = () => {
    const transcriptLines = [
      'User 1: Hello, how are you?',
      'User 2: I am fine, thank you!',
      'User 1: Let’s discuss the project updates.',
      'User 2: Sure, I have completed the assigned tasks.',
      'User 1: Great, let’s proceed with the next steps.',
    ];
    const randomLine = transcriptLines[Math.floor(Math.random() * transcriptLines.length)];
    if (transcript.length === 0 || transcript[transcript.length - 1] !== randomLine) {
      setTranscript(prev => [...prev, randomLine]);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Conditionally render the header based on call state */}
        {!isCallActive && (
          <View style={styles.header}>
            <Button title="Join Call" onPress={joinCall} />
          </View>
        )}
        <View style={styles.videoStreamContainer}>
          {/* Display the other participants' video streams based on userCount */}
          <View style={styles.participantsContainer}>
            {participants.slice(0, userCount).map((participant, index) => (
              <Image key={index} source={participant} style={styles.participantVideo} />
            ))}
          </View>

          {/* Display the user's own video stream in the bottom right */}
          {isCallActive && (
            <View style={styles.userVideoContainer}>
              {isCameraEnabled ? (
                <Camera
                  style={styles.userVideo}
                  type={cameraType}
                  ref={cameraRef}
                />
              ) : (
                <Text style={styles.placeholderText}>Camera is disabled</Text>
              )}
            </View>
          )}
        </View>
        <View style={styles.controls}>
          <TouchableOpacity onPress={() => setIsMuted(!isMuted)} style={styles.controlButton}>
            <FontAwesome name={isMuted ? 'microphone-slash' : 'microphone'} size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={switchCamera} style={styles.controlButton}>
            <FontAwesome name="refresh" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleCamera} style={styles.controlButton}>
            <FontAwesome name={isCameraEnabled ? 'eye-slash' : 'eye'} size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={endCall} style={[styles.controlButton, styles.endCallButton]}>
            <FontAwesome name="phone" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.transcript} contentContainerStyle={styles.transcriptContent}>
          {transcript.map((line, index) => (
            <Text key={index} style={styles.transcriptText}>{line}</Text>
          ))}
        </ScrollView>
        <View style={styles.simulateButtonContainer}>
          <Button title="Simulate Transcript" onPress={simulateTranscript} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'flex-end',
    padding: 10,
    backgroundColor: '#222',
  },
  videoStreamContainer: {
    flex: 3,
    backgroundColor: '#444',
  },
  participantsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  participantVideo: {
    width: '45%',
    height: '45%',
    margin: '2.5%',
    borderRadius: 10,
  },
  userVideoContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 120,
    height: 160,
    borderRadius: 10,
    overflow: 'hidden',
    borderColor: '#fff',
    borderWidth: 2,
  },
  userVideo: {
    width: '100%',
    height: '100%',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    paddingTop: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#222',
  },
  controlButton: {
    padding: 10,
    backgroundColor: '#555',
    borderRadius: 50,
  },
  endCallButton: {
    backgroundColor: 'red',
  },
  transcript: {
    flex: 1,
    backgroundColor: '#333',
    paddingHorizontal: 10,
  },
  transcriptContent: {
    paddingBottom: 20,
  },
  transcriptText: {
    color: '#fff',
    marginBottom: 5,
  },
  simulateButtonContainer: {
    padding: 10,
    backgroundColor: '#222',
  },
});

export default VideoCallScreen;
