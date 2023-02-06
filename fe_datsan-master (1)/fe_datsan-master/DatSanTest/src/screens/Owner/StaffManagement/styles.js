import {StyleSheet} from 'react-native';
import {COLORS, SIZES} from '../../../constants';

const styles = StyleSheet.create({
  staffItem: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#EDFDEA',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  cover: {backgroundColor: COLORS.overlayColor, zIndex: 9},
  modalContainer: {
    padding: 15,
    width: '100%',
    backgroundColor: COLORS.whiteColor,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  icon: {
    marginTop: 5,
    marginRight: 5,
  },
  textInput: {
    width: '80%',
    borderBottomWidth: 1,
    borderColor: COLORS.borderColor,
  },
  userName: {
    position: 'absolute',
    top: 5,
    right: 20,
    marginBottom: 10,
    padding: 8,
    backgroundColor: COLORS.beigeColor,
    borderRadius: 10,
  },
});
export default styles;
