import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../theme/colors";

function getMonthGrid(year: number, month: number) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1);
  const startWeekDay = (firstDay.getDay() + 6) % 7;
  const grid: ({ date: Date | null; day: number | null })[][] = [];
  let currentDay = 1 - startWeekDay;

  for (let row = 0; row < 6; row++) {
    const week: { date: Date | null; day: number | null }[] = [];
    for (let col = 0; col < 7; col++) {
      if (currentDay < 1 || currentDay > daysInMonth) {
        week.push({ date: null, day: null });
      } else {
        const date = new Date(year, month, currentDay);
        week.push({ date, day: currentDay });
      }
      currentDay++;
    }
    grid.push(week);
  }
  return grid;
}

const daysShort = ["Po", "Ut", "St", "Št", "Pi", "So", "Ne"];
const monthsSk = [
  "Január", "Február", "Marec", "Apríl", "Máj", "Jún",
  "Júl", "August", "September", "Október", "November", "December"
];

interface CalendarGridProps {
  initialMonth?: number;
  initialYear?: number;
  onDayPress?: (date: Date) => void;
  renderDayContent?: (date: Date) => React.ReactNode;
  highlightToday?: boolean;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  initialMonth,
  initialYear,
  onDayPress,
  renderDayContent,
  highlightToday = true,
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewMonth, setViewMonth] = useState(
    typeof initialMonth === "number" ? initialMonth : today.getMonth()
  );
  const [viewYear, setViewYear] = useState(
    typeof initialYear === "number" ? initialYear : today.getFullYear()
  );

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(y => y - 1);
    } else {
      setViewMonth(m => m - 1);
    }
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(y => y + 1);
    } else {
      setViewMonth(m => m + 1);
    }
  };

  const grid = getMonthGrid(viewYear, viewMonth);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={prevMonth} style={styles.arrowButton}>
          <Text style={styles.arrowText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.monthText}>
          {monthsSk[viewMonth]} {viewYear}
        </Text>
        <TouchableOpacity onPress={nextMonth} style={styles.arrowButton}>
          <Text style={styles.arrowText}>›</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        {daysShort.map((d, idx) => (
          <View key={idx} style={styles.headerCell}>
            <Text style={styles.headerText}>{d}</Text>
          </View>
        ))}
      </View>
      {grid.map((week, rowIdx) => (
        <View key={rowIdx} style={styles.row}>
          {week.map((cell, colIdx) => {
            const isToday =
              highlightToday &&
              cell.date &&
              cell.date.getFullYear() === today.getFullYear() &&
              cell.date.getMonth() === today.getMonth() &&
              cell.date.getDate() === today.getDate() &&
              viewMonth === today.getMonth() &&
              viewYear === today.getFullYear();

            return (
              <TouchableOpacity
                key={colIdx}
                style={[styles.cell, isToday && styles.todayCell, !cell.date && styles.emptyCell]}
                disabled={!cell.date}
                onPress={() => cell.date && onDayPress?.(cell.date)}
                activeOpacity={cell.date ? 0.7 : 1}
              >
                <View style={styles.dayContent}>
                  <Text
                    style={[
                      styles.dayNumber,
                      isToday && styles.todayNumber,
                      !cell.date && styles.emptyText,
                    ]}
                  >
                    {cell.day || ""}
                  </Text>
                  {cell.date && renderDayContent?.(cell.date)}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 2,
    marginBottom: 16,
    alignSelf: "stretch",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  arrowButton: {
    padding: 8,
    borderRadius: 50,
  },
  arrowText: {
    fontSize: 28,
    color: colors.textPrimary,
  },
  monthText: {
    color: colors.textPrimary,
    fontWeight: "bold",
    fontSize: 19,
    letterSpacing: 1.1,
    textAlign: "center",
    flex: 1,
    fontFamily: 'monospace',
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 2,
    marginBottom: 2,
  },
  headerText: {
    fontWeight: "bold",
    color: colors.textMuted,
    fontSize: 13,
    letterSpacing: 0.5,
    fontFamily: 'monospace',
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    margin: 1.5,
    borderRadius: 8,
    backgroundColor: colors.backgroundInner,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  emptyCell: {
    backgroundColor: colors.transparent,
  },
  dayContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dayNumber: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: "bold",
    marginBottom: 2,
    fontFamily: 'monospace',
  },
  todayCell: {
    backgroundColor: colors.accentBlue,
    borderWidth: 2,
    borderColor: colors.textPrimary,
  },
  todayNumber: {
    color: colors.textPrimary,
    fontWeight: "bold",
  },
  emptyText: {
    color: colors.transparent,
  },
});

export default CalendarGrid;
