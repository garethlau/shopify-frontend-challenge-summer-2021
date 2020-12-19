import { useState } from "react";

export default function useTextField(initialValue) {
  const [value, setValue] = useState(initialValue);

  function onChange(e) {
    setValue(e.target.value);
  }

  return {
    value,
    setValue,
    onChange,
  };
}
