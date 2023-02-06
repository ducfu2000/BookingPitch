import {StyleSheet} from 'react-native';
import {COLORS, SIZES} from '../../../constants';

const styles = StyleSheet.create({
  hindText: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: COLORS.borderColor,
    marginTop: 10,
  },
  revenueItem: {
    marginRight: 25,
    borderRadius: 10,
    borderColor: COLORS.borderColor,
    borderWidth: 1,
  },
  turnoverContainer: {
    width: '100%',
    height: 130,
    padding: 10,
    backgroundColor: COLORS.whiteColor,
    borderWidth: 1,
    borderColor: COLORS.lightGrayColor,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  turnoverImage: {
    width: 50,
    height: 50,
  },
  bookingContainer: {
    width: '100%',
    padding: 10,
    marginVertical: 20,

    backgroundColor: COLORS.whiteColor,
    borderWidth: 1,
    borderColor: COLORS.lightGrayColor,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  viewAllBookingsStyle: {
    padding: 5,
    borderRadius: 30,
    backgroundColor: COLORS.primaryColor,
  },
  viewAllBookingsTextStyle: {
    paddingLeft: 10,
    color: COLORS.primaryColor,
    fontWeight: 'bold',
    fontSize: 16,
  },
  viewAllBookingsIconStyle: {
    backgroundColor: COLORS.whiteColor,
    borderRadius: 50,
    fontSize: 25,
    color: COLORS.primaryColor,
  },
});
export default styles;
