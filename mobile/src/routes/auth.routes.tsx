//  --- DOCUMENTAÇÃO DO FLUXO ---
//  Responsabilidade - Mapear e isolar as telas que estão acessíveis antes do usuário se autenticar no aplicativo.
//  Funcionamento - Cria uma pilha de navegação isolada dedicada ao fluxo inicial do app. 
//  Funciona como uma barreira de segurança, enquanto o estado global de autenticação for falso,
//  o React Native renderiza este navegador, limitando o acesso do usuário estritamente à interface de login.

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Login';

const { Navigator, Screen } = createStackNavigator();

export default function AuthRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="Login" component={Login} />
    </Navigator>
  );
}