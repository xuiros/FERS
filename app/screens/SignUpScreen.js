import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const SignUpScreen = ({ navigation }) => {
    const [selectedId, setSelectedId] = useState('');

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <Image source={require('../assets/icons/back.png')} style={styles.backIcon} />
            </TouchableOpacity>
            <Text style={styles.title}>Register</Text>
            <Text style={styles.label}>Scan your ID</Text>
            <Text style={styles.desc}>No need to manually fill the form. Just scan it. Fast and secure.</Text>
            <Text style={styles.label}>Choose your ID</Text>
            <View style={styles.pickerWrapper}>
                <Picker
                    selectedValue={selectedId}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSelectedId(itemValue)}
                    dropdownIconColor="#11224D"
                >
                    <Picker.Item label="Select your ID" value="" color="#888" />
                    <Picker.Item label="Driver's License" value="drivers_license" color="#222" />
                    <Picker.Item label="Passport" value="passport" color="#222" />
                    <Picker.Item label="National ID" value="national_id" color="#222" />
                </Picker>
            </View>
            <View style={styles.idImageWrapper}>
                <Image source={require('../assets/icons/id-placeholder.png')} style={styles.idImage} />
            </View>
            <Text style={styles.instructionsTitle}>Here's how to scan it:</Text>
            <Text style={styles.instructions}>1. Scan the front side of your ID first.</Text>
            <Text style={styles.instructions}>2. When it's done, you'll see the instruction onscreen to turn your card over and scan for the back side.</Text>
            <Text style={styles.instructions}>3. You can see the scanned data on the result screen before you finish the process.</Text>
            <TouchableOpacity style={styles.scanBtn} onPress={() => navigation.navigate('FrontID')}>
                <Text style={styles.scanBtnText}>Start scanning</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDE6D2',
        padding: 20,
    },
    backBtn: {
        position: 'absolute',
        left: 10,
        top: 40,
        zIndex: 2,
    },
    backIcon: {
        width: 32,
        height: 32,
        tintColor: '#11224D',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#11224D',
        alignSelf: 'center',
        marginTop: 40,
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#222',
        marginTop: 10,
        marginBottom: 4,
    },
    desc: {
        color: '#222',
        fontSize: 14,
        marginBottom: 10,
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#888',
        borderRadius: 8,
        marginVertical: 10,
        overflow: 'hidden',
        backgroundColor: '#E5DCD2',
    },
    picker: {
        height: 55,
        width: '100%',
        fontSize: 16,
        backgroundColor: 'transparent',
    },
    idImageWrapper: {
        alignItems: 'center',
        marginVertical: 15,
    },
    idImage: {
        width: 150,
        height: 90,
        borderWidth: 5,
        borderColor: '#B55B3B',
        borderRadius: 4,
        backgroundColor: '#fff',
    },
    instructionsTitle: {
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 2,
        color: '#222',
    },
    instructions: {
        color: '#222',
        fontSize: 13,
        marginBottom: 2,
    },
    scanBtn: {
        backgroundColor: '#11224D',
        borderRadius: 25,
        paddingVertical: 15,
        paddingHorizontal: 40,
        marginTop: 20,
        alignItems: 'center',
        alignSelf: 'center',
        width: '90%',
    },
    scanBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
});

export default SignUpScreen;
