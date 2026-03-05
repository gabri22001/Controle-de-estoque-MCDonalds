import React, { useEffect, useRef } from 'react';
import { View, Image, Text, StyleSheet, Animated } from 'react-native';

export default function TelaInicio({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 2000,
      useNativeDriver: true,
    }).start(() => {
      navigation.replace('Main');
    });
  }, [fadeAnim, navigation]); // ✅ dependências adicionadas

  return (
    <View style={styles.container}>
      <Animated.Image
        source={{
          uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/273px-McDonald%27s_Golden_Arches.svg.png',
        }}
        style={[styles.logo, { opacity: fadeAnim }]}
        resizeMode="contain"
      />
      <Animated.Text style={[styles.titulo, { opacity: fadeAnim }]}>
        Estoque
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  titulo: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#FFC72D',
  },
});
