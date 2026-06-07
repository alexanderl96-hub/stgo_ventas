import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function BirthdayPicker({
  form,
  setForm
}) {
  const [birthday, setBirthday] = useState(null);

  return (
    <DatePicker
      selected={birthday}
      onChange={(date) => {
        setBirthday(date);

        setForm({
          ...form,
          birthday: date
        });
      }}
      showYearDropdown
      scrollableYearDropdown
      yearDropdownItemNumber={100}
      placeholderText="Fecha de Nacimiento"
      dateFormat="MM/dd/yyyy"
    />
  );
}