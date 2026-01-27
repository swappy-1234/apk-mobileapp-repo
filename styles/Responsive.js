import { Dimensions } from "react-native";
const {width, height} = Dimensions.get('window');

// Base sizes from your design (e.g., iPhone X)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

export const wp = (size) => (width / BASE_WIDTH) * size;   // width percentage
export const hp = (size) => (height / BASE_HEIGHT) * size;  // height percentage
