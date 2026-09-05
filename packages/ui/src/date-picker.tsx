import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { AVAILABLE_TIME_SLOTS } from '@repo/utils';

export interface DateOption {
  dateString: string; // YYYY-MM-DD
  dayLabel: string; // "Today", "Tomorrow", "Wed"
  dateLabel: string; // "14 Oct"
}

export function generateUpcomingDates(count = 7): DateOption[] {
  const options: DateOption[] = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);

    const dateString = d.toISOString().split('T')[0] || '2026-10-15';
    let dayLabel = d.toLocaleDateString('en-IN', { weekday: 'short' });
    if (i === 0) dayLabel = 'Today';
    if (i === 1) dayLabel = 'Tomorrow';

    const dateLabel = d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });

    options.push({ dateString, dayLabel, dateLabel });
  }

  return options;
}

interface DateSlotPickerProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  selectedTimeSlot: string;
  onSelectTimeSlot: (slot: string) => void;
}

export const DateSlotPicker: React.FC<DateSlotPickerProps> = ({
  selectedDate,
  onSelectDate,
  selectedTimeSlot,
  onSelectTimeSlot,
}) => {
  const dates = generateUpcomingDates(7);

  return (
    <View style={styles.container}>
      {/* Date selector */}
      <Text style={styles.sectionLabel}>Select Date</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.datesRow}>
        {dates.map((item) => {
          const isSelected = selectedDate === item.dateString;
          return (
            <TouchableOpacity
              key={item.dateString}
              style={[styles.dateCard, isSelected && styles.dateCardSelected]}
              onPress={() => onSelectDate(item.dateString)}
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.dayLabel,
                  isSelected && styles.dayLabelSelected,
                ]}>
                {item.dayLabel}
              </Text>
              <Text
                style={[
                  styles.dateLabel,
                  isSelected && styles.dateLabelSelected,
                ]}>
                {item.dateLabel}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Time slots */}
      <Text style={[styles.sectionLabel, { marginTop: 18 }]}>
        Select Arrival Time Slot
      </Text>
      <View style={styles.slotsGrid}>
        {AVAILABLE_TIME_SLOTS.map((slot) => {
          const isSelected = selectedTimeSlot === slot;
          return (
            <TouchableOpacity
              key={slot}
              style={[styles.slotChip, isSelected && styles.slotChipSelected]}
              onPress={() => onSelectTimeSlot(slot)}
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.slotChipText,
                  isSelected && styles.slotChipTextSelected,
                ]}>
                {slot}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 10,
  },
  datesRow: {
    gap: 10,
    paddingVertical: 4,
  },
  dateCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    minWidth: 78,
  },
  dateCardSelected: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
  },
  dayLabelSelected: {
    color: '#EDE9FE',
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  dateLabelSelected: {
    color: '#FFFFFF',
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  slotChip: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  slotChipSelected: {
    backgroundColor: '#EDE9FE',
    borderColor: '#7C3AED',
  },
  slotChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  slotChipTextSelected: {
    color: '#7C3AED',
    fontWeight: '800',
  },
});
