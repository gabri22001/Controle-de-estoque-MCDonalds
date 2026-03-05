import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StatusBar,
  Animated,
  Platform,
} from 'react-native';
import { initDatabase } from './Database';

export default function Main({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    // Inicializar o banco de dados
    initDatabase();
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={styles.container.backgroundColor}
      />

      <Animated.Image
        source={{
          uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/273px-McDonald%27s_Golden_Arches.svg.png',
        }}
        style={[styles.logo, { opacity: fadeAnim }]}
        resizeMode="contain"
      />

      <Pressable
        style={({ pressed }) => [styles.button, pressed && { opacity: 0.7 }]}
        onPress={() => navigation.navigate('Estoque')}
      >
        <Text style={styles.buttonText}>Ir para Estoque</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.button, pressed && { opacity: 0.7 }]}
        onPress={() => navigation.navigate('CadastrarProduto')}
      >
        <Text style={styles.buttonText}>Cadastrar Produto</Text>
      </Pressable>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2025 McStock - Seu estoque na palma da mão
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DA291C',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 170,
    height: 170,
    marginBottom: 20,
    marginLeft: 15,
  },
  button: {
    backgroundColor: '#FFC72C',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#DA291C',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: Platform.select({
      ios: 'Helvetica',
      android: 'sans-serif',
    }),
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
  footerText: {
    color: '#FFC72C',
    fontSize: 14,
    fontFamily: Platform.select({
      ios: 'Helvetica',
      android: 'sans-serif',
    }),
  },
});
