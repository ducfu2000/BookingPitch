import {StyleSheet, Text, View, FlatList, SafeAreaView} from 'react-native';
import React from 'react';
import baseStyles from '../../../constants/baseCss';
import styles from './styles';
import {Rating, RatingInput} from 'react-native-stock-star-rating';
const RatingList = ({route}) => {
  const {ratingList} = route.params;
  return (
    <SafeAreaView style={baseStyles.root}>
      <FlatList
        showsVerticalScrollIndicator={false}
        style={baseStyles.w100}
        data={ratingList}
        renderItem={({item}) => (
          <View style={styles.ratingItem}>
            <View>
              <Text style={[baseStyles.fontSize16]}>{item.user}</Text>
              <Text>Nội dung: {item.content}</Text>
            </View>
            <View>
              <Text>
                {new Date(item.updatedAt).toLocaleDateString('vi-VN')}
              </Text>
              <Rating maxStars={5} size={18} stars={item.rate} />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default RatingList;
