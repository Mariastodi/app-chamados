//  --- DOCUMENTAÇÃO DO FLUXO ---
//  Responsabilidade - Mapear as telas do aplicativo e gerenciar o fluxo de transição entre elas.
//  Funcionamento - Utiliza a estratégia de "Stack Navigation" do @react-navigation/stack.
//  Organiza a árvore de componentes do React Native de modo que a navegação aconteça empilhando
//  as interfaces sequencialmente: Login -> Home -> Criação/Detalhes, ocultando os cabeçalhos padrão do sistema operacional.

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Home from '../screens/Home';
import CreateTicket from '../screens/CreateTicket'; 
import TicketDetails from '../screens/TicketDetails';
import Login from '../screens/Login'; 

const { Navigator, Screen } = createStackNavigator();

export default function AppRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="Login" component={Login} />
      <Screen name="Home" component={Home} />
      <Screen name="CreateTicket" component={CreateTicket} />
      <Screen name="TicketDetails" component={TicketDetails} />
    </Navigator>
  );
}