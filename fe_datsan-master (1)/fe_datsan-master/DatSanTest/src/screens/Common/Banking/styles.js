import {StyleSheet} from 'react-native';
import {COLORS, SIZES} from '../../../constants';

const styles = StyleSheet.create({
  bankItem: {
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
});
export default styles;
