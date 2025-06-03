import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Link, useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { styles } from '../../assets/styles/auth.styles';
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from '../../constants/color';

const Login = () => {
  const {login} = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      return setError("Email and password are required.");
    }
    try {
      const response = await login({email, password});
      if (response) {
        console.log("Login successful", response);
        setEmail("");
        setPassword("");
        setError("");
        router.push("/(auth)/register")
      }
    } catch (error) {
      console.error("Login error: ", error);
      setError("Login failed. Please try again.");
    }
  }

  return (
    <KeyboardAwareScrollView
    style={{flex: 1}}
    contentContainerStyle={{flexGrow: 1}}
    enableOnAndroid={true}
    enableAutomaticScroll={true}
    extraScrollHeight={30}
    >
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/logo-antri2.jpg")}
          style={styles.illustration} 
          />
          <Text style={styles.title}>Login</Text>

          {error ? (
            <View>
              <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={() => setError("")}>
                <Ionicons name='close' size={20} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>
          ) : null}

          <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="none"
          value={email}
          placeholder="Enter email"
          placeholderTextColor="#9A8478"
          onChangeText={(email) => setEmail(email)}
        />
        <TextInput
          style={[styles.input, error && styles.errorInput]}
          value={password}
          placeholder="Enter password"
          placeholderTextColor="#9A8478"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Don&apos;t have an account?</Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>Register</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAwareScrollView>
  )
}

export default Login