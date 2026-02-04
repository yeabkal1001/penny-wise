import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import {
  Alert,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SignOutButton } from "@/components/SignOutButton";
import { useTransactions } from "../../hooks/useTransactions";
  return (
    <View style={styles.container}>
      <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        renderItem={({ item }) => <TransactionItem item={item} onDelete={handleDelete} />}
        ListEmptyComponent={<NoTransactionsFound />}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            {/* HEADER */}
            <View style={styles.header}>
              {/* LEFT */}
              <View style={styles.headerLeft}>
                <Image
                  source={require("../../assets/images/logo.png")}
                  style={styles.headerLogo}
                  resizeMode="contain"
                />
                <View style={styles.welcomeContainer}>
                  <Text style={styles.welcomeText}>Welcome,</Text>
                  <Text style={styles.usernameText}>
                    {user?.emailAddresses[0]?.emailAddress.split("@")[0]}
                  </Text>
                </View>
              </View>
              {/* RIGHT */}
              <View style={styles.headerRight}>
                <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}>
                  <Ionicons name="add" size={20} color="#FFF" />
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => router.push("/notifications")}
                >
                  <Ionicons name="notifications" size={18} color={COLORS.textDark} />
                  {!isNotificationsLoading && unreadCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{unreadCount}</Text>
                    </View>
                  )}
                </TouchableOpacity>
                <SignOutButton />
              </View>
            </View>

            <ErrorBanner
              message={transactionsError || budgetsError || goalsError || notificationsError}
            />

            <BalanceCard summary={summary} />

            <View style={styles.insightsCard}>
              <View style={styles.insightsHeader}>
                <Text style={styles.insightsTitle}>Quick insights</Text>
                <TouchableOpacity
                  style={styles.insightsButton}
                  onPress={() => router.push("/analysis")}
                >
                  <Ionicons name="stats-chart" size={14} color={COLORS.textDark} />
                  <Text style={styles.insightsButtonText}>View</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.insightsRow}>
                <View style={styles.insightItem}>
                  <Text style={styles.insightLabel}>Budgets</Text>
                  <Text style={styles.insightValue}>
                    {isBudgetsLoading ? "..." : `${budgetInsights.total}`}
                  </Text>
                  <Text style={styles.insightHint}>
                    {isBudgetsLoading
                      ? "Loading"
                      : budgetInsights.total
                      ? `${budgetInsights.overLimit} over limit`
                      : "No budgets yet"}
                  </Text>
                </View>
                <View style={styles.insightDivider} />
                <View style={styles.insightItem}>
                  <Text style={styles.insightLabel}>Goals</Text>
                  <Text style={styles.insightValue}>
                    {isGoalsLoading ? "..." : `${goalInsights.total}`}
                  </Text>
                  <Text style={styles.insightHint}>
                    {isGoalsLoading
                      ? "Loading"
                      : goalInsights.total
                      ? `${Math.round(goalInsights.avgProgress * 100)}% avg progress`
                      : "No goals yet"}
                  </Text>
                </View>
              </View>
              <View style={styles.insightsActions}>
                <TouchableOpacity
                  style={styles.insightsChip}
                  onPress={() => router.push("/budgets")}
                >
                  <Ionicons name="wallet" size={14} color={COLORS.textDark} />
                  <Text style={styles.insightsChipText}>Budgets</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.insightsChip}
                  onPress={() => router.push("/goals")}
                >
                  <Ionicons name="trophy" size={14} color={COLORS.textDark} />
                  <Text style={styles.insightsChipText}>Goals</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.transactionsHeaderContainer}>
              <Text style={styles.sectionTitle}>Recent Transactions</Text>
              <View
                style={{ flexDirection: "row", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}
              >
                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={() => router.push("/analysis")}
                >
                  <Ionicons name="stats-chart" size={14} color={COLORS.textDark} />
                  <Text style={styles.linkButtonText}>Analysis</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={() => router.push("/categories")}
                >
                  <Ionicons name="grid-outline" size={14} color={COLORS.textDark} />
                  <Text style={styles.linkButtonText}>Categories</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={() => router.push("/transactions")}
                >
                  <Ionicons name="list" size={14} color={COLORS.textDark} />
                  <Text style={styles.linkButtonText}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={() => router.push("/profile")}
                >
                  <Ionicons name="person-circle" size={14} color={COLORS.textDark} />
                  <Text style={styles.linkButtonText}>Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={() => router.push("/notifications")}
                >
                  <Ionicons name="notifications" size={14} color={COLORS.textDark} />
                  <Text style={styles.linkButtonText}>Alerts</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        }
      />
    </View>
  );
              )}
            </TouchableOpacity>
            <SignOutButton />
          </View>
        </View>

        <ErrorBanner
          message={transactionsError || budgetsError || goalsError || notificationsError}
        />

        <BalanceCard summary={summary} />

        <View style={styles.insightsCard}>
          <View style={styles.insightsHeader}>
            <Text style={styles.insightsTitle}>Quick insights</Text>
            <TouchableOpacity style={styles.insightsButton} onPress={() => router.push("/analysis")}>
              <Ionicons name="stats-chart" size={14} color={COLORS.textDark} />
              <Text style={styles.insightsButtonText}>View</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.insightsRow}>
            <View style={styles.insightItem}>
              <Text style={styles.insightLabel}>Budgets</Text>
              <Text style={styles.insightValue}>
                {isBudgetsLoading ? "..." : `${budgetInsights.total}`}
              </Text>
              <Text style={styles.insightHint}>
                {isBudgetsLoading
                  ? "Loading"
                  : budgetInsights.total
                  ? `${budgetInsights.overLimit} over limit`
                  : "No budgets yet"}
              </Text>
            </View>
            <View style={styles.insightDivider} />
            <View style={styles.insightItem}>
              <Text style={styles.insightLabel}>Goals</Text>
              <Text style={styles.insightValue}>
                {isGoalsLoading ? "..." : `${goalInsights.total}`}
              </Text>
              <Text style={styles.insightHint}>
                {isGoalsLoading
                  ? "Loading"
                  : goalInsights.total
                  ? `${Math.round(goalInsights.avgProgress * 100)}% avg progress`
                  : "No goals yet"}
              </Text>
            </View>
          </View>
          <View style={styles.insightsActions}>
            <TouchableOpacity style={styles.insightsChip} onPress={() => router.push("/budgets")}>
              <Ionicons name="wallet" size={14} color={COLORS.textDark} />
              <Text style={styles.insightsChipText}>Budgets</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.insightsChip} onPress={() => router.push("/goals")}>
              <Ionicons name="trophy" size={14} color={COLORS.textDark} />
              <Text style={styles.insightsChipText}>Goals</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <TouchableOpacity style={styles.linkButton} onPress={() => router.push("/analysis")}>
              <Ionicons name="stats-chart" size={14} color={COLORS.textDark} />
              <Text style={styles.linkButtonText}>Analysis</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkButton} onPress={() => router.push("/categories")}>
              <Ionicons name="grid-outline" size={14} color={COLORS.textDark} />
              <Text style={styles.linkButtonText}>Categories</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkButton} onPress={() => router.push("/transactions")}>
              <Ionicons name="list" size={14} color={COLORS.textDark} />
              <Text style={styles.linkButtonText}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkButton} onPress={() => router.push("/profile")}>
              <Ionicons name="person-circle" size={14} color={COLORS.textDark} />
              <Text style={styles.linkButtonText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkButton} onPress={() => router.push("/notifications")}>
              <Ionicons name="notifications" size={14} color={COLORS.textDark} />
              <Text style={styles.linkButtonText}>Alerts</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* FlatList is a performant way to render long lists in React Native. */}
      {/* it renders items lazily — only those on the screen. */}
      <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        renderItem={({ item }) => <TransactionItem item={item} onDelete={handleDelete} />}
        ListEmptyComponent={<NoTransactionsFound />}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
}
