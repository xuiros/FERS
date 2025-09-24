import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation, useRoute } from '@react-navigation/native'; // ADD


const HomeScreen = () => {
  const [pressedCard, setPressedCard] = useState(null);
  const [activeSheet, setActiveSheet] = useState(null); 

  const [tutorialActive, setTutorialActive] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showTutorialConfirm, setShowTutorialConfirm] = useState(false);

  const navigation = useNavigation(); // ADD
  const route = useRoute();           // ADD

  // Open confirm modal when coming from Sign In
  useEffect(() => {
    if (route.params?.showTutorialConfirm) {
      setShowTutorialConfirm(true);
      navigation.setParams({ showTutorialConfirm: undefined }); // clear so it won’t re-trigger
    }
  }, [route.params?.showTutorialConfirm]);

  const tutorialSteps = [
    {
      highlight: 'fire',
      title: 'Fire Stations',
      body: 'Find nearby fire stations and their contact details.',
    },
    {
      highlight: 'tips',
      title: 'Safety Tips',
      body: 'Read prevention guides to reduce fire risks.',
    },
    {
      highlight: 'loc',
      title: 'My Location',
      body: 'View your live position on the map and re-center quickly.',
    },
    {
      highlight: 'report',
      title: 'Report Emergency',
      body: 'Use the center bell button to send an emergency report fast.',
    },
  ];

  const currentHighlight =
    tutorialActive ? tutorialSteps[tutorialStep].highlight : null;

  // Layout sizes
  const SCREEN_HEIGHT = Dimensions.get('window').height;
  const PANEL_HEIGHT = Math.round(SCREEN_HEIGHT * 0.4);
  const GAP_BETWEEN_ORANGES = 8;
  const SHEET_HEIGHT = SCREEN_HEIGHT - PANEL_HEIGHT - GAP_BETWEEN_ORANGES;

  // Sheet animation
  const sheetTranslateY = useRef(new Animated.Value(-SHEET_HEIGHT)).current;
  const animatingRef = useRef(false);

  const openSheet = (type) => {
    if (animatingRef.current || tutorialActive) return;
    if (activeSheet === type) return;
    const closed = activeSheet === null;
    setActiveSheet(type);
    if (closed) {
      animatingRef.current = true;
      sheetTranslateY.setValue(-SHEET_HEIGHT);
      Animated.timing(sheetTranslateY, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }).start(() => (animatingRef.current = false));
    }
  };

  const closeSheet = () => {
    if (animatingRef.current || activeSheet === null) return;
    animatingRef.current = true;
    Animated.timing(sheetTranslateY, {
      toValue: -SHEET_HEIGHT,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      animatingRef.current = false;
      setActiveSheet(null);
    });
  };

  const toggleSheet = (type) => {
    if (animatingRef.current || tutorialActive) return;
    if (activeSheet === type) closeSheet();
    else if (activeSheet === null) openSheet(type);
    else setActiveSheet(type);
  };

  const confirmStartTutorial = () => {
    setShowTutorialConfirm(true);
  };

  const startTutorial = () => {
    setShowTutorialConfirm(false);
    closeSheet();
    sheetTranslateY.setValue(-SHEET_HEIGHT);
    setTutorialStep(0);
    setTutorialActive(true);
  };

  const cancelTutorialPrompt = () => setShowTutorialConfirm(false);

  const nextStep = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep((s) => s + 1);
    } else {
      endTutorial();
    }
  };

  const endTutorial = () => {
    setTutorialActive(false);
    setTutorialStep(0);
  };

  const Card = ({id, title, description, onPressInAction}) => {
    const pressed = !tutorialActive && pressedCard === id;
    const isHighlighted = tutorialActive && currentHighlight === id;
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPressIn={() => {
          if (!tutorialActive) {
            setPressedCard(id);
            onPressInAction && onPressInAction();
          }
        }}
        onPressOut={() => setPressedCard(null)}
        style={[
          styles.card,
          styles.halfCard,
          pressed && styles.cardPressed,
          isHighlighted && styles.highlightCard,
        ]}
      >
        <Text style={[styles.cardTitle, pressed && styles.cardTitlePressed]}>
          {title}
        </Text>
        <Text
          style={[
            styles.cardDescription,
            pressed && styles.cardDescriptionPressed,
          ]}
        >
          {description}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderAuxHighlights = () => {
    if (!tutorialActive) return null;
    switch (currentHighlight) {
      case 'report':
        return <View style={styles.ringBell} pointerEvents="none" />;
      case 'chat':
        return <View style={[styles.navHighlight, styles.chatPos]} />;
      case 'call':
        return <View style={[styles.navHighlight, styles.callPos]} />;
      case 'me':
        return <View style={[styles.navHighlight, styles.mePos]} />;
      default:
        return null;
    }
  };

  const renderTooltip = () => {
    if (!tutorialActive) return null;
    const step = tutorialSteps[tutorialStep];
    return (
      <View style={styles.tooltipTopContainer} pointerEvents="box-none">
        <View style={styles.tooltipPanel}>
          <Text style={styles.tooltipTitle}>{step.title}</Text>
          <Text style={styles.tooltipBody}>{step.body}</Text>
          <View style={styles.tooltipActions}>
            <TouchableOpacity onPress={endTutorial} style={styles.skipBtn}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={nextStep} style={styles.nextBtn}>
              <Text style={styles.nextText}>
                {tutorialStep < tutorialSteps.length - 1 ? 'Next' : 'Done'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderTutorialConfirm = () => {
    if (!showTutorialConfirm) return null;
    return (
      <View style={styles.confirmOverlay}>
        <Pressable style={styles.confirmBackdrop} onPress={cancelTutorialPrompt} />
        <View style={styles.confirmCard}>
          <Text style={styles.confirmTitle}>Start Tutorial?</Text>
          <Text style={styles.confirmMsg}>
            Learn how to use reporting, navigation, and profile features.
          </Text>
          <View style={styles.confirmActions}>
            <TouchableOpacity style={styles.confirmCancel} onPress={cancelTutorialPrompt}>
              <Text style={styles.confirmCancelText}>Not Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmStart} onPress={startTutorial}>
              <Text style={styles.confirmStartText}>Start</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.bottomPanel, {height: PANEL_HEIGHT}]}>
        <View style={styles.row}>
          <Card
            id="fire"
            title="Fire Stations"
            description="(Click to view locations, contacts & emergency info)"
            onPressInAction={() => toggleSheet('stations')}
          />
          <Card
            id="tips"
            title="Safety Tips"
           
          />
        </View>
        <View style={styles.row}>
          <Card
            id="loc"
            title="My Location"
            description="(Click to view your current location)"
            onPressInAction={() => toggleSheet('location')}
          />
          <Card
            id="tutorial"
            title="Tutorial"
            description="(Click to begin the guided tour)"
            onPressInAction={confirmStartTutorial}
          />
        </View>
      </View>

      {activeSheet !== null && (
        <View style={[styles.sheetContainer, {height: SHEET_HEIGHT}]}>
          <Pressable style={styles.sheetBackdrop} onPress={closeSheet} />
          <Animated.View
            style={[
              styles.topSheet,
              {height: SHEET_HEIGHT, transform: [{translateY: sheetTranslateY}]},
            ]}
          >
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>
                {activeSheet === 'stations' ? 'Fire Stations' : 'My Location'}
              </Text>
            </View>
            {activeSheet === 'stations' ? <StationsList /> : <LocationView />}
          </Animated.View>
        </View>
      )}

      {renderAuxHighlights()}
      {renderTooltip()}
      {renderTutorialConfirm()}
    </View>
  );
};

const StationsList = () => (
  <ScrollView contentContainerStyle={styles.sheetBody}>
    <View style={styles.stationCard}>
      <Text style={styles.stationTitle}>Legazpi City Central...</Text>
      <Text style={styles.stationSub}>4QR5+HXP, Legazpi...</Text>
      <Text style={styles.stationSub}>Contact: 0917 185 9984</Text>
    </View>
    <View style={styles.placeholder} />
    <View style={styles.placeholder} />
    <View style={styles.placeholder} />
    <View style={styles.placeholder} />
  </ScrollView>
);

const LocationView = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);

  useEffect(() => {
    let sub;
    (async () => {
      const {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLoading(false);
        return;
      }
      sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000,
          distanceInterval: 1,
        },
        (loc) => {
          setLocation(loc.coords);
          setLoading(false);
        }
      );
    })();
    return () => { if (sub) sub.remove(); };
  }, []);

  const recenter = () => {
    if (location && mapRef.current) {
      mapRef.current.animateCamera({
        center: {latitude: location.latitude, longitude: location.longitude},
        pitch: 0,
        heading: 0,
        zoom: 16,
      });
    }
  };

  if (loading) {
    return (
      <View style={[styles.sheetBody, styles.center]}>
        <ActivityIndicator size="large" color="orange" />
      </View>
    );
  }

  return (
    <View style={styles.locationContainer}>
      {location && (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation
            showsMyLocationButton={false}
            showsCompass={false}
            toolbarEnabled={false}
          >
            <Marker
              coordinate={{latitude: location.latitude, longitude: location.longitude}}
              title="You are here"
            />
          </MapView>

          <TouchableOpacity style={styles.locateButton} onPress={recenter}>
            <Text style={styles.buttonText}>📍</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={recenter}>
            <Text style={styles.buttonText}>Center</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const ORANGE = '#F37E23';
const BG = '#FEEDDE';
const NAVY = '#0E2745';
const PRESSED_BG = '#11224D';
const HIGHLIGHT = '#11224D'; 

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: BG, justifyContent: 'flex-end'},

  bottomPanel: {
    backgroundColor: ORANGE,
    width: '100%',
    alignSelf: 'stretch',
    padding: 14,
    marginBottom: 0,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 12,
  },

  row: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12},

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 6,
  },

  cardPressed: {backgroundColor: PRESSED_BG},
  halfCard: {width: '48%'},
  cardTitle: {color: NAVY, fontSize: 20, fontWeight: '800', marginBottom: 6},
  cardTitlePressed: {color: '#FFF'},
  cardDescription: {color: NAVY, fontSize: 12, lineHeight: 16},
  cardDescriptionPressed: {color: 'rgba(255,255,255,0.9)'},

  highlightCard: {
    borderWidth: 3,
    borderColor: HIGHLIGHT,
    shadowColor: HIGHLIGHT,
    shadowOpacity: 0.35,
    shadowOffset: {width: 0, height: 6},
    shadowRadius: 10,
    elevation: 6,
  },

  sheetContainer: {position: 'absolute', top: 0, left: 0, right: 0},
  sheetBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'transparent' },
  topSheet: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    backgroundColor: ORANGE,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 0,
  },
  sheetHeader: {
    height: 64,
    paddingTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  sheetTitle: {color: '#fff', fontSize: 22, fontWeight: '800'},
  sheetBody: {padding: 12},
  stationCard: {
    backgroundColor: '#FFA45A',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  stationTitle: {color: '#fff', fontWeight: '800', fontSize: 16, marginBottom: 4},
  stationSub: {color: '#fff', fontSize: 12},
  placeholder: {
    height: 90, backgroundColor: '#F6994F', marginBottom: 10, borderRadius: 8, opacity: 0.9,
  },

  locationContainer: {flex: 1, backgroundColor: '#fff'},
  map: {flex: 1},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  button: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    backgroundColor: 'orange',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 5,
  },
  locateButton: {
    position: 'absolute',
    right: 20,
    bottom: 160,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 30,
    elevation: 5,
  },
  buttonText: {color: 'black', fontWeight: 'bold', fontSize: 16},

  tooltipTopContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-start',
    paddingTop: 90,
  },
  tooltipPanel: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: HIGHLIGHT,
  },
  tooltipTitle: {fontSize: 18, fontWeight: '800', color: NAVY, marginBottom: 6},
  tooltipBody: {fontSize: 14, color: NAVY},
  tooltipActions: {flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12},
  skipBtn: {paddingVertical: 8, paddingHorizontal: 12, marginRight: 10},
  skipText: {color: '#666', fontWeight: '600'},
  nextBtn: {
    backgroundColor: ORANGE,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  nextText: {color: '#fff', fontWeight: '800'},

  ringBell: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 48,          
    width: 75,           
    height: 75,
    borderRadius: 41,
    borderWidth: 3,
    borderColor: HIGHLIGHT,
    backgroundColor: 'transparent',
    marginLeft: -10
  },

  navHighlight: {
    position: 'absolute',
    bottom: 20,
    width: 58,
    height: 50,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: HIGHLIGHT,
  },
  chatPos: {left: '28%'},
  callPos: {left: '58%'},
  mePos: {right: 16},

  confirmOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  confirmCard: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: HIGHLIGHT,
  },
  confirmTitle: {fontSize: 20, fontWeight: '800', color: NAVY, marginBottom: 8},
  confirmMsg: {fontSize: 14, color: NAVY, marginBottom: 16},
  confirmActions: {flexDirection: 'row', justifyContent: 'flex-end'},
  confirmCancel: {paddingVertical: 10, paddingHorizontal: 16, marginRight: 10},
  confirmCancelText: {color: '#666', fontWeight: '600'},
  confirmStart: {
    backgroundColor: ORANGE,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  confirmStartText: {color: '#fff', fontWeight: '800'},
});

export default HomeScreen;