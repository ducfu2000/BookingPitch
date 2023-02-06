import {StyleSheet} from 'react-native';
import {COLORS, SIZES} from '../../../constants';

const styles = StyleSheet.create({
  container: {
    width: SIZES.width,
    height: SIZES.height,
  },
  footerBtn: {
    position: 'absolute',
    right: 20,
  },
  icon: {
    fontSize: 40,
    color: COLORS.primaryColor,
  },
  pSTitle: {
    fontSize: 16,
    color: COLORS.blackColor,
  },
  pSImage: {
    width: 70,
    height: 50,
    borderRadius: 5,
  },
  itemIcon: {
    fontSize: 25,
  },
  borderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  border: {
    width: '80%',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrayColor,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(69,85,117,0.7)',
  },

  itemRight: {
    marginTop: 4,
    position: 'absolute',
    right: 0,
  },
  ratingItem: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
});
export default styles;
