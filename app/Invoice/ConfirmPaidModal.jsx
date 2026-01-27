import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import styles from '../../styles/Invoice/ConfirmPaidModal';


const ConfirmPaidModal = ({
  visible,
  setIsUpdateModel,
  updateInvoice,
  fetchByInvoiceId,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => setIsUpdateModel(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.heading}>Confirm Payment</Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              <Text style={styles.bold}>Invoice Number: </Text>
              {updateInvoice.invoiceNumber}
            </Text>

            <Text style={styles.infoText}>
              <Text style={styles.bold}>Client Name: </Text>
              {updateInvoice?.client?.clientName}
            </Text>

            <Text style={styles.infoText}>
              <Text style={styles.bold}>Amount: </Text>
              {updateInvoice.country === "UK" ? "£" : "₹"}
              {updateInvoice.totalAmount}
            </Text>
          </View>

          <Text style={styles.confirmText}>
            Are you sure you want to update this invoice as{" "}
            <Text style={styles.bold}>Paid</Text>?
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelBtn]}
              onPress={() => setIsUpdateModel(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.updateBtn]}
              onPress={() => fetchByInvoiceId(updateInvoice.id)}
            >
              <Text style={styles.updateText}>Update as Paid</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmPaidModal;
