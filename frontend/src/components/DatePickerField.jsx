import React, { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';

const CustomHeader = ({ date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled, changeYear }) => {
  const years = [];
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year <= currentYear + 10; year++) {
    years.push(year);
  }
  return (
    <div className="flex items-center justify-between px-2 py-2 border-b border-gray-200 dark:border-[#2a283a] mb-2">
      <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} type="button" className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a283a] transition-colors disabled:opacity-50">
        <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <div className="flex items-center">
        <span className="text-gray-700 dark:text-white font-medium mr-2">{date.toLocaleString('default', { month: 'long' })}</span>
        <select value={date.getFullYear()} onChange={({ target: { value } }) => changeYear(parseInt(value))} className="bg-white dark:bg-[#13111d] text-gray-700 dark:text-white border border-gray-300 dark:border-[#2a283a] rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#6229b3]">
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
      <button onClick={increaseMonth} disabled={nextMonthButtonDisabled} type="button" className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a283a] transition-colors disabled:opacity-50">
        <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );
};

const CustomDateInput = forwardRef(({ value, onClick, error }, ref) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <FaCalendarAlt className="text-gray-400 dark:text-gray-500" />
    </div>
    <input
      ref={ref}
      value={value}
      onClick={onClick}
      className={`w-full px-4 py-3 pl-10 border ${error ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-[#2a283a]'} dark:bg-[#13111d] dark:text-purple-100 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6229b3] focus:border-transparent transition-colors cursor-pointer`}
      readOnly
    />
  </div>
));

const DatePickerField = ({ value, onChange, error, popperPlacement = 'bottom', calendarWidth = 320, ...props }) => (
  <DatePicker
    selected={value}
    onChange={onChange}
    minDate={new Date()}
    dateFormat="MMMM d, yyyy"
    customInput={<CustomDateInput error={error} />}
    renderCustomHeader={CustomHeader}
    calendarClassName="!bg-white dark:!bg-[#13111d] border dark:border-[#2a283a] shadow-2xl rounded-xl p-2"
    wrapperClassName="w-full"
    dayClassName={(date) => "hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-gray-900 dark:hover:text-white m-1 text-sm"}
    popperClassName="z-[105]"
    popperPlacement={popperPlacement}
    popperProps={{
      strategy: "fixed",
      modifiers: [
        { name: "offset", options: { offset: [0, 8] } },
        {
          name: "customStyle",
          enabled: true,
          phase: "write",
          fn: ({ state }) => {
            Object.assign(state.elements.popper.style, {
              width: `${calendarWidth}px`,
              maxWidth: '95vw',
              background: state.elements.popper.classList.contains('dark') ? '#13111d' : '#fff',
              borderRadius: '0.75rem',
              boxShadow: '0 8px 32px 0 rgba(98,41,179,0.15)',
              border: state.elements.popper.classList.contains('dark') ? '1px solid #2a283a' : '1px solid #e5e7eb',
              overflow: 'hidden',
              maxHeight: '400px',
            });
          }
        }
      ]
    }}
    shouldCloseOnScroll={false}
    weekDayClassName={() => "!text-[#6229b3] dark:!text-purple-300 !text-sm !font-medium"}
    monthClassName={() => "!mx-0 !mb-1"}
    fixedHeight
    showPopperArrow={false}
    {...props}
  />
);

export default DatePickerField;
