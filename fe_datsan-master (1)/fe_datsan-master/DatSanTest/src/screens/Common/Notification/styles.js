import {StyleSheet} from 'react-native';
import {COLORS, SIZES} from '../../../constants';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.whiteColor,
  },
  notificationItem: {
    width: '100%',
    paddingHorizontal: 20,
    position: 'relative',
  },
  isRead: {
    position: 'absolute',
    top: 0,
    right: 0,
    color: '#2192FF',
  },
});
export default styles;
