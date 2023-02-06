import {StyleSheet} from 'react-native';
import {COLORS, SIZES} from '../../../constants';

const styles = StyleSheet.create({
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    padding: 0,
    backgroundColor: '#FFFFFF',
  },
  iconLeft: {
    padding: 10,
    position: 'absolute',
    top: 10,
    left: 0,
  },
  iconRight: {
    padding: 20,
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
  },
  cover: {backgroundColor: COLORS.overlayColor, zIndex: 9},
  settingContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 300,
    padding: 15,
    minHeight: 100,
    backgroundColor: 'white',
    zIndex: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  userName: {
    color: COLORS.whiteColor,
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  accountInfoContainer: {
    padding: 15,
    width: '100%',
    backgroundColor: COLORS.whiteColor,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  addressModal: {
    position: 'absolute',
    bottom: 30,
    padding: 15,
    width: '90%',
    alignItems: 'center',
    backgroundColor: '#E8F9FD',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    zIndex: 20,
  },
  profileList: {
    marginTop: 20,
    padding: 10,
    backgroundColor: COLORS.whiteColor,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  profileItem: {
    padding: 15,
    backgroundColor: COLORS.whiteColor,
  },
  bookingType: {
    width: SIZES.width,
    backgroundColor: COLORS.whiteColor,
    padding: 15,
    marginTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
  },
  signOut: {
    position: 'absolute',
    bottom: 20,
  },
});
export default styles;
