import { useState, useCallback } from "react";

//커스텀 훅
export default ({ initailValue = null }) => {
  const [value, setValue] = useState(initailValue);

  const handler = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  return [value, handler, setValue];
};
