import React from 'react';
import {
  Image,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {pt} from '../Utils';
import * as images from '../assets';
const Settings = ({navigation}: any) => {
  return (
    <SafeAreaView style={styles.SafeAreaView}>
      <View style={styles.header}>
        <TouchableOpacity onPress={navigation.goBack} style={styles.backTouch}>
          <Image
            style={{height: 27 * pt, width: 20 * pt}}
            source={images.back}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={{flex: 1}}>
          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: 20 * pt,
              textAlign: 'center',
              paddingRight: 30 * pt,
            }}>
            Settings
          </Text>
        </View>
      </View>
      <View style={{padding: 20 * pt}}>
        <TouchableOpacity
          style={{padding: 10 * pt}}
          onPress={() => Linking.openURL('https://gappvn.com/privacy.html')}>
          <Text style={{color: 'white', textDecorationLine: 'underline'}}>
            Privacy Policy
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{padding: 10 * pt}}
          onPress={() => Linking.openURL('https://gappvn.com/term.html')}>
          <Text style={{color: 'white', textDecorationLine: 'underline'}}>
            Term of Use
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  SafeAreaView: {
    flex: 1,
    paddingVertical: 20 * pt,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20 * pt,
  },
  backTouch: {
    paddingRight: 20 * pt,
  },
  playlists: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '75%',
    paddingTop: 35 * pt,
  },
});
export default Settings;
