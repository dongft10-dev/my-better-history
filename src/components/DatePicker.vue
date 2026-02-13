<template>
  <div class="datepicker-wrapper">
    <div class="datepicker-input-group">
      <div class="datepicker-calendar-icon" title="Calendar">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      </div>
      <button @click="prevDay" class="datepicker-nav-day-btn" title="Previous day">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      <input
        type="text"
        :value="formattedDate"
        :placeholder="placeholderText"
        readonly
        @click="toggleCalendar"
        class="datepicker-input"
      />
      <button @click="nextDay" class="datepicker-nav-day-btn" title="Next day">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
      <button @click="goToToday" class="datepicker-today-btn">
        Today
      </button>
    </div>
    <div v-if="showCalendar" class="calendar-popup">
      <div class="calendar-header">
        <button @click="prevMonth" class="calendar-nav-btn">&lt;</button>
        <span class="calendar-month-year">{{ currentMonthYear }}</span>
        <button @click="nextMonth" class="calendar-nav-btn">&gt;</button>
      </div>
      <div class="calendar-weekdays">
        <span v-for="day in weekDays" :key="day">{{ day }}</span>
      </div>
      <div class="calendar-days">
        <button
          v-for="day in calendarDays"
          :key="day.date"
          @click="selectDate(day)"
          :class="[
            'calendar-day',
            { 'other-month': !day.currentMonth },
            { 'today': day.isToday },
            { 'selected': day.isSelected }
          ]"
          :disabled="day.isFuture"
        >
          {{ day.day }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted, inject } from 'vue';

export default {
  name: 'DatePicker',
  emits: ['select', 'today', 'dateChange'],
  props: {
    modelValue: { type: Date, default: null }
  },
  setup(props, { emit }) {
    const t = inject('t')
    const showCalendar = ref(false);
    const currentDate = ref(new Date());
    const selectedDate = ref(props.modelValue);

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const formattedDate = computed(() => {
      if (!selectedDate.value) return '';
      return selectedDate.value.toLocaleDateString();
    });

    const placeholderText = computed(() => t.value ? t.value('selectDate') : 'Select date');

    const currentMonthYear = computed(() => {
      return currentDate.value.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      });
    });

    const calendarDays = computed(() => {
      const year = currentDate.value.getFullYear();
      const month = currentDate.value.getMonth();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const firstDay = new Date(year, month, 1);
      const startDate = new Date(firstDay);
      startDate.setDate(startDate.getDate() - firstDay.getDay());

      const days = [];
      const current = new Date(startDate);

      for (let i = 0; i < 42; i++) {
        const isToday = current.getTime() === today.getTime();
        const isFuture = current > today;
        const isSelected = selectedDate.value &&
          current.getTime() === selectedDate.value.setHours(0, 0, 0, 0);

        days.push({
          date: current.toISOString(),
          day: current.getDate(),
          currentMonth: current.getMonth() === month,
          isToday,
          isFuture,
          isSelected
        });

        current.setDate(current.getDate() + 1);
      }

      return days;
    });

    const toggleCalendar = () => {
      showCalendar.value = !showCalendar.value;
    };

    const selectDate = (day) => {
      if (!day.currentMonth || day.isFuture) return;
      const date = new Date(day.date);
      selectedDate.value = date;
      showCalendar.value = false;
      emit('select', date);
    };

    const goToToday = () => {
      const today = new Date();
      selectedDate.value = today;
      currentDate.value = new Date(today);
      showCalendar.value = false;
      emit('today', today);
      emit('dateChange', today);
    };

    const prevDay = () => {
      const current = selectedDate.value || new Date();
      const prev = new Date(current);
      prev.setDate(prev.getDate() - 1);
      selectedDate.value = prev;
      currentDate.value = new Date(prev);
      emit('select', prev);
      emit('dateChange', prev);
    };

    const nextDay = () => {
      const current = selectedDate.value || new Date();
      const next = new Date(current);
      next.setDate(next.getDate() + 1);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (next <= today) {
        selectedDate.value = next;
        currentDate.value = new Date(next);
        emit('select', next);
        emit('dateChange', next);
      }
    };

    const prevMonth = () => {
      currentDate.value = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth() - 1,
        1
      );
    };

    const nextMonth = () => {
      currentDate.value = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth() + 1,
        1
      );
    };

    const handleClickOutside = (event) => {
      if (!event.target.closest('.datepicker-wrapper')) {
        showCalendar.value = false;
      }
    };

    watch(() => props.modelValue, (newVal) => {
      if (newVal) {
        selectedDate.value = newVal;
        currentDate.value = new Date(newVal);
      }
    });

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
      if (props.modelValue) {
        selectedDate.value = props.modelValue;
        currentDate.value = new Date(props.modelValue);
      }
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });

    return {
      showCalendar,
      currentDate,
      selectedDate,
      weekDays,
      formattedDate,
      currentMonthYear,
      calendarDays,
      toggleCalendar,
      selectDate,
      goToToday,
      prevDay,
      nextDay,
      prevMonth,
      nextMonth
    };
  }
};
</script>

<style scoped>
.datepicker-wrapper {
  position: relative;
}

.datepicker-input-group {
  display: flex;
  gap: 8px;
}

.datepicker-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background-color: white;
  color: #374151;
  cursor: pointer;
  text-align: center;
}

.dark .datepicker-input {
  background-color: #374151;
  border-color: #4b5563;
  color: #f3f4f6;
}

.datepicker-nav-day-btn {
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: white;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.dark .datepicker-nav-day-btn {
  background-color: #374151;
  border-color: #4b5563;
  color: #9ca3af;
}

.datepicker-nav-day-btn:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.dark .datepicker-nav-day-btn:hover {
  background-color: #4b5563;
}

.datepicker-calendar-icon {
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: white;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dark .datepicker-calendar-icon {
  background-color: #374151;
  border-color: #4b5563;
  color: #9ca3af;
}

.datepicker-toggle-btn {
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: white;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.dark .datepicker-toggle-btn {
  background-color: #374151;
  border-color: #4b5563;
  color: #9ca3af;
}

.datepicker-toggle-btn:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.dark .datepicker-toggle-btn:hover {
  background-color: #4b5563;
}

.datepicker-today-btn {
  padding: 8px 16px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.datepicker-today-btn:hover {
  background-color: #2563eb;
}

.calendar-popup {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  padding: 16px;
  z-index: 100;
  width: 280px;
}

.dark .calendar-popup {
  background: #1f2937;
  border: 1px solid #374151;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.calendar-nav-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #f3f4f6;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
}

.dark .calendar-nav-btn {
  background: #374151;
  color: #f3f4f6;
}

.calendar-nav-btn:hover {
  background: #e5e7eb;
}

.dark .calendar-nav-btn:hover {
  background: #4b5563;
}

.calendar-month-year {
  font-weight: 600;
  color: #1f2937;
}

.dark .calendar-month-year {
  color: #f3f4f6;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}

.calendar-weekdays span {
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
}

.dark .calendar-weekdays span {
  color: #9ca3af;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.calendar-day {
  aspect-ratio: 1;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  transition: all 0.2s;
}

.dark .calendar-day {
  color: #f3f4f6;
}

.calendar-day:hover:not(:disabled) {
  background: #f3f4f6;
}

.dark .calendar-day:hover:not(:disabled) {
  background: #374151;
}

.calendar-day.other-month {
  color: #d1d5db;
}

.dark .calendar-day.other-month {
  color: #4b5563;
}

.calendar-day.today {
  font-weight: 600;
  color: #3b82f6;
}

.calendar-day.selected {
  background: #3b82f6;
  color: white;
}

.calendar-day:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
