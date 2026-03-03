import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

export type CalendarSectionProps = {
  currentMonth: Date;
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  onChangeMonth: (date: Date) => void;
  /** 날짜별 인증 횟수 (키: 'YYYY-MM-DD'). 0=미인증(옅은 회색), 1~4+ = 단계별 색상 */
  verificationCountByDate?: Record<string, number>;
  loading?: boolean;
};

const weekLabels = ['일', '월', '화', '수', '목', '금', '토'];
/** 0=미인증(옅은 회색), 1~4단계 = 옅은색→짙은색 */
const noAuthColor = '#E5E5E5';
const levelColors = ['#A3FFC5', '#2FE377', '#18A04E', '#06521F'];
const DARK_LEVEL_INDEX = 3;
const CALENDAR_PADDING = 20;
const CALENDAR_GAP = 10;
const WEEK_COLUMNS = 7;
const CELL_WIDTH = 39;
const CELL_HEIGHT = 49;
const CALENDAR_WIDTH = CELL_WIDTH * WEEK_COLUMNS + CALENDAR_GAP * (WEEK_COLUMNS - 1);

const getMonthLabel = (date: Date) => `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
const isSameDay = (a: Date | null, b: Date) =>
  !!a &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function CalendarSection({
  currentMonth,
  selectedDate,
  onSelectDate,
  onChangeMonth,
  verificationCountByDate = {},
  loading = false,
}: CalendarSectionProps) {
  const [activeArrow, setActiveArrow] = useState<'prev' | 'next' | null>(null);

  const todayMonthStart = useMemo(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), 1);
  }, []);

  const canGoPrev = useMemo(() => {
    const cur = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getTime();
    return cur > todayMonthStart.getTime();
  }, [currentMonth, todayMonthStart]);

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const startDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const slots = [];
    for (let i = 0; i < startDay; i += 1) {
      slots.push(null);
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      slots.push(new Date(year, month, day));
    }
    return slots;
  }, [currentMonth]);

  return (
    <View>
      <View style={styles.monthRow}>
        <Pressable
          onPress={() =>
            canGoPrev &&
            onChangeMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
            )
          }
          onPressIn={() => setActiveArrow('prev')}
          onPressOut={() => setActiveArrow(null)}
          style={styles.monthButton}
          disabled={!canGoPrev}
        >
          <Text
            style={[
              styles.monthArrow,
              activeArrow === 'prev' && styles.monthArrowActive,
              !canGoPrev && styles.monthArrowDisabled,
            ]}
          >
            ◀
          </Text>
        </Pressable>
        <Text style={styles.monthText}>{getMonthLabel(currentMonth)}</Text>
        <Pressable
          onPress={() =>
            onChangeMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
            )
          }
          onPressIn={() => setActiveArrow('next')}
          onPressOut={() => setActiveArrow(null)}
          style={styles.monthButton}
        >
          <Text style={[styles.monthArrow, activeArrow === 'next' && styles.monthArrowActive]}>
            ▶
          </Text>
        </Pressable>
      </View>

      <View style={[styles.weekRow, { width: CALENDAR_WIDTH }]}>
        {weekLabels.map((day) => (
          <Text key={day} style={[styles.weekText, { width: CELL_WIDTH }]}>
            {day}
          </Text>
        ))}
      </View>

      <View style={[styles.calendarGrid, { width: CALENDAR_WIDTH }]}>
        {calendarDays.map((day, index) => {
          if (!day) {
            return (
              <View
                key={`empty-${index}`}
                style={[styles.emptyCell, { width: CELL_WIDTH, height: CELL_HEIGHT }]}
              />
            );
          }
          const isSelected = isSameDay(selectedDate, day);
          const key = toDateKey(day);
          const count = verificationCountByDate[key] ?? 0;
          const level = count <= 0 ? -1 : Math.min(count, 4) - 1;
          const dayColor = level < 0 ? noAuthColor : levelColors[level];
          const useWhiteText = level === DARK_LEVEL_INDEX || isSelected;
          return (
            <Pressable
              key={`day-${key}`}
              onPress={() => onSelectDate(day)}
              style={[
                styles.dayCell,
                { width: CELL_WIDTH, height: CELL_HEIGHT },
                { backgroundColor: loading ? noAuthColor : dayColor },
                isSelected ? styles.daySelected : null,
              ]}
            >
              <Text style={[styles.dayText, useWhiteText ? styles.dayTextSelected : null]}>
                {day.getDate()}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  monthButton: {
    width: 32,
    alignItems: 'center',
  },
  monthText: {
    
    fontSize: 16,
    fontWeight: '700',
    color: '#373737'
  },
  monthArrow: {
    fontSize: 16,
    color: '#B7B7B7',
  },
  monthArrowActive: {
    color: colors.primary,
  },
  monthArrowDisabled: {
    opacity: 0.4,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: CALENDAR_GAP,
    marginBottom: 12,
    alignSelf: 'center',
  },
  weekText: {
    textAlign: 'center',
    color: '#777777',
    fontWeight: '600',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CALENDAR_GAP,
    justifyContent: 'flex-start',
    alignSelf: 'center',
  },
  emptyCell: {
    backgroundColor: '#F4F4F4',
    borderWidth: 0.5,
    borderColor: '#D9D9D9',
    borderRadius: 4,
  },
  dayCell: {
    borderRadius: 4,
    backgroundColor: '#F4F4F4',
    borderWidth: 0.5,
    borderColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  daySelected: {
    backgroundColor: '#ffffff',
    borderColor: colors.primary,
  },
  dayText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3C3C3C',
  },
  dayTextSelected: {
    color: '#111111',
  },
});

export default CalendarSection;
