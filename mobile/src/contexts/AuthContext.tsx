//  --- DOCUMENTAÇÃO DO CONTEXTO ---
//  Responsabilidade - Gerenciar o estado global de login, sessão e persistência de dados do usuário no aplicativo.
//  Funcionamento - Disponibiliza funções e estados de autenticação para todo o ecossistema 
//  do React Native através da Context API. Utiliza o AsyncStorage para gravar e resgatar o Token JWT e os dados do 
//  usuário localmente no celular, além de injetar o token automaticamente nos cabeçalhos HTTP do Axios.

import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

interface User {
  id: number;
  nome: string;
  email: string;
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: boolean;
  signIn(email: string, password: string): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const storageUser = await AsyncStorage.getItem('@Chamados:user');
      const storageToken = await AsyncStorage.getItem('@Chamados:token');

      if (storageUser && storageToken) {
        api.defaults.headers.Authorization = `Bearer ${storageToken}`;
        setUser(JSON.parse(storageUser));
      }
      setLoading(false);
    }
    loadStorageData();
  }, []);

async function signIn(email: string, password: string) {
    try {
      const response = await api.post('/sessions', { email, password });

      const { user: userResponse, token } = response.data;

      setUser(userResponse);
      
      api.defaults.headers.Authorization = `Bearer ${token}`;

      await AsyncStorage.setItem('@Chamados:user', JSON.stringify(userResponse));
      await AsyncStorage.setItem('@Chamados:token', token);

    } catch (error: any) {
      console.log("Erro no login real:", error.response?.data || error.message);
      
      setUser(null);

      throw new Error(error.response?.data?.error || 'E-mail ou senha incorretos');
    }
  }

  function signOut() {
    AsyncStorage.clear().then(() => {
      setUser(null);
    });
  }

  return (
    <AuthContext.Provider value={{ 
      signed: !!user, 
      user, 
      loading, 
      signIn, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
}