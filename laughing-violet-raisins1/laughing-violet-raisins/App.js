import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TelaInicio from './TelaInicio';
import Main from './Main';
import Estoque from './Estoque';
import CadastrarProduto from './CadastrarProduto';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="TelaInicio"
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="TelaInicio" component={TelaInicio} />
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="Estoque" component={Estoque} />
        <Stack.Screen name="CadastrarProduto" component={CadastrarProduto} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
