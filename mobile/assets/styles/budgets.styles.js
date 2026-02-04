import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },
  backButton: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: COLORS.card,
  },
  content: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 6,
  },
  cardSub: {
    fontSize: 12,
    color: COLORS.textDarkMuted,
  },
  input: {
    backgroundColor: COLORS.cardAlt,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.textDark,
    marginTop: 12,
  },
  primaryButton: {
    marginTop: 12,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 18,
    alignItems: "center",
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 14,
  },
  progressTrack: {
    height: 8,
    borderRadius: 10,
    backgroundColor: COLORS.cardAlt,
    marginTop: 12,
    overflow: "hidden",
  },
  progressFill: {
    height: 8,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  rowLabel: {
    fontSize: 12,
    color: COLORS.textDarkMuted,
  },
  rowValue: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 12,
  },
  linkButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: COLORS.cardAlt,
  },
  linkButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  dangerText: {
    color: "#E11D48",
  },
});
