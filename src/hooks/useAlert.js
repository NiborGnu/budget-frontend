import { useState } from "react";

export function useAlert(
  initialState = { show: false, message: "", variant: "" }
) {
  const [alert, setAlert] = useState(initialState);

  const showAlert = (message, variant = "success") => {
    setAlert({ show: true, message, variant });
  };

  const hideAlert = () => {
    setAlert({ show: false, message: "", variant: "" });
  };

  return { alert, showAlert, hideAlert };
}
