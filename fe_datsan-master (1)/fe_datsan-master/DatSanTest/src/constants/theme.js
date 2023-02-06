import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

export const COLORS = {
  // base colors
  primary: '#5390ff', // Blue
  secondary: '#cacfd9', // Gray

  borderColor: '#D9D9D9',

  dangerColor: '#FF5D5D',
  editColor: '#FFAA00',
  overlayColor: 'rgba(68,68,68,0.6)',

  // colors
  black: '#1E1F20',
  white: '#FFFFFF',
  lightGray: '#eff2f5',
  gray: '#8b9097',
  backgroundColor: '#F9F9F9',
  primaryColor: '#7ED957',
  btnDisabled: '#95D779',
  blackColor: '#000000',
  yellowColor: '#F7EC09',
  whiteColor: '#FFFFFF',
  lightGreenColor: '#CFEE91',
  grayColor: '#7F8487',
  lightGrayColor: '#D8D8D8',
  lightYellowColor: '#FCF9C6',
  beigeColor: '#F8EEB4',
  infoColor: '#42C2FF',
};
export const SIZES = {
  // global sizes
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,

  // font sizes
  largeTitle: 50,
  h1: 30,
  h2: 26,
  h3: 22,
  h4: 18,
  h5: 14,
  h6: 10,
  body1: 30,
  body2: 22,
  body3: 16,
  body4: 14,

  // app dimensions
  width,
  height,
};
export const FONTS = {
  largeTitle: {
    fontFamily: 'Roboto-Black',
    fontSize: SIZES.largeTitle,
    lineHeight: 55,
  },
  h1: {fontFamily: 'Roboto-Black', fontSize: SIZES.h1, lineHeight: 36},
  h2: {fontFamily: 'Roboto-Bold', fontSize: SIZES.h2, lineHeight: 30},
  h3: {fontFamily: 'Roboto-Bold', fontSize: SIZES.h3, lineHeight: 22},
  h4: {fontFamily: 'Roboto-Bold', fontSize: SIZES.h4, lineHeight: 22},
  h5: {fontFamily: 'Roboto-Bold', fontSize: SIZES.h5, lineHeight: 22},
  body1: {fontFamily: 'Roboto-Regular', fontSize: SIZES.body1, lineHeight: 36},
  body2: {fontFamily: 'Roboto-Regular', fontSize: SIZES.body2, lineHeight: 30},
  body3: {fontFamily: 'Roboto-Regular', fontSize: SIZES.body3, lineHeight: 22},
  body4: {fontFamily: 'Roboto-Regular', fontSize: SIZES.body4, lineHeight: 22},
};

const appTheme = {COLORS, SIZES, FONTS};

export default appTheme;
