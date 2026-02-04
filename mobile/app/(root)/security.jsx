import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Alert, ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { styles } from "../../assets/styles/profileSettings.styles";
import PageLoader from "../../components/PageLoader";
import { getStoredItem, setStoredItem } from "../../lib/storage";

const SECURITY_KEY = "pennywise_security";

export default function SecurityScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [biometrics, setBiometrics] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadSecurity = async () => {
      try {
        const stored = await getStoredItem(SECURITY_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setBiometrics(Boolean(parsed.biometrics));
        }
      } catch (error) {
        console.log("Error loading security", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSecurity();
  }, []);

  const handleToggleBiometrics = async (value) => {
    setBiometrics(value);
    setIsSaving(true);
    try {
      await setStoredItem(SECURITY_KEY, JSON.stringify({ biometrics: value }));
    } catch (error) {
      console.log("Error saving security", error);
      Alert.alert("Update failed", "Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    const url = "https://accounts.clerk.com/user";
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch (error) {
      Alert.alert("Open failed", "Please try again.");
    }
  };

  const handleSessionReview = async () => {
    const url = "https://accounts.clerk.com/user";
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch (error) {
      Alert.alert("Open failed", "Please try again.");
    }
  };

  if (isLoading || isSaving) return <PageLoader />;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Security</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Login protection</Text>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowLabel}>Biometric unlock</Text>
              <Text style={styles.rowHint}>Use Face ID / fingerprint for quick access.</Text>
            </View>
            <Switch value={biometrics} onValueChange={handleToggleBiometrics} />
          </View>
          <View style={styles.row}>
            <View>
              <Text style={styles.rowLabel}>App lock status</Text>
              <Text style={styles.rowHint}>Your data is protected while the app is closed.</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{biometrics ? "Enabled" : "Disabled"}</Text>
            </View>
          </View>
          <View style={[styles.row, styles.rowLast]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowLabel}>Two-factor authentication</Text>
              <Text style={styles.rowHint}>Coming soon for mobile accounts.</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Soon</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity style={styles.actionButton} onPress={handlePasswordReset}>
            <Text style={styles.actionButtonText}>Reset password</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.ghostButton]} onPress={handleSessionReview}>
            <Text style={[styles.actionButtonText, styles.ghostButtonText]}>Review sessions</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
