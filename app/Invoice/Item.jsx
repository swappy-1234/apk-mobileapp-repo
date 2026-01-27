import { View, Text, StyleSheet } from "react-native";
import styles from '../../styles/Invoice/Item';

const Item = ({ each }) => {
  return (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.left]}>
        {each.description}
      </Text>

      <Text style={styles.cell}>
        {each.quantity}
      </Text>

      <Text style={styles.cell}>
        {each.unitPrice}
      </Text>

      <Text style={styles.cell}>
        {each.totalPrice}
      </Text>
    </View>
  );
};

export default Item;
