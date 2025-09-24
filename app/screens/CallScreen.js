import React from "react";
import {View, Text, Button, StyleSheet} from 'react-native';

const CallScreen = ({navigation}) => {
return(
    <View style ={styles.container}>
        <Text> CallScreen </Text>
    </View>
);
}

const styles = StyleSheet.create({

    container:{
        flex:1,
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor: '#FEEDDE'
    }
})

export default CallScreen;