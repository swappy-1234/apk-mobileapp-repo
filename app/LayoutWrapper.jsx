import { View, StyleSheet } from 'react-native';
import Navbar from './Navbar';

const LayoutWrapper = ({ children }) => {
  return (
    <View style={styles.container}>
      <Navbar />
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default LayoutWrapper;
