import React, { useState, useMemo } from "react";
import { ScrollView, StyleSheet, View, Text } from "react-native";
import GoalModal from "../components/GoalModal";
import useCalendarGoal from "../hooks/useCalendarGoal";
import useTradeHistory from "../hooks/useTradeHistory";
import CalendarGrid from "../components/CalendarGrid";
import SectionCard from "../ui/SectionCard";
import GoalSummaryCard from "../ui/GoalSummaryCard";
import GoalPlaceholderCard from "../ui/GoalPlaceholderCard";
import { getCompoundDailyTargets } from "../utils/calendarMath";
import { tokens } from "../theme/tokens";

const CalendarScreen: React.FC = () => {
  const { equityCurve } = useTradeHistory();
  const currentEquity =
    equityCurve && equityCurve.length > 0
      ? equityCurve[equityCurve.length - 1]
      : 0;

  const {
    goal,
    loading: loadingGoal,
    saveGoal,
    removeGoal,
    nDays,
    dailyRate,
  } = useCalendarGoal(currentEquity);

  const [goalModalVisible, setGoalModalVisible] = useState(false);

  const dailyTargets = useMemo(() => {
    if (!goal || dailyRate <= 0) return {};
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(goal.targetDate);
    endDate.setHours(0, 0, 0, 0);
    return getCompoundDailyTargets(currentEquity, dailyRate, startDate, endDate);
  }, [goal, dailyRate, currentEquity]);

  const today = new Date();

  return (
    <ScrollView style={{ backgroundColor: tokens.colors.background }}contentContainerStyle={styles.container}>
      <View style={styles.header}>
        {goal ? (
          <GoalSummaryCard
            goalAmount={goal.targetAmount}
            targetDate={goal.targetDate}
            daysLeft={nDays}
            dailyTarget={dailyRate * 100}
            progressPercent={0.4} // TODO: compute actual progress
            onEdit={() => setGoalModalVisible(true)}
            onReset={removeGoal}
          />
        ) : (
          <GoalPlaceholderCard onPress={() => setGoalModalVisible(true)} />
        )}
      </View>

      <GoalModal
        visible={goalModalVisible}
        onClose={() => setGoalModalVisible(false)}
        onSave={async (amount, date) => {
          await saveGoal({ targetAmount: amount, targetDate: date });
          setGoalModalVisible(false);
        }}
        currentEquity={currentEquity}
        defaultAmount={goal?.targetAmount}
        defaultDate={goal?.targetDate}
      />

      <View style={styles.gridWrapper}>
        <CalendarGrid
          initialMonth={
            goal
              ? new Date(goal.targetDate).getMonth()
              : today.getMonth()
          }
          initialYear={
            goal
              ? new Date(goal.targetDate).getFullYear()
              : today.getFullYear()
          }
          highlightToday
          onDayPress={(date) => {}}
          renderDayContent={(date) => {
            const dateStr = date.toISOString().slice(0, 10);
            const target = dailyTargets[dateStr];
            return target ? (
              <Text style={styles.dayTarget}>+{Math.round(target)} €</Text>
            ) : null;
          }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: tokens.spacing.md,
    backgroundColor: tokens.colors.background,
  },
  header: {
    marginBottom: tokens.spacing.lg,
  },
  gridWrapper: {
    borderRadius: tokens.radius.lg,
    overflow: "hidden",
  },
  dayTarget: {
    fontSize: 10,
    color: tokens.colors.accentGreen,
    fontWeight: "bold",
    marginTop: 2,
    fontFamily: tokens.font.family,
  },
});

export default CalendarScreen;
