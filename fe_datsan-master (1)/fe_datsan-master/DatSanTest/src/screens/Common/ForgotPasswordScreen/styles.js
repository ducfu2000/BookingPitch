import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';

const styles = StyleSheet.create({
  contentContainer: {flex: 1},
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    paddingVertical: 44,
  },
  textLeft: {
    fontSize: 16,
    position: 'absolute',
    right: 20,
    top: 15,
    color: COLORS.grayColor,
  },
});

export default styles;
