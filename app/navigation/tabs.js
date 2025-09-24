import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import CallScreen from '../screens/CallScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';

const EmptyScreen = () => null;

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      top: -30,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 35,
      backgroundColor: '#D94701',
      width: 70,
      height: 70,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 5,
    }}
  >
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {children}
    </View>
  </TouchableOpacity>
);

const Tabs = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const emergencyDetails = {
    Fire: [
      { level: 'First Alarm', desc: 'Fire affecting ~2-3 houses' },
      { level: 'Second Alarm', desc: 'Fire in ~4-5 houses' },
      { level: 'Third Alarm', desc: 'Fire in ~6-7 houses or part of high-rise building' },
      { level: 'Fourth Alarm', desc: 'Fire in ~8-9 houses or larger high-rise portion' },
      { level: 'Fifth Alarm', desc: 'Fire in ~10-11 houses or large high-rise' },
    ],
    Flood: [
      { level: 'Minor Flood', desc: 'Localized flooding in low areas' },
      { level: 'Moderate Flood', desc: 'Flooding in several barangays' },
      { level: 'Severe Flood', desc: 'Widespread flooding across the city' },
    ],
    Earthquake: [
      { level: 'Mild Tremor', desc: 'Slight shaking, no major damage' },
      { level: 'Moderate Quake', desc: 'Noticeable shaking, possible light damage' },
      { level: 'Strong Quake', desc: 'Severe shaking, structural damage possible' },
    ],
    Accident: [
      { level: 'Road Accident', desc: 'Collision or crash on the road' },
      { level: 'Workplace Accident', desc: 'Injury at work site or office' },
      { level: 'Other Accident', desc: 'Miscellaneous accident needing assistance' },
    ],
    Landslide: [
      { level: 'Minor Landslide', desc: 'Small soil movement, limited damage' },
      { level: 'Moderate Landslide', desc: 'Covers roads or nearby houses, moderate risk' },
      { level: 'Severe Landslide', desc: 'Large-scale, multiple houses/roads affected' },
    ],
  };

  const handleEmergencySelect = (type) => {
    setSelectedEmergency(type);
    setModalVisible(false);
    setDetailModalVisible(true);
  };

  const handleDetailSelect = (detail) => {
    setSelectedDetail(detail);
    setDetailModalVisible(false);
    setConfirmModalVisible(true);
  };

  const handleConfirm = () => {
    console.log(`Confirmed: ${selectedEmergency} - ${selectedDetail.level}`);
    setConfirmModalVisible(false);
  };

  return (
    <>
      {/* Bottom Tabs */}
      <Tab.Navigator
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            left: 20,
            right: 20,
            elevation: 0,
            backgroundColor: '#ffffff',
            borderRadius: 15,
            height: 90,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          // Inject a prop so HomeScreen can open the emergency modal
          children={(props) => (
            <HomeScreen
              {...props}
              openEmergencyModal={() => setModalVisible(true)}
            />
          )}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: 'center', justifyContent: 'center', top: 10 }}>
                <Image
                  source={require('../assets/icons/home.png')}
                  resizeMode="contain"
                  style={{
                    width: 35,
                    height: 35,
                    tintColor: focused ? '#11224D' : '#999999',
                  }}
                />
                <Text style={{ color: focused ? '#11224D' : '#999999', fontSize: 10, fontWeight: 'bold' }}>
                  HOME
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: 'center', justifyContent: 'center', top: 10 }}>
                <Image
                  source={require('../assets/icons/chat.png')}
                  resizeMode="contain"
                  style={{
                    width: 35,
                    height: 35,
                    tintColor: focused ? '#11224D' : '#999999',
                  }}
                />
                <Text style={{ color: focused ? '#11224D' : '#999999', fontSize: 10, fontWeight: 'bold' }}>
                  CHAT
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Emergency"
          component={EmptyScreen}
          options={{
            tabBarIcon: () => (
              <Image source={require('../assets/icons/emergency.png')} resizeMode="contain" style={{ width: 40, height: 40, tintColor: '#fff' }} />
            ),
            tabBarButton: (props) => <CustomTabBarButton {...props} onPress={() => setModalVisible(true)} />,
          }}
        />
        <Tab.Screen
          name="Call"
          component={CallScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: 'center', justifyContent: 'center', top: 10 }}>
                <Image
                  source={require('../assets/icons/call.png')}
                  resizeMode="contain"
                  style={{
                    width: 35,
                    height: 35,
                    tintColor: focused ? '#11224D' : '#999999',
                  }}
                />
                <Text style={{ color: focused ? '#11224D' : '#999999', fontSize: 10, fontWeight: 'bold' }}>
                  CALL
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: 'center', justifyContent: 'center', top: 10 }}>
                <Image
                  source={require('../assets/icons/user.png')}
                  resizeMode="contain"
                  style={{
                    width: 35,
                    height: 35,
                    tintColor: focused ? '#11224D' : '#999999',
                  }}
                />
                <Text style={{ color: focused ? '#11224D' : '#999999', fontSize: 10, fontWeight: 'bold' }}>
                  ME
                </Text>
              </View>
            ),
          }}
        />
      </Tab.Navigator>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Select Emergency</Text>
            {Object.keys(emergencyDetails).map((type) => (
              <TouchableOpacity key={type} style={styles.modalButton} onPress={() => handleEmergencySelect(type)}>
                <Text style={styles.modalButtonText}>{type}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#ccc' }]} onPress={() => setModalVisible(false)}>
              <Text style={[styles.modalButtonText, { color: '#333' }]}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Detail Modal */}
      <Modal visible={detailModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{selectedEmergency} Details</Text>
            {selectedEmergency &&
              emergencyDetails[selectedEmergency].map((item) => (
                <TouchableOpacity key={item.level} style={styles.modalButton} onPress={() => handleDetailSelect(item)}>
                  <Text style={styles.modalButtonText}>{item.level}</Text>
                  <Text style={{ fontSize: 12, color: '#333', textAlign: 'center' }}>{item.desc}</Text>
                </TouchableOpacity>
              ))}
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#ccc' }]}
              onPress={() => {
                setDetailModalVisible(false);
                setModalVisible(true);
              }}
            >
              <Text style={[styles.modalButtonText, { color: '#333' }]}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Confirmation Modal */}
      <Modal visible={confirmModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Confirm Selection</Text>
            <Text style={{ textAlign: 'center', marginBottom: 15 }}>
              You selected: {selectedEmergency} - {selectedDetail?.level}
            </Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleConfirm}>
              <Text style={styles.modalButtonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#ccc' }]}
              onPress={() => {
                setConfirmModalVisible(false);
                setDetailModalVisible(true);
              }}
            >
              <Text style={[styles.modalButtonText, { color: '#333' }]}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: 320,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#11224D',
  },
  modalButton: {
    backgroundColor: '#FF8811',
    paddingVertical: 12,
    borderRadius: 10,
    marginVertical: 6,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Tabs;
