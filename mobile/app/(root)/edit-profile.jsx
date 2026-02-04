import { useMemo, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PageLoader from "../../components/PageLoader";
import { COLORS } from "../../constants/colors";
import { styles } from "../../assets/styles/profileSettings.styles";

export default function EditProfileScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [username, setUsername] = useState(user?.username || "");
  const [isSaving, setIsSaving] = useState(false);

  const email = useMemo(() => user?.emailAddresses?.[0]?.emailAddress || "", [user]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await user.update({ firstName, lastName, username });
      Alert.alert("Profile updated", "Your profile details are saved.");
    } catch (error) {
      console.log("Error updating profile", error);
      Alert.alert("Update failed", "Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isSaving) return <PageLoader />;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Personal details</Text>
          <Text style={styles.label}>First name</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First name"
            placeholderTextColor={COLORS.textDarkMuted}
          />
          <Text style={styles.label}>Last name</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last name"
            placeholderTextColor={COLORS.textDarkMuted}
          />
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
            placeholderTextColor={COLORS.textDarkMuted}
            autoCapitalize="none"
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, styles.readonly]}
            value={email}
            editable={false}
          />
        </View>

        <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
          <Text style={styles.actionButtonText}>Save changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
