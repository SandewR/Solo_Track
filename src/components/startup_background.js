import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function StartupBackground({ children }) {
  const [visible, setVisible] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => setVisible(false), loaded ? 3000 : 2500);
    return () => clearTimeout(timer);
  }, [loaded, visible]);

  return (
    <View style={styles.container}>
      {children}
      {visible && (
        <View style={[StyleSheet.absoluteFill, styles.cover]}>
          <Image
            source={require('../../assets/images/solotrack-launch.png')}
            style={[StyleSheet.absoluteFill, styles.image]}
            resizeMode="cover"
            onLoad={() => setLoaded(true)}
            onError={() => setVisible(false)}
          />
          <Text style={styles.title}>SoloTrack</Text>
          <Text style={styles.subtitle}>Your jobs in one place</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  cover: {
    zIndex: 10,
    backgroundColor: '#102725',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { width: '100%', height: '100%' },
  title: { color: '#FFFFFF', fontSize: 44, fontWeight: '800' },
  subtitle: { color: '#D1F1E9', fontSize: 16, marginTop: 8 },
});