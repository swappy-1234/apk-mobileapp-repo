// MyProvider.js
import { createContext, useState } from 'react';

export const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [state, setState] = useState({
    reportingTo: null,
  });
  const [companyDetails, setCompanyDetails] = useState({});
  const [tenantId, setTenantId] = useState("");

  const updateState = (newState) =>
    setState((prev) => ({ ...prev, ...newState }));

  return (
    <MyContext.Provider
      value={{ state, updateState, tenantId, setTenantId, companyDetails, setCompanyDetails }}
    >
      {children}
    </MyContext.Provider>
  );
};
