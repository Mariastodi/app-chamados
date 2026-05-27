//  --- DOCUMENTAÇÃO DO ARQUIVO ---
//  Responsabilidade - Orquestrar e interceptar o fluxo de navegação raiz do aplicativo baseado no estado de autenticação.
//  Funcionamento - Consome o contexto global de segurança. Enquanto o aplicativo estiver lendo os dados 
//  salvos no dispositivo, renderiza uma tela de transição com um indicador de carregamento nativo. 
//  Após a checagem, aplica uma renderização condicional para liberar o acesso às rotas internas 
//  ou restringir o usuário às rotas de autenticação.

import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

import AppRoutes from './app.routes';   
import AuthRoutes from './auth.routes'; 

export default function Routes() {
  const { signed, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F172A' }}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return signed ? <AppRoutes /> : <AuthRoutes />;
}