import {StyleSheet} from 'react-native';
import {COLORS, SIZES} from '../../../constants';

const styles = StyleSheet.create({
  btnContainer: {
    width: '45%',
    paddingVertical: 15,
    marginVertical: 5,
    backgroundColor: COLORS.editColor,
    alignItems: 'center',
    borderRadius: 5,
  },
  textContainer: {fontWeight: 'bold', color: COLORS.whiteColor},
  checkbox: {
    backgroundColor: 'white',
  },
  icon: {
    fontSize: 40,
    color: COLORS.primaryColor,
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderRadius: 15,
  },
  pSTitle: {
    fontSize: 16,
    color: COLORS.blackColor,
  },
  pSImage: {
    width: 70,
    height: 50,
    borderRadius: 5,
  },
  itemRight: {
    position: 'absolute',
    right: 0,
  },
  itemIcon: {
    fontSize: 25,
    color: COLORS.editColor,
    marginLeft: '30%',
  },
  border: {
    width: '80%',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrayColor,
  },

  facility: {flexDirection: 'row', marginRight: 10, marginTop: 5},
  facilityText: {marginLeft: 2, color: COLORS.grey},
  timeInput: {
    backgroundColor: COLORS.whiteColor,
    borderRadius: 5,
    borderColor: COLORS.borderColor,
  },
});
export default styles;
