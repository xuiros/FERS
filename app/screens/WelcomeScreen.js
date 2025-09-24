import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
	return (
		<View style={styles.container}>
			<View style={styles.logoContainer}>
				<Image
					source={require('../assets/icons/bfp-logo.png')}
					style={styles.logo}
					resizeMode="contain"
				/>
			</View>
			<View style={styles.bottomCard}>
				<Text style={styles.welcome}>Welcome</Text>
				<Text style={styles.desc}>
					Stay safe with real-time location tracking and instant alerts via SMS, email, and notifications. Faster response, better communication, and enhanced fire safety at your fingertips!
				</Text>
				<View style={styles.buttonRow}>
					<TouchableOpacity style={styles.signInBtn} onPress={() => navigation.navigate('SignInScreen')}> 
						<Text style={styles.signInText}>Sign in</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.signUpBtn} onPress={() => navigation.navigate('SignUpScreen')}>
						<Text style={styles.signUpText}>Sign up</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FDE6D2',
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	logoContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	logo: {
		width: 200,
		height: 200,
		marginTop: 60,
	},
	bottomCard: {
		width: '100%',
		backgroundColor: '#FF8811',
		borderTopLeftRadius: 50,
		borderTopRightRadius: 50,
		padding: 60,
		alignItems: 'center',
		justifyContent: 'center',
	},
	welcome: {
		fontSize: 32,
		fontWeight: 'bold',
		color: '#fff',
		marginBottom: 10,
		alignSelf: 'flex-start',
	},
	desc: {
		color: '#fff',
		fontSize: 15,
		marginBottom: 30,
		textAlign: 'left',
		alignSelf: 'flex-start',
	},
	buttonRow: {
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'space-between',
        
	},
	signInBtn: {
		backgroundColor: '#11224D',
		borderRadius: 25,
		paddingVertical: 18,
		paddingHorizontal: 40,
		marginRight: 15,
	},
	signInText: {
		color: '#fff',
		fontWeight: 'bold',
		fontSize: 20,
	},
	signUpBtn: {
		backgroundColor: '#fff',
		borderRadius: 25,
		paddingVertical: 18,
		paddingHorizontal: 40,
        marginRight:40
	
	},
	signUpText: {
		color: '#FF8811',
		fontWeight: 'bold',
		fontSize: 20,
	},
});

export default WelcomeScreen;
