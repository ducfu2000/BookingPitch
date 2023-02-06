import {
  Text,
  View,
  SafeAreaView,
  FlatList,
  Alert,
  Image,
  Pressable,
} from 'react-native';
import React, {useState, useEffect, useContext, useRef} from 'react';
import AuthContext from '../../../context/AuthContext';
import baseStyles from '../../../constants/baseCss';
import styles from './styles';
import {COLORS, SIZES} from '../../../constants/theme';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {FloatingAction} from 'react-native-floating-action';
const MyTeam = ({navigation}) => {
  const {userToken, host} = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [teams, setTeams] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getTeams();
    });
    return unsubscribe;
  });

  const getTeams = () => {
    setIsLoading(true);
    fetch(`${host}/api/tenant/team/all`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Token ' + userToken,
      },
    })
      .then(res => res.json())
      .then(resJson => {
        console.log(resJson.teams);
        if (resJson.teams) {
          setTeams(resJson.teams);
        }
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const actions = [
    {
      text: 'Thêm team',
      icon: (
        <Ionicons
          name="ios-add"
          style={{color: COLORS.primaryColor, fontSize: 30}}
        />
      ),
      name: 'bt_add_team',
      position: 2,
      color: COLORS.whiteColor,
      margin: 6,
    },
  ];

  const onFloatingActionPress = name => {
    switch (name) {
      case 'bt_add_team':
        navigation.navigate('AddTeam');
        break;
      case 'bt_edit_ps':
        break;
      case 'bt_remove_ps':
        break;
    }
  };
  return (
    <SafeAreaView style={baseStyles.root}>
      {!teams || teams.length == 0 ? (
        <Text style={[baseStyles.fontSize16]}>Hiện tại chưa có đội nào</Text>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          style={baseStyles.w100}
          data={teams}
          renderItem={({item}) => {
            return (
              <Pressable
                onPress={() =>
                  navigation.navigate('TeamDetail', {teamId: item.id})
                }
                style={[
                  styles.teamItem,
                  baseStyles.row,
                  baseStyles.centerVertically,
                ]}
              >
                <Image
                  source={require('../../../assets/images/team.png')}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 50,
                    marginRight: 20,
                  }}
                />
                <Text style={[baseStyles.fontSize16, baseStyles.textBold]}>
                  {item.name}
                </Text>
              </Pressable>
            );
          }}
        />
      )}
      <FloatingAction
        position={'right'}
        color={COLORS.primaryColor}
        actions={actions}
        onPressItem={name => {
          onFloatingActionPress(name);
        }}
        shadow={{
          shadowOpacity: 0.35,
          shadowOffset: {width: 0, height: 5},
          shadowColor: '#000000',
          shadowRadius: 3,
        }}
        overlayColor={COLORS.overlayColor}
        buttonSize={50}
        iconWidth={20}
        iconHeight={20}
        distanceToEdge={20}
      />
    </SafeAreaView>
  );
};

export default MyTeam;
