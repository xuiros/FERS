import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import axios from 'axios';

const GOOGLE_MAPS_API_KEY = 'AIzaSyAewGBNCpKLAvx26uAyvkG2Fb5-9AALudE'; // ✅ Your real API key

const ResponderDashboard = ({ route, navigation }) => {
  const { user } = route.params;
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentLocation();
    fetchReports();
  }, []);

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required.');
      return;
    }

    let loc = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });
    setLoading(false);
  };

  const fetchReports = async () => {
    try {
      const res = await axios.get('http://10.53.52.120:5000/api/reports');
      setReports(res.data);
    } catch (error) {
      console.error('❌ Error fetching reports:', error);
      Alert.alert('Error', 'Unable to load reports');
    }
  };

  const handleRespond = (report) => {
    if (
      !report.location ||
      !report.location.latitude ||
      !report.location.longitude
    ) {
      Alert.alert('Invalid Report', 'This report has no valid coordinates.');
      return;
    }

    setSelectedReport(report);
    Alert.alert('Responding', `Navigating to ${report.type} from ${report.name}`);
  };

  if (loading || !location) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6600" />
        <Text>Fetching location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>👨‍🚒 Responder Dashboard</Text>
      <Text style={styles.subheader}>Welcome, {user.fullName || 'Responder'}</Text>

      {selectedReport ? (
        <>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            {/* Your location */}
            <Marker
              coordinate={location}
              title="Your Location"
              pinColor="blue"
            />

            {/* Report location */}
            <Marker
              coordinate={{
                latitude: Number(selectedReport.location.latitude),
                longitude: Number(selectedReport.location.longitude),
              }}
              title={`${selectedReport.type} - Reported by ${selectedReport.name}`}
              description={selectedReport.address || 'Unknown address'}
              pinColor="red"
            />

            {/* Route */}
            <MapViewDirections
              origin={location}
              destination={{
                latitude: Number(selectedReport.location.latitude),
                longitude: Number(selectedReport.location.longitude),
              }}
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={4}
              strokeColor="orange"
            />
          </MapView>

          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => setSelectedReport(null)}
          >
            <Text style={styles.btnText}>← Back to Reports</Text>
          </TouchableOpacity>
        </>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>{item.type}</Text>
              <Text>🙋 Citizen: {item.name || 'Unknown'}</Text>
              <Text>📍 Address: {item.address || 'Unknown'}</Text>
              <Text>
                🌍 Coordinates:{' '}
                {item.location
                  ? `${item.location.latitude}, ${item.location.longitude}`
                  : 'N/A'}
              </Text>
              <Text>🕒 Reported: {new Date(item.createdAt).toLocaleString()}</Text>
              <TouchableOpacity
                style={styles.respondBtn}
                onPress={() => handleRespond(item)}
              >
                <Text style={styles.btnText}>Respond</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', color: '#888', marginTop: 40 }}>
              No active emergencies found
            </Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6600',
  },
  subheader: {
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
  },
  map: {
    flex: 1,
    borderRadius: 12,
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6600',
    marginBottom: 4,
  },
  respondBtn: {
    backgroundColor: '#FF6600',
    padding: 10,
    marginTop: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ResponderDashboard;
 