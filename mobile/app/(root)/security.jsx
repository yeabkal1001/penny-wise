import { useRouter } from "expo-router";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { styles } from "../../assets/styles/profileSettings.styles";

export default function SecurityScreen() {
  const router = useRouter();

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
          <View style={[styles.row, styles.rowLast]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowLabel}>Two-factor authentication</Text>
              <Text style={styles.rowHint}>Manage 2FA settings in your Clerk account.</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Clerk</Text>
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
