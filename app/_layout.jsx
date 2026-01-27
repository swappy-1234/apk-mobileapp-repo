import { Stack } from "expo-router";
import {MyProvider} from './Context/MyContext';

export default function RootLayout() {
  return (
    <MyProvider>
      <Stack />
    </MyProvider>
  );
}
