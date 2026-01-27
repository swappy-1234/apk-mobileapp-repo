import React, { useEffect, useState } from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SELF_KEY = "SELF_CELEBRATION_SHOWN_DATE";
const todayKey = () => new Date().toISOString().split("T")[0];

const isSameDayMonth = (date) => {
  if (!date) return false;
  const t = new Date();
  const d = new Date(date);
  return t.getDate() === d.getDate() && t.getMonth() === d.getMonth();
};

const getYearsCompleted = (doj) => {
  const s = new Date(doj);
  const t = new Date();
  let y = t.getFullYear() - s.getFullYear();
  if (
    t.getMonth() < s.getMonth() ||
    (t.getMonth() === s.getMonth() && t.getDate() < s.getDate())
  ) y--;
  return Math.max(y, 0);
};

const CelebrationCard = ({ employee }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!employee) return;

    const run = async () => {
      const isBirthday = isSameDayMonth(employee.dateOfBirth);
      const isAnniversary = isSameDayMonth(employee.dateOfJoining);

      if (!isBirthday && !isAnniversary) return;

      const stored = await AsyncStorage.getItem(SELF_KEY);
      if (stored === todayKey()) return;

      setVisible(true);
    };

    run();
  }, [employee]);

  const handleClose = async () => {
    await AsyncStorage.setItem(SELF_KEY, todayKey());
    setVisible(false);
  };

  if (!visible) return null;

  const isBirthday = isSameDayMonth(employee.dateOfBirth);
  const isAnniversary = isSameDayMonth(employee.dateOfJoining);
  const years = getYearsCompleted(employee.dateOfJoining);

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.close} onPress={handleClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.heading}>🎉 Celebrate Your Day!</Text>
          <Text style={styles.name}>
            {employee.firstName} {employee.lastName}
          </Text>

          {isBirthday && (
             <View style={styles.section}>
                <Text style={styles.sectionTitle}>🎂 Happy Birthday</Text>
                <Text style={styles.message}>
                  Today is all about celebrating you! May your day be filled
                  with joy, laughter, and unforgettable moments.
                </Text>
              </View>
          )}

          {isAnniversary && (
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>🏆 Work Anniversary</Text>
                <Text style={styles.message}>
                  Congratulations on{" "}
                  <Text style={styles.bold}>{years} incredible years</Text>{" "}
                  with us! Your journey and contributions continue to inspire
                  everyone around you.
                </Text>
              </View>
          )}

          <Text style={styles.date}>📅 {todayKey()}</Text>
        </View>
      </View>
    </Modal>
  );
};

export default CelebrationCard;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "88%",
    backgroundColor: "#ff4fa3",
    borderRadius: 22,
    padding: 20,
  },
  close: { position: "absolute", top: 12, right: 12 },
  closeText: { color: "#fff", fontSize: 18 },
  heading: { color: "#fff", fontSize: 20, fontWeight: "700" },
  name: { color: "#fff", fontSize: 16, fontWeight: "700", marginVertical: 8 },
  message: { color: "#fff", fontSize: 14, marginTop: 6 },
  date: { color: "#fff", marginTop: 12, fontSize: 12 },
   section: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: "#fff",
    lineHeight: 22,
  },
});
