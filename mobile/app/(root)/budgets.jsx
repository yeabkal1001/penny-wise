import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Alert, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PageLoader from "../../components/PageLoader";
import { useTransactions } from "../../hooks/useTransactions";
import { useBudgets } from "../../hooks/useBudgets";
import { styles } from "../../assets/styles/budgets.styles";
import { COLORS } from "../../constants/colors";
import ErrorBanner from "../../components/ErrorBanner";

export default function BudgetsScreen() {
  const { user } = useUser();
  const router = useRouter();
  const { transactions, isLoading: isTxLoading, loadData } = useTransactions(user?.id);
  const {
    budgets,
    isLoading: isBudgetsLoading,
    loadBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
    error: budgetsError,
  } = useBudgets(user?.id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newAmount, setNewAmount] = useState("");

  useEffect(() => {
    loadData();
    loadBudgets();
  }, [loadData, loadBudgets]);

  const spendingByCategory = useMemo(() => {
    const totals = {};
    (transactions || []).forEach((tx) => {
      const amount = Number(tx.amount);
      if (Number.isNaN(amount) || amount >= 0) return;
      const key = tx.category || "Other";
      totals[key] = (totals[key] || 0) + Math.abs(amount);
    });
    return totals;
  }, [transactions]);

  const isLoading = isTxLoading || isBudgetsLoading || isSubmitting;

  const handleCreateBudget = async () => {
    if (!user?.id || !newCategory.trim() || !newAmount) return;
    setIsSubmitting(true);
    try {
      await createBudget({
        user_id: user.id,
        category: newCategory.trim(),
        amount: Number(newAmount),
        period: "monthly",
      });
      setNewCategory("");
      setNewAmount("");
      await loadBudgets();
    } catch (error) {
      console.log("Error creating budget", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateBudget = async (budget) => {
    if (!user?.id) return;
    const initial = Number(budget.amount).toFixed(0);

    const performUpdate = async (value) => {
      const parsed = Number(value);
      if (Number.isNaN(parsed)) return;
      setIsSubmitting(true);
      try {
        await updateBudget(budget.id, { user_id: user.id, amount: parsed });
        await loadBudgets();
      } catch (error) {
        console.log("Error updating budget", error);
      } finally {
        setIsSubmitting(false);
      }
    };

    if (Platform.OS === "web" && typeof window !== "undefined") {
      const value = window.prompt("Update budget amount", initial);
      if (value !== null) performUpdate(value);
      return;
    }

    Alert.prompt(
      "Update budget",
      "Enter a new monthly limit",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Save", onPress: performUpdate },
      ],
      "plain-text",
      initial
    );
  };

  const handleDeleteBudget = (budgetId) => {
    if (!user?.id) return;

    const performDelete = async () => {
      setIsSubmitting(true);
      try {
        await deleteBudget(budgetId, user.id);
        await loadBudgets();
      } catch (error) {
        console.log("Error deleting budget", error);
      } finally {
        setIsSubmitting(false);
      }
    };

    if (Platform.OS === "web" && typeof window !== "undefined") {
      const confirmed = window.confirm("Delete this budget?");
      if (confirmed) performDelete();
      return;
    }

    Alert.alert("Delete budget", "Are you sure you want to delete this budget?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: performDelete },
    ]);
  };

  if (isLoading) return <PageLoader />;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Budgets</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.content}>
        <ErrorBanner message={budgetsError} />
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Create budget</Text>
          <Text style={styles.cardSub}>Set a monthly limit per category.</Text>
          <TextInput
            style={styles.input}
            value={newCategory}
            onChangeText={setNewCategory}
            placeholder="Category"
            placeholderTextColor={COLORS.textDarkMuted}
          />
          <TextInput
            style={styles.input}
            value={newAmount}
            onChangeText={setNewAmount}
            placeholder="Monthly limit"
            placeholderTextColor={COLORS.textDarkMuted}
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={[styles.primaryButton, (!newCategory.trim() || !newAmount) && styles.primaryButtonDisabled]}
            onPress={handleCreateBudget}
            disabled={!newCategory.trim() || !newAmount}
          >
            <Text style={styles.primaryButtonText}>Add budget</Text>
          </TouchableOpacity>
        </View>

        {budgets.length === 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>No budgets yet</Text>
            <Text style={styles.cardSub}>Create a budget above to start tracking.</Text>
          </View>
        )}
        {budgets.map((item) => {
          const spent = spendingByCategory[item.category] || 0;
          const limit = Number(item.amount) || 0;
          const progress = limit > 0 ? Math.min(spent / limit, 1) : 0;

          return (
            <View key={item.id} style={styles.card}>
              <Text style={styles.cardTitle}>{item.category}</Text>
              <Text style={styles.cardSub}>Monthly budget</Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
              </View>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Spent</Text>
                <Text style={styles.rowValue}>${spent.toFixed(2)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Limit</Text>
                <Text style={styles.rowValue}>${limit.toFixed(2)}</Text>
              </View>
              {item.id && (
                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={styles.linkButton}
                    onPress={() => handleUpdateBudget(item)}
                  >
                    <Text style={styles.linkButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.linkButton}
                    onPress={() => handleDeleteBudget(item.id)}
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
