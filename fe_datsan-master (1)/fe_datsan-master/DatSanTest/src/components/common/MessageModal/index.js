import {StyleSheet, Text, View, Modal, Pressable} from 'react-native';
import React, {useState} from 'react';
import baseStyles from '../../../constants/baseCss';
import {COLORS} from '../../../constants/theme';
const MessageModal = ({
  isModalVisible,
  title,
  message,
  confirmButtonText,
  closeButtonText,
  ...props
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {title && <Text style={styles.modalTitle}>{title}</Text>}
            {message && <Text style={styles.modalText}>{message}</Text>}

            <View style={baseStyles.row}>
              {confirmButtonText && (
                <Pressable
                  style={[styles.button, styles.buttonDelete]}
                  {...props}>
                  <Text style={styles.textStyle}>{confirmButtonText}</Text>
                </Pressable>
              )}
              {closeButtonText && (
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={styles.textStyle}>Đóng</Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MessageModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
  },
  buttonDelete: {
    paddingHorizontal: 20,
    marginRight: 20,
    backgroundColor: COLORS.dangerColor,
  },
  buttonClose: {
    paddingHorizontal: 20,
    backgroundColor: COLORS.grayColor,
  },
  textStyle: {
    color: COLORS.whiteColor,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalTitle: {
    fontSize: 20,
    paddingVertical: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});
