







import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EmployeeDashboard from './app/EmployeeDashboard';
import ForgotPassword from './app/ForgotPassword';
import Login from './app/Login';
import MyColleagues from './app/MyColleagues';
import OrganizationChart from './app/OrganizationChart';
import Tenant from './app/Tenant';
// import { MyProvider } from './MyProvider/MyProvider';
// import LayoutWrapper from './app/LayoutWrapper';
import AddEmployee from './app/Admin/AddEmployee';
import Employee from './app/Admin/Employee';
import PersonalInformation from './app/Admin/PersonalInformation';
import CompanyBranch from './app/Admin/SetupYarihive/CompanyBranch/CompanyBranch';
import JobRoles from './app/Admin/SetupYarihive/JobRoles';
import SetUpYariHive from './app/Admin/SetupYarihive/SetUpYariHive';
import LeaveEmployee from './app/LeaveManagement/LeaveEmployee';
import EmployeeTimesheet from './app/TimeSheet/EmployeeTimesheet';
import Projects from './app/Projects/Projects';
import AdminCompliance from './app/Compliance/AdminCompliance';
import EmployeePensionDetails from './app/Compliance/EmployeePensionDetails';
import EmployeeCompliance from './app/Compliance/EmployeeCompliance';
import ComplianceManagement from './app/Compliance/ComplianceManagement';
import MyTeam from './app/Admin/MyTeam/MyTeam';
import ReleaseEmployees from './app/Admin/ReleaseEmployees';
import BenchEmployees from './app/Admin/BenchEmployees';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
        <Stack.Navigator>          
          <Stack.Screen name="Tenant" component={Tenant} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name='ForgotPassword' component={ForgotPassword} />
          <Stack.Screen name="MyColleagues" component={MyColleagues} />
          <Stack.Screen name="EmployeeDashboard" component={EmployeeDashboard} />
          <Stack.Screen name="OrganizationChart" component={OrganizationChart} />
          <Stack.Screen name="LeaveEmployee" component={LeaveEmployee} />
           <Stack.Screen name="Projects" component={Projects} />
          <Stack.Screen name="EmployeeTimesheet" component={EmployeeTimesheet} />
          <Stack.Screen name="AdminCompliance" component={AdminCompliance} />
<Stack.Screen name="EmployeePensionDetails" component={EmployeePensionDetails} />
<Stack.Screen name="EmployeeCompliance" component={EmployeeCompliance} />
<Stack.Screen name="ComplianceManagement" component={ComplianceManagement} />

          <Stack.Screen name="Employee" component={Employee} />
          <Stack.Screen name="SetUpYariHive" component={SetUpYariHive}/>
          <Stack.Screen name="JobRoles" component={JobRoles}/>
          <Stack.Screen name='AddEmployee' component={AddEmployee}/>
          <Stack.Screen name='MyTeam' component={MyTeam}/>
          <Stack.Screen name="PersonalInformation" component={PersonalInformation}/>
          <Stack.Screen name="ReleaseEmployees" component={ReleaseEmployees}/>
          <Stack.Screen name="BenchEmployees" component={BenchEmployees}/>
        </Stack.Navigator>
      
    </NavigationContainer>
  );
}
