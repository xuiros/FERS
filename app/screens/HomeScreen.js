import React, { useState, useRef, useEffect } from "react";
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
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useNavigation, useRoute } from "@react-navigation/native";

const HomeScreen = () => {
  const [pressedCard, setPressedCard] = useState(null);
  const [activeSheet, setActiveSheet] = useState(null);
  const [tutorialActive, setTutorialActive] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showTutorialConfirm, setShowTutorialConfirm] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    if (route.params?.showTutorialConfirm) {
      setShowTutorialConfirm(true);
      navigation.setParams({ showTutorialConfirm: undefined });
    }
  }, [route.params?.showTutorialConfirm]);

  const tutorialSteps = [
    {
      highlight: "fire",
      title: "Fire Stations",
      body: "Find nearby fire stations and their contact details.",
    },
    {
      highlight: "tips",
      title: "Safety Tips",
      body: "Read prevention guides to reduce fire risks.",
    },
    {
      highlight: "loc",
      title: "My Location",
      body: "View your live position on the map and re-center quickly.",
    },
    {
      highlight: "report",
      title: "Report Emergency",
      body: "Use the center bell button to send an emergency report fast.",
    },
  ];

  const currentHighlight =
    tutorialActive ? tutorialSteps[tutorialStep].highlight : null;

  const SCREEN_HEIGHT = Dimensions.get("window").height;
  const PANEL_HEIGHT = Math.round(SCREEN_HEIGHT * 0.4);
  const GAP_BETWEEN_ORANGES = 8;
  const SHEET_HEIGHT = SCREEN_HEIGHT - PANEL_HEIGHT - GAP_BETWEEN_ORANGES;

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

  const confirmStartTutorial = () => setShowTutorialConfirm(true);
  const startTutorial = () => {
    setShowTutorialConfirm(false);
    closeSheet();
    sheetTranslateY.setValue(-SHEET_HEIGHT);
    setTutorialStep(0);
    setTutorialActive(true);
  };
  const cancelTutorialPrompt = () => setShowTutorialConfirm(false);
  const nextStep = () => {
    if (tutorialStep < tutorialSteps.length - 1)
      setTutorialStep((s) => s + 1);
    else endTutorial();
  };
  const endTutorial = () => {
    setTutorialActive(false);
    setTutorialStep(0);
  };

  const Card = ({ id, title, description, onPressInAction }) => {
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
      case "report":
        return <View style={styles.ringBell} pointerEvents="none" />;
      case "chat":
        return <View style={[styles.navHighlight, styles.chatPos]} />;
      case "call":
        return <View style={[styles.navHighlight, styles.callPos]} />;
      case "me":
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
                {tutorialStep < tutorialSteps.length - 1 ? "Next" : "Done"}
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
      <View style={[styles.bottomPanel, { height: PANEL_HEIGHT }]}>
        <View style={styles.row}>
          <Card
            id="fire"
            title="Fire Stations"
            description="(Click to view locations, contacts & emergency info)"
            onPressInAction={() => toggleSheet("stations")}
          />
          <Card id="tips" title="Safety Tips" />
        </View>
        <View style={styles.row}>
          <Card
            id="loc"
            title="My Location"
            description="(Click to view your current location)"
            onPressInAction={() => toggleSheet("location")}
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
        <View style={[styles.sheetContainer, { height: SHEET_HEIGHT }]}>
          <Pressable style={styles.sheetBackdrop} onPress={closeSheet} />
          <Animated.View
            style={[
              styles.topSheet,
              { height: SHEET_HEIGHT, transform: [{ translateY: sheetTranslateY }] },
            ]}
          >
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>
                {activeSheet === "stations" ? "Fire Stations" : "My Location"}
              </Text>
            </View>
            {activeSheet === "stations" ? <StationsList /> : <LocationView />}
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
      <Text style={styles.stationTitle}>Main Station (Sawangan)</Text>
      <Text style={styles.stationSub}>Contact: 0917-185-9984</Text>
    </View>

    <View style={styles.stationCard}>
      <Text style={styles.stationTitle}>Sub Station 1 (PNR Peñaranda)</Text>
      <Text style={styles.stationSub}>Contact: 0942-319-6237</Text>
    </View>

    <View style={styles.stationCard}>
      <Text style={styles.stationTitle}>Sub Station 2 (Near Albay Cathedral)</Text>
      <Text style={styles.stationSub}>Contact: 0917-118-2651</Text>
    </View>

    <View style={styles.stationCard}>
      <Text style={styles.stationTitle}>Sub Station 3 (Taysan)</Text>
      <Text style={styles.stationSub}>Contact: 0917-173-2733</Text>
    </View>

  </ScrollView>
);

const LocationView = () => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      setLocation(loc.coords);
      
      const [geo] = await Location.reverseGeocodeAsync(loc.coords);
      if (geo) {
        const fullAddress = `${geo.name || ""} ${geo.street || ""}, ${geo.city || ""}, ${geo.region || ""}, ${geo.country || ""}`;
        setAddress(fullAddress);
      }

      setLoading(false);
    } catch (err) {
      console.error("Location error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const recenter = () => {
    if (location && mapRef.current) {
      mapRef.current.animateCamera({
        center: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        zoom: 17,
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
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            showsUserLocation={false} 
            showsCompass={false}
            toolbarEnabled={false}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="You are here"
              pinColor="red"
            />
          </MapView>

          <View style={styles.addressBox}>
            <Text style={styles.addressText}>📍 {address || "Locating..."}</Text>
          </View>

          <TouchableOpacity style={styles.locateButton} onPress={recenter}>
            <Text style={styles.buttonText}>📍</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={getLocation}>
            <Text style={styles.buttonText}>Refresh</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const ORANGE = "#F37E23";
const BG = "#FEEDDE";
const NAVY = "#0E2745";
const PRESSED_BG = "#11224D";
const HIGHLIGHT = "#11224D";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG, justifyContent: "flex-end" },
  bottomPanel: {
    backgroundColor: ORANGE,
    width: "100%",
    alignSelf: "stretch",
    padding: 14,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    elevation: 6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    elevation: 2,
  },
  cardPressed: { backgroundColor: PRESSED_BG },
  halfCard: { width: "48%" },
  cardTitle: { color: NAVY, fontSize: 20, fontWeight: "800", marginBottom: 6 },
  cardTitlePressed: { color: "#FFF" },
  cardDescription: { color: NAVY, fontSize: 12, lineHeight: 16 },
  cardDescriptionPressed: { color: "rgba(255,255,255,0.9)" },
  highlightCard: {
    borderWidth: 3,
    borderColor: HIGHLIGHT,
    shadowColor: HIGHLIGHT,
    shadowOpacity: 0.35,
    elevation: 6,
  },
  sheetContainer: { position: "absolute", top: 0, left: 0, right: 0 },
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
  topSheet: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: ORANGE,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  sheetHeader: {
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "rgba(0,0,0,0.08)",
  },
  sheetTitle: { color: "#fff", fontSize: 22, fontWeight: "800" },
  sheetBody: { padding: 12 },
  stationCard: {
    backgroundColor: "#FFA45A",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  stationTitle: { color: "#fff", fontWeight: "800", fontSize: 16 },
  stationSub: { color: "#fff", fontSize: 12 },
  locationContainer: { flex: 1, backgroundColor: "#fff" },
  map: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  button: {
    position: "absolute",
    right: 20,
    bottom: 100,
    backgroundColor: "orange",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 5,
  },
  locateButton: {
    position: "absolute",
    right: 20,
    bottom: 160,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 30,
    elevation: 5,
  },
  buttonText: { color: "black", fontWeight: "bold", fontSize: 16 },
  addressBox: {
    position: "absolute",
    top: 10,
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 8,
    borderRadius: 12,
    elevation: 3,
  },
  addressText: { fontSize: 14, fontWeight: "600", color: "#333" },
});

export default HomeScreen;
