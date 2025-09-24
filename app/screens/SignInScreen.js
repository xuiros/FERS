import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SignInScreen = () => {
	const navigation = useNavigation();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const onSignIn = () => {
		navigation.reset({
			index: 0,
			routes: [
				{
					name: 'Tabs',
					state: {
						routes: [
							{ name: 'Home', params: { showTutorialConfirm: true } }, // tab route name
						],
					},
				},
			],
		});
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.header}>
				<TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
					<Text style={styles.backArrow}>{'\u2190'}</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.registerBtn}>
					<Text style={styles.registerText}>Register</Text>
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Sign in</Text>
				<Text style={styles.headerDesc}>
					Access real-time alerts, track emergency locations, and get instant updates. Signing in ensures a faster response and a more personalized safety experience!
				</Text>
			</View>
			<View style={styles.form}>
				<TextInput
					style={styles.input}
					placeholder="Username"
					placeholderTextColor="#888"
					value={username}
					onChangeText={setUsername}
				/>
				<TextInput
					style={styles.input}
					placeholder="Password"
					placeholderTextColor="#888"
					value={password}
					onChangeText={setPassword}
					secureTextEntry
				/>
				<TouchableOpacity onPress={() => {}} style={styles.forgotBtn}>
					<Text style={styles.forgotText}>Forgot Password?</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.signInBtn}
					onPress={onSignIn}
				>
					<Text style={styles.signInText}>Sign in</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#F9F9F9',
	},
	header: {
		paddingTop: 48,
		paddingBottom: 32,
		paddingHorizontal: 16,
		backgroundColor: '#fff',
		elevation: 4,
	},
	backBtn: {
		position: 'absolute',
		left: 16,
		top: 32,
		zIndex: 2,
	},
	backArrow: {
		fontSize: 28,
		color: '#192A56',
		fontWeight: 'bold',
	},
	registerBtn: {
		position: 'absolute',
		right: 16,
		top: 36,
		zIndex: 2,
	},
	registerText: {
		color: '#192A56',
		fontSize: 16,
		fontWeight: '400',
	},
	headerTitle: {
		marginTop: 48,
		fontSize: 32,
		fontWeight: 'bold',
		color: '#192A56',
		marginBottom: 8,
	},
	headerDesc: {
		color: '#192A56',
		fontSize: 14,
		lineHeight: 20,
		fontWeight: '400',
		maxWidth: 340,
		marginBottom: 0,
	},
	form: {
		marginTop: 40,
		paddingHorizontal: 16,
	},
	input: {
		height: 56,
		backgroundColor: '#D7CABE',
		borderRadius: 28,
		paddingHorizontal: 24,
		fontSize: 18,
		color: '#222',
		marginBottom: 20,
		fontWeight: '400',
	},
	forgotBtn: {
		alignSelf: 'flex-end',
		marginBottom: 24,
		marginRight: 8,
	},
	forgotText: {
		color: '#A89B91',
		fontSize: 15,
	},
	signInBtn: {
		backgroundColor: '#11224D',
		borderRadius: 28,
		height: 56,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 0,
		marginBottom: 0,
		width: '100%',
		alignSelf: 'center',
	},
	signInText: {
		color: '#fff',
		fontSize: 20,
		fontWeight: '400',
	},
});

export default SignInScreen;
