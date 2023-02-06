import {StyleSheet} from 'react-native';
import {COLORS, SIZES} from '../../../constants';
const styles = StyleSheet.create({
  contentContainer: {flex: 1, minWidth: SIZES.width, minHeight: SIZES.height},
  logo: {
    width: '60%',
    maxWidth: 500,
    maxHeight: 280,
    marginVertical: 20,
  },
  icon: {
    padding: 14,
    fontSize: 20,
    position: 'absolute',
    right: 0,
    top: 5,
    color: COLORS.grayColor,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
  },
  left: {
    alignItems: 'flex-start',
  },
  pt5: {
    paddingTop: 5,
  },
  bottom: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default styles;
