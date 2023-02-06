import {StyleSheet} from 'react-native';
import {COLORS, SIZES} from '../../../constants';

const styles = StyleSheet.create({
  textInput: {
    position: 'absolute',
    top: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    width: 200,
    zIndex: 5,
    backgroundColor: COLORS.whiteColor,
  },
});
export default styles;
