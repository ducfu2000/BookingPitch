import React, {Component} from 'react';
import {StyleSheet, Image, View} from 'react-native';

export default class Splash extends Component {
  constructor(props) {
    super(props);
    this.state = {timer: 0};

    setInterval(() => {
      this.setState({timer: this.state.timer + 1});
    }, 1000);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logo}>
          <Image
            source={require('../assets/images/datsan.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
  },
  logo: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  image: {
    width: '70%',
    maxWidth: 500,
    maxHeight: 280,
    marginVertical: 10,
  },
});
