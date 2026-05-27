//  --- DOCUMENTAÇÃO DA INTERFACE ---
//  Responsabilidade - Fornecer a interface e o formulário para criação de novas contas de usuários no sistema.
//  Funcionamento - Captura os dados cadastrais, realiza uma validação de consistência 
//  local preliminar nos campos obrigatórios e no formato básico do e-mail. Em seguida, efetua uma requisição 
//  do tipo POST para o endpoint /users da API Rest. Em caso de sucesso, notifica a usuária e limpa o fluxo 
//  redirecionando-a de volta para a tela de Login.

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../services/api'; 
import { styles } from './styles'; 

export function SignUp() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigation = useNavigation<any>(); 

  async function handleRegister() {
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      return Alert.alert("Campos obrigatórios", "Por favor, preencha todos os campos com *.");
    }

    if (!email.includes('@')) {
      return Alert.alert("E-mail inválido", "Digite um formato de e-mail válido.");
    }

    setLoading(true);

    try {
      await api.post('/users', { nome, email, senha });
      
      Alert.alert("Sucesso!", "Conta criada com sucesso. Faça seu login.");
      navigation.navigate('Login'); 
    } catch (error: any) {
      console.log(error); 
      const message = error.response?.data?.error || "Não foi possível cadastrar.";
      Alert.alert("Erro no cadastro", message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>
      
      <View style={{ marginBottom: 15 }}>
        <Text style={styles.label}>Nome completo *</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Digite seu nome" 
          placeholderTextColor="#94A3B8"
          onChangeText={setNome}
          value={nome}
        />
      </View>

      <View style={{ marginBottom: 15 }}>
        <Text style={styles.label}>E-mail *</Text>
        <TextInput 
          style={styles.input} 
          placeholder="email@exemplo.com" 
          placeholderTextColor="#94A3B8"
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
        />
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={styles.label}>Senha *</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Mínimo 6 caracteres" 
          placeholderTextColor="#94A3B8"
          secureTextEntry 
          onChangeText={setSenha}
          value={senha}
        />
      </View>

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleRegister} 
        disabled={loading}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>CADASTRAR</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={{ marginTop: 20, alignItems: 'center' }} 
        onPress={() => navigation.goBack()}
      >
        <Text style={{ color: '#64748B' }}>Já tenho uma conta. <Text style={{ color: '#3B82F6', fontWeight: 'bold' }}>Entrar</Text></Text>
      </TouchableOpacity>
    </View>
  );
}