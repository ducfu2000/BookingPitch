import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Pressable,
  Alert,
} from 'react-native';
import React, {useState, useContext} from 'react';
import CustomInput from '../../../components/common/CustomInput/CustomInput';
import CustomButton from '../../../components/common/CustomButton/CustomButton';
import AuthContext from '../../../context/AuthContext';
import baseStyles from '../../../constants/baseCss';
import {COLORS, SIZES} from '../../../constants/theme';
import Feather from 'react-native-vector-icons/Feather';
import styles from './styles';
const AddTeam = ({navigation}) => {
  const {userToken, host} = useContext(AuthContext);
  const [teamName, setTeamName] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);

  const [listPhoneNumbers, setListPhoneNumbers] = useState([]);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(null);

  const getUserInfo = _phone => {
    fetch(`${host}/api/tenant/team/user/info?phone=${_phone}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Token ' + userToken,
      },
    })
      .then(res => res.json())
      .then(resJson => {
        if (resJson.message == undefined) {
          setUser(resJson.user);
          setPhoneNumber(resJson.user.phone);
          setIsAdmin(false);
        } else if (
          resJson.message == 'Quyền hạn của người dùng này không phù hợp'
        ) {
          setIsAdmin(true);
          Alert.alert('Lưu ý', resJson.message + '', [
            {
              text: 'Đóng',
              style: 'cancel',
            },
          ]);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const addTeamMember = () => {
    setUsers(old => [...old, user]);
    setListPhoneNumbers(old => [...old, user.phone]);
    setUser(null);
    setPhoneNumber('');
  };

  const onAddTeamPress = () => {
    console.log('listPhoneNumbers :>> ', listPhoneNumbers);
    if (teamName && listPhoneNumbers) {
      fetch(`${host}/api/tenant/team/add`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Token ' + userToken,
        },
        body: JSON.stringify({
          tid: null,
          name: teamName,
          phones: listPhoneNumbers,
        }),
      })
        .then(res => res.json())
        .then(resJson => {
          console.log(resJson.message);
          if (resJson.message == 'success') {
            Alert.alert('Tạo đội', 'Tạo đội thành công', [
              {
                text: 'Đóng',
                onPress: () => navigation.navigate('MyTeam'),
                style: 'cancel',
              },
            ]);
          } else {
            Alert.alert('Tạo đội', resJson.message, [
              {
                text: 'Đóng',
                onPress: () => navigation.navigate('MyTeam'),
                style: 'cancel',
              },
            ]);
          }
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      alertMessage('Thông báo', 'Vui lòng điền đầy đủ thông tin', 'Đóng');
    }
  };

  const alertMessage = (title, message, cancelBtn) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: cancelBtn,
          style: 'cancel',
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  return (
    <SafeAreaView
      keyboardShouldPersistTaps="always"
      style={[baseStyles.root, {position: 'relative'}]}
    >
      <CustomInput
        label="Tên đội"
        placeholder="Nhập tên đội của bạn"
        value={teamName}
        setValue={setTeamName}
      />
      <View style={baseStyles.row}>
        <CustomInput
          label="Số điện thoại"
          placeholder="Nhập số điện thoại các thành viên"
          value={phoneNumber}
          setValue={text => {
            setPhoneNumber(text);
            if (text.split('').length == 10) {
              getUserInfo(text);
            }
          }}
          keyboardType="number-pad"
        />
        <Pressable
          onPress={() => {
            setPhoneNumber('');
            setUser(null);
          }}
        >
          <Feather name="x" size={24} style={styles.icon} />
        </Pressable>
      </View>
      {user && (
        <Pressable
          onPress={() => addTeamMember()}
          style={[baseStyles.left, styles.userInfo]}
        >
          <Text>{user.name + ' - ' + user.phone}</Text>
          <Feather name="user-plus" size={20} />
        </Pressable>
      )}
      <View style={[baseStyles.left, baseStyles.w100]}>
        <FlatList
          data={users}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => {
            return (
              <View style={[baseStyles.left, baseStyles.w100, styles.userInfo]}>
                <Text>{item.name + ' - ' + item.phone}</Text>
              </View>
            );
          }}
        />
      </View>

      <View style={styles.btnBottom}>
        <CustomButton text="Tạo đội" type="PRIMARY" onPress={onAddTeamPress} />
      </View>
    </SafeAreaView>
  );
};

export default AddTeam;
