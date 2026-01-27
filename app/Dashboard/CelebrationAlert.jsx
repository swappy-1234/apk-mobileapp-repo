import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ALERT_KEY = "TEAM_CELEBRATION_SHOWN_DATE";
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

const CelebrationAlert = ({ employees }) => {
  const [visible, setVisible] = useState(false);
  const [todayList, setTodayList] = useState([]);

  useEffect(() => {
    if (!employees?.length) return;

    const list = employees
      .map((e) => {
        const b = isSameDayMonth(e.dateOfBirth);
        const a = isSameDayMonth(e.dateOfJoining);
        if (!b && !a) return null;
        return { ...e, birthday: b, anniversary: a };
      })
      .filter(Boolean);

    if (!list.length) return;

    const run = async () => {
      const stored = await AsyncStorage.getItem(ALERT_KEY);
      if (stored === todayKey()) return;

      setTodayList(list);
      setVisible(true);
    };

    run();
  }, [employees]);

  const handleClose = async () => {
    await AsyncStorage.setItem(ALERT_KEY, todayKey());
    setVisible(false);
  };
  

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.alert}>
          <TouchableOpacity style={styles.close} onPress={handleClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.title}>
            🔔 Today’s Celebrations ({todayList.length})
          </Text>

          <ScrollView>
            {todayList.map((e, i) => (
              <View key={i} style={styles.row}>
                <Text style={styles.name}>
                  {e.firstName} {e.lastName}
                </Text>
                <View style={styles.badges}>
                  {e.birthday && <Text>🎂</Text>}
                  {e.anniversary && (
                    <Text>🏆 {getYearsCompleted(e.dateOfJoining)}y</Text>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>
           <View style={styles.footer}>
            <Text style={styles.footerText}>📅 {todayKey()}</Text>
            <Text style={styles.footerText}>Spread the joy 🎉</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CelebrationAlert;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 90,
    paddingRight: 12,
  },
  alert: {
    width: 280,
    backgroundColor: "#8b5cf6",
    borderRadius: 18,
    padding: 14,
    maxHeight: 360,
  },
  close: { position: "absolute", right: 10, top: 8 },
  closeText: { color: "#fff", fontSize: 16 },
  title: { color: "#fff", fontWeight: "700", marginBottom: 10 },
  row: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  name: { color: "#fff", fontWeight: "600" },
  badges: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  footer: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    color: "#fff",
    fontSize: 12,
  },
});
