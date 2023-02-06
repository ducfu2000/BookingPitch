import {StyleSheet} from 'react-native';
import {COLORS, SIZES} from './theme';

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
    flex: 1,
    backgroundColor: COLORS.whiteColor,
  },
  rootDetail: {
    alignItems: 'center',
    flex: 1,
    paddingBottom: 20,
    backgroundColor: COLORS.backgroundColor,
  },

  // Text Color
  textBlack: {
    color: COLORS.blackColor,
  },

  logo: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  image: {
    width: '70%',
    maxWidth: 500,
    maxHeight: 280,
    marginVertical: 10,
  },

  // Width
  w20: {
    width: '20%',
  },
  w25: {
    width: '25%',
  },
  w45: {
    width: '45%',
  },
  w50: {
    width: '50%',
  },
  wct: {
    width: SIZES.width - 180,
  },
  w60: {
    width: '60%',
  },
  w70: {
    width: '70%',
  },
  w75: {
    width: '75%',
  },
  w80: {
    width: '80%',
  },
  w90: {
    width: '90%',
  },
  w100: {
    width: '100%',
  },

  // Height
  h25: {
    height: '25%',
  },
  h50: {
    height: '50%',
  },
  h75: {
    height: '75%',
  },
  h100: {
    height: '100%',
  },

  // Flex
  row: {
    flexDirection: 'row',
  },
  colum: {
    flexDirection: 'column',
    width: '50%',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  spaceAround: {
    justifyContent: 'space-around',
  },
  centerHorizontal: {
    justifyContent: 'center',
  },
  centerVertically: {
    alignItems: 'center',
  },

  left: {
    width: '100%',
    alignItems: 'flex-start',
  },
  right: {
    width: '100%',
    alignItems: 'flex-end',
  },
  bottom: {
    justifyContent: 'flex-end',
  },

  // Padding
  pv5: {
    paddingVertical: 5,
  },
  pv15: {
    paddingVertical: 15,
  },
  ph10: {
    paddingHorizontal: 10,
  },
  ph15: {
    paddingHorizontal: 15,
  },
  ph20: {
    paddingHorizontal: 20,
  },
  ph25: {
    paddingHorizontal: 25,
  },
  ph30: {
    paddingHorizontal: 30,
  },
  pt6: {
    paddingTop: 6,
  },
  pb5: {
    paddingBottom: 5,
  },
  p5: {
    padding: 5,
  },
  p10: {
    padding: 10,
  },
  p15: {
    padding: 15,
  },
  p20: {
    padding: 20,
  },

  // Margin
  mv5: {
    marginVertical: 5,
  },
  mv10: {
    marginVertical: 10,
  },
  mv20: {
    marginVertical: 20,
  },
  mh10: {
    marginHorizontal: 10,
  },
  mh20: {
    marginHorizontal: 20,
  },
  ml5: {
    marginLeft: 5,
  },
  ml10: {
    marginLeft: 10,
  },
  ml15: {
    marginLeft: 15,
  },
  ml20: {
    marginLeft: 20,
  },
  ml25: {
    marginLeft: 25,
  },
  ml35: {
    marginLeft: 35,
  },
  mt5: {
    marginTop: 5,
  },
  mt10: {
    marginTop: 10,
  },
  mt15: {
    marginTop: 15,
  },
  mt20: {
    marginTop: 20,
  },
  mb80: {
    marginBottom: 80,
  },
  mb10: {
    marginBottom: 10,
  },
  mb15: {
    marginBottom: 15,
  },
  mb20: {
    marginBottom: 20,
  },
  mb25: {
    marginBottom: 25,
  },
  mr5: {
    marginRight: 5,
  },
  mr10: {
    marginRight: 10,
  },
  mr20: {
    marginRight: 20,
  },
  mr40: {
    marginRight: 40,
  },

  // Font
  textBold: {
    fontWeight: 'bold',
  },
  textItalic: {
    fontStyle: 'italic',
  },
  fontSize12: {
    fontSize: 12,
  },
  fontSize14: {
    fontSize: 14,
  },
  fontSize15: {
    fontSize: 15,
  },
  fontSize16: {
    fontSize: 16,
  },
  fontSize18: {
    fontSize: 18,
  },
  fontSize20: {
    fontSize: 20,
  },

  border: {
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
  },

  rounded: {
    borderRadius: 5,
  },

  textPrimary: {
    color: COLORS.primaryColor,
  },
  textError: {
    color: COLORS.dangerColor,
    fontSize: 12,
  },
});

export default styles;
