import {StyleSheet} from 'react-native';
import {COLORS, SIZES} from '../../../constants';

const styles = StyleSheet.create({
  teamItem: {
    width: SIZES.width - 44,
    marginHorizontal: 2,
    borderRadius: 10,
    marginVertical: 7,
    backgroundColor: COLORS.whiteColor,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  icon: {
    padding: 12,
    position: 'absolute',
    top: 25,
    right: 5,
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.lightYellowColor,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  btnBottom: {
    width: '100%',
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
  },
  btnClose: {
    position: 'absolute',
    padding: 10,
    top: 5,
    right: 5,
  },
  cover: {backgroundColor: COLORS.overlayColor, zIndex: 9},
  addMemberModal: {
    width: SIZES.width,
    marginBottom: -20,
    padding: 20,
    minHeight: 300,
    zIndex: 10,
    bottom: 0,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: COLORS.whiteColor,
  },
});
export default styles;
