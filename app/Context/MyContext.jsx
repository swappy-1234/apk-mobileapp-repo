import React, { createContext, useState } from "react";

export const MyContext = createContext(null);

export const MyProvider = ({ children }) => {
  const [state, setState] = useState(null);
  const [companyDetails, setCompanyDetails] = useState({});
  const [tenantId, setTenantId] = useState("");
  const [role, setRole] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [schemaName, setSchemaName] = useState("");
  const [themes, setThemes] = useState("");
  const [roleColors, setRoleColors] = useState({
    admin: "#E0912F",
    manager: "#E0912F",
    employee: "#E0912F",
  });

  const updateState = (newState) => setState(newState);
  const updateCompanyDetails=(newState)=>setCompanyDetails(newState);
  const updateTenantId=(tenantId)=> setTenantId(tenantId);
  const updateRole=(newRole)=>setRole(newRole);
  const updateEmployeeId=(newEmployeeId)=>{
    console.log("new emp id", newEmployeeId);
    setEmployeeId(newEmployeeId)};
  const updateSchemaName=(newSchemaName)=>setSchemaName(newSchemaName);
  const updateThemes=(newThemes)=>{
    if(newThemes.backgroundColor){
      setRoleColors((prev)=>({
        ...prev,
        [role]:newThemes.backgroundColor
      }))
    }
    setThemes(newThemes)}

  return (
    <MyContext.Provider value={{ state, updateState, tenantId, updateTenantId, companyDetails, updateCompanyDetails , role,updateRole, employeeId,updateEmployeeId,schemaName,updateSchemaName,themes,updateThemes,roleColors}}>
      {children}
    </MyContext.Provider>
  );
};
