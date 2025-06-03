import { View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { styles } from "../../assets/styles/auth.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/color";
import { useRouter } from "expo-router";


const Register = () => {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password) {
        return setError("Email and password are required.");
    }
    try {
      const response = await register({ email, password });
      if (response) {
        console.log("Registration successful", response);
        setEmail("");
        setPassword("");
        setError("");
        router.push("/")
      }
    } catch (error) {
      console.error("Registration error: ", error);
      setError("Registration failed. Please try again.");
    }
  };
  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      // extraScrollHeight={100}
    >
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/logo-antri2.jpg")}
          style={styles.illustration}
        />
        <Text style={styles.title}>Register</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="none"
          value={email}
          placeholder="Enter your email"
          placeholderTextColor="#9A8478"
          onChangeText={(email) => setEmail(email)}
        />
        <TextInput
          style={[styles.input, error && styles.errorInput]}
          value={password}
          placeholder="Enter your password"
          placeholderTextColor="#9A8478"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
            <Text style={styles.linkText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Register;
