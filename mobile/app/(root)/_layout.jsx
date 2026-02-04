import { useUser } from "@clerk/clerk-expo";
import { Redirect, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

export default function Layout() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null; // this is for a better ux

  if (!isSignedIn) return <Redirect href={"/sign-in"} />;

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          left: 8,
          right: 8,
          bottom: 16,
          height: 64,
          borderRadius: 24,
          backgroundColor: COLORS.background,
          borderTopColor: "transparent",
          elevation: 8,
          shadowColor: COLORS.shadow,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.2,
          shadowRadius: 12,
          paddingBottom: 6,
          paddingTop: 6,
          paddingHorizontal: 0,
        },
        tabBarContentContainerStyle: {
          paddingHorizontal: 12,
        },
        tabBarItemStyle: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
        tabBarIcon: ({ focused, size }) => {
          const iconSize = size ?? 22;
          const color = focused ? COLORS.primary : COLORS.textMuted;

          switch (route.name) {
            case "index":
              return <Ionicons name={focused ? "home" : "home-outline"} size={iconSize} color={color} />;
            case "analysis":
              return (
                <Ionicons
                  name={focused ? "stats-chart" : "stats-chart-outline"}
                  size={iconSize}
                  color={color}
                />
              );
            case "create":
              return (
                <Ionicons
                  name="add-circle"
                  size={iconSize + 10}
                  color={COLORS.primary}
                />
              );
            case "categories":
              return (
                <Ionicons
                  name={focused ? "grid" : "grid-outline"}
                  size={iconSize}
                  color={color}
                />
              );
            case "budgets":
              return (
                <Ionicons
                  name={focused ? "wallet" : "wallet-outline"}
                  size={iconSize}
                  color={color}
                />
              );
            case "goals":
              return (
                <Ionicons
                  name={focused ? "trophy" : "trophy-outline"}
                  size={iconSize}
                  color={color}
                />
              );
            case "profile":
              return (
                <Ionicons
                  name={focused ? "person" : "person-outline"}
                  size={iconSize}
                  color={color}
                />
              );
            default:
              return null;
          }
        },
      })}
    >
      <Tabs.Screen name="index" options={{ tabBarIconStyle: { marginTop: 2 } }} />
      <Tabs.Screen name="analysis" options={{ tabBarIconStyle: { marginTop: 2 } }} />
      <Tabs.Screen name="categories" options={{ tabBarIconStyle: { marginTop: 2 } }} />
      <Tabs.Screen
        name="create"
        options={{
          tabBarIconStyle: { marginTop: -8 },
          tabBarItemStyle: { flex: 1, alignItems: "center", justifyContent: "center" },
        }}
      />
      <Tabs.Screen name="budgets" options={{ tabBarIconStyle: { marginTop: 2 } }} />
      <Tabs.Screen name="goals" options={{ tabBarIconStyle: { marginTop: 2 } }} />
      <Tabs.Screen name="profile" options={{ tabBarIconStyle: { marginTop: 2 } }} />

      {/* hidden routes */}
      <Tabs.Screen name="transactions" options={{ href: null }} />
      <Tabs.Screen name="search" options={{ href: null }} />
      <Tabs.Screen name="notifications" options={{ href: null }} />
      <Tabs.Screen name="edit-profile" options={{ href: null }} />
      <Tabs.Screen name="security" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
      <Tabs.Screen name="help" options={{ href: null }} />
    </Tabs>
  );
}
