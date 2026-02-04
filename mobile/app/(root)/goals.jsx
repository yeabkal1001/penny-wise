import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Alert, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../assets/styles/goals.styles";
import { COLORS } from "../../constants/colors";
import PageLoader from "../../components/PageLoader";
import { useGoals } from "../../hooks/useGoals";
import ErrorBanner from "../../components/ErrorBanner";

export default function GoalsScreen() {
  const router = useRouter();
  const { user } = useUser();
  const {
    goals,
    isLoading,
    loadGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    error,
  } = useGoals(user?.id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newName, setNewName] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const [newSaved, setNewSaved] = useState("");

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  const isBusy = isLoading || isSubmitting;

  const handleCreateGoal = async () => {
    if (!user?.id || !newName.trim() || !newTarget) return;
    setIsSubmitting(true);
    try {
      await createGoal({
        user_id: user.id,
        name: newName.trim(),
        target_amount: Number(newTarget),
        current_amount: Number(newSaved || 0),
        icon: "trophy",
      });
      setNewName("");
      setNewTarget("");
      setNewSaved("");
      await loadGoals();
    } catch (error) {
      console.log("Error creating goal", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateGoal = async (goal) => {
    if (!user?.id) return;
    const initial = Number(goal.target_amount ?? goal.target).toFixed(0);

    const performUpdate = async (value) => {
      const parsed = Number(value);
      if (Number.isNaN(parsed)) return;
      setIsSubmitting(true);
      try {
        await updateGoal(goal.id, { user_id: user.id, target_amount: parsed });
        await loadGoals();
      } catch (error) {
        console.log("Error updating goal", error);
      } finally {
        setIsSubmitting(false);
      }
    };

    if (Platform.OS === "web" && typeof window !== "undefined") {
      const value = window.prompt("Update target amount", initial);
      if (value !== null) performUpdate(value);
      return;
    }

    Alert.prompt(
      "Update target",
      "Enter a new goal target",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Save", onPress: performUpdate },
      ],
      "plain-text",
      initial
    );
  };

  const handleUpdateSaved = async (goal) => {
    if (!user?.id) return;
    const initial = Number(goal.current_amount ?? goal.saved ?? 0).toFixed(0);

    const performUpdate = async (value) => {
      const parsed = Number(value);
      if (Number.isNaN(parsed)) return;
      setIsSubmitting(true);
      try {
        await updateGoal(goal.id, { user_id: user.id, current_amount: parsed });
        await loadGoals();
      } catch (error) {
        console.log("Error updating saved amount", error);
      } finally {
        setIsSubmitting(false);
      }
    };

    if (Platform.OS === "web" && typeof window !== "undefined") {
      const value = window.prompt("Update saved amount", initial);
      if (value !== null) performUpdate(value);
      return;
    }

    Alert.prompt(
      "Update saved",
      "Enter the current saved amount",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Save", onPress: performUpdate },
      ],
      "plain-text",
      initial
    );
  };

  const handleDeleteGoal = (goalId) => {
    if (!user?.id) return;

    const performDelete = async () => {
      setIsSubmitting(true);
      try {
        await deleteGoal(goalId, user.id);
        await loadGoals();
      } catch (error) {
        console.log("Error deleting goal", error);
      } finally {
        setIsSubmitting(false);
      }
    };

    if (Platform.OS === "web" && typeof window !== "undefined") {
      const confirmed = window.confirm("Delete this goal?");
      if (confirmed) performDelete();
      return;
    }

    Alert.alert("Delete goal", "Are you sure you want to delete this goal?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: performDelete },
    ]);
  };

  if (isBusy) return <PageLoader />;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Savings Goals</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.content}>
        <ErrorBanner message={error} />
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Create goal</Text>
          <Text style={styles.cardSub}>Track progress toward a savings target.</Text>
          <TextInput
            style={styles.input}
            value={newName}
            onChangeText={setNewName}
            placeholder="Goal name"
            placeholderTextColor={COLORS.textDarkMuted}
          />
          <TextInput
            style={styles.input}
            value={newTarget}
            onChangeText={setNewTarget}
            placeholder="Target amount"
            placeholderTextColor={COLORS.textDarkMuted}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            value={newSaved}
            onChangeText={setNewSaved}
            placeholder="Current saved (optional)"
            placeholderTextColor={COLORS.textDarkMuted}
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={[styles.primaryButton, (!newName.trim() || !newTarget) && styles.primaryButtonDisabled]}
            onPress={handleCreateGoal}
            disabled={!newName.trim() || !newTarget}
          >
            <Text style={styles.primaryButtonText}>Add goal</Text>
          </TouchableOpacity>
        </View>

        {goals.length === 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>No goals yet</Text>
            <Text style={styles.cardSub}>Create a savings goal above to start tracking.</Text>
          </View>
        )}

        {goals.map((goal) => {
          const target = Number(goal.target_amount ?? goal.target);
          const saved = Number(goal.current_amount ?? goal.saved);
          const progress = Math.min(saved / target, 1);
          return (
            <View key={goal.id} style={styles.card}>
              <Text style={styles.cardTitle}>{goal.name}</Text>
              <Text style={styles.cardSub}>Target ${target.toFixed(2)}</Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
              </View>
              <View style={styles.amountRow}>
                <Text style={styles.amountLabel}>Saved</Text>
                <Text style={styles.amountValue}>${saved.toFixed(2)}</Text>
              </View>
              {goals.length > 0 && goal.id && (
                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={styles.linkButton}
                    onPress={() => handleUpdateGoal(goal)}
                  >
                    <Text style={styles.linkButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.linkButton}
                    onPress={() => router.push(`/update-saved?goalId=${goal.id}`)}
                  >
                    <Text style={styles.linkButtonText}>Update saved</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.linkButton}
                    onPress={() => handleDeleteGoal(goal.id)}
                  >
                    <Text style={[styles.linkButtonText, styles.dangerText]}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
