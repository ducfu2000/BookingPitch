import {StyleSheet} from 'react-native';
import {COLORS, SIZES} from '../../../constants';

const styles = StyleSheet.create({
  bookingContainer: {
    width: '100%',
    height: '95%',
    flex: 1,
    padding: 10,
    marginTop: 20,
    marginBottom: 20,
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
  itemType: {
    borderColor: COLORS.borderColor,
    paddingBottom: 5,
  },
  textDate: {
    backgroundColor: COLORS.whiteColor,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: COLORS.lightGrayColor,
  },
  selectedItem: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primaryColor,
  },
  activityIndicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    width: '100%',
    minHeight: SIZES.height - 50,
    backgroundColor: COLORS.whiteColor,
  },
  btn: {position: 'absolute', bottom: 0},
  status: {
    color: COLORS.whiteColor,
    padding: 6,
    borderRadius: 20,
  },
  icon: {
    padding: 12,
    position: 'absolute',
    top: 25,
    right: 5,
  },
  selectedDate: {
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: 5,
  },
  timeInput: {
    color: COLORS.blackColor,
    padding: 10,
    backgroundColor: COLORS.whiteColor,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },

  cover: {backgroundColor: COLORS.overlayColor, zIndex: 9},
  reason: {
    padding: 20,
    alignItems: 'center',
    width: SIZES.width,
    backgroundColor: COLORS.whiteColor,
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 10,
  },
});
export default styles;
