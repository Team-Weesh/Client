"use client";

import Aside from '@/components/Aside';
import CalendarSection from '@/components/Calandar/Calendar';
import Modal from '@/components/Aside/Modal';
import styles from './page.module.css';
import { useAside } from './useAside';

const Main = () => {
  const {
    selectedDate,
    selectedTime,
    currentDate,
    selectedDateText,
    currentMonthText,
    bookingData,
    timeSelectionData,
    isModalOpen,
    actions
  } = useAside();

  return (
    <div className={styles.container}>
      <Aside
        type="booking"
        position="left"
        data={bookingData}
      />

      <CalendarSection
        selectedDate={selectedDate}
        onDateSelect={actions.setSelectedDate}
        currentMonth={currentMonthText} 
        currentDate={currentDate} 
        onPrevMonth={actions.goToPrevMonth}
        onNextMonth={actions.goToNextMonth}
      />

      <Aside
        type="timeSelection"
        position="right"
        data={timeSelectionData}
        actions={{
          onTimeSelect: actions.setSelectedTime,
          onBooking: actions.handleNewBooking,
        }}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={actions.closeModal}
        selectedDate={selectedDateText}
        selectedTime={selectedTime}
      />
    </div>
  );
};

export default Main;