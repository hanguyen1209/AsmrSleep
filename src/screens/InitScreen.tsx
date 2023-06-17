import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {
  arrowRight,
  arrowLeft,
  initScreen1,
  initScreen2,
  initScreen3,
  initScreen4,
  initScreen5,
  initScreen6,
} from '../assets';

const Images = [
  initScreen1,
  initScreen2,
  initScreen3,
  initScreen4,
  initScreen5,
  initScreen6,
];

import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const InitScreen = ({navigation}: any) => {
  const [source, setSource] = useState(0);
  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('PassedInitScreen').then(val => {
      if (val == 'ok') {
        navigation.navigate('Home');
      } else {
        setIsLoading(false);
      }
    });
   
  }, []);

  const renderArrow = () => {
    switch (source) {
      case 0:
        return (
          <SafeAreaView>
            <View
              style={{
                width: 390,
                height: 520,
                position: 'absolute',
                bottom: source == 0 ? 150 : 0,
              }}>
              <View style={{marginTop: Platform.OS == 'ios' ? 5 : 140}}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 20,
                    fontWeight: '700',
                    textAlign: 'center',
                  }}>
                  Click this plus sign to add a sound{'\n'}to a playlist
                </Text>
              </View>
              <View
                style={{
                  width: 40,
                  height: 30,
                  marginTop: Platform.OS == 'ios' ? 443 : 390,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setSource(c => c + 1);
                  }}>
                  <Image
                    source={arrowRight}
                    style={{
                      width: Platform.OS == 'ios' ? 40 : 40,
                      height: Platform.OS == 'ios' ? 30 : 30,
                      marginLeft: Platform.OS == 'ios' ? 310 : 300,
                      //marginBottom: 50,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        );
      case 1:
        return (
          <SafeAreaView style={{alignItems: 'center'}}>
            <View
              style={{
                width: 390,
                height: 520,
                position: 'absolute',
                bottom: source == 1 ? 150 : 0,
                left: 0,
              }}>
              <View style={{marginBottom: Platform.OS == 'ios' ? 325 : 325}}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 20,
                    fontWeight: '700',
                    textAlign: 'center',
                    marginTop: Platform.OS == 'ios' ? 0 : 140,
                  }}>
                  Then give that playlist a name or{'\n'}choose an existing
                  playlist to add
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingTop: Platform.OS == 'ios' ? 124 : 65,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setSource(c => c - 1);
                  }}>
                  <Image
                    source={arrowLeft}
                    style={{width: 40, height: 30, marginLeft: 40}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setSource(c => c + 1);
                  }}>
                  <Image
                    source={arrowRight}
                    style={{width: 40, height: 30, marginRight: 40}}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        );
      case 2:
        return (
          <View
            style={{
              width: 390,
              height: 520,
              position: 'absolute',
              bottom: source == 2 ? 150 : 0,
              left: 0,
            }}>
            <View style={{marginTop: Platform.OS == 'ios' ? 0 : 48}}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 20,
                  fontWeight: '700',
                  textAlign: 'center',
                  marginTop: Platform.OS == 'ios' ? 80 : 90,
                  marginBottom: 280,
                }}>
                Here you can download, adjust the{'\n'}volumn of any sound,
                manage your{'\n'}playlist more or simple share the{'\n'}
                playlist with your friend
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: Platform.OS == 'ios' ? 122 : 65,
              }}>
              <TouchableOpacity
                onPress={() => {
                  setSource(c => c - 1);
                }}>
                <Image
                  source={arrowLeft}
                  style={{width: 40, height: 30, marginLeft: 40}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSource(c => c + 1);
                }}>
                <Image
                  source={arrowRight}
                  style={{width: 40, height: 30, marginRight: 40}}
                />
              </TouchableOpacity>
            </View>
          </View>
        );
      case 3:
        return (
          <View
            style={{
              width: 390,
              height: 520,
              position: 'absolute',
              bottom: source == 3 ? 150 : 0,
              left: 0,
            }}>
            <View style={{marginBottom: Platform.OS == 'ios' ? 100 : 80}}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 20,
                  fontWeight: '700',
                  textAlign: 'center',
                  marginTop: Platform.OS == 'ios' ? 81 : 140,
                  marginBottom: Platform.OS == 'ios' ? 275 : 255,
                }}>
                To do that, click on the section {'\n'}containing the playlist
                name below
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: Platform.OS == 'ios' ? 74 : 60,
              }}>
              <TouchableOpacity
                onPress={() => {
                  setSource(c => c - 1);
                }}>
                <Image
                  source={arrowLeft}
                  style={{width: 40, height: 30, marginLeft: 40}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSource(c => c + 1);
                }}>
                <Image
                  source={arrowRight}
                  style={{width: 40, height: 30, marginRight: 40}}
                />
              </TouchableOpacity>
            </View>
          </View>
        );
      case 4:
        return (
          <View
            style={{
              width: 390,
              height: 520,
              position: 'absolute',
              bottom: source == 4 ? 150 : 0,
              left: 0,
            }}>
            <View>
              <Text
                style={{
                  color: 'white',
                  fontSize: 20,
                  fontWeight: '700',
                  margin: 'auto',
                  textAlign: 'center',
                  marginTop: Platform.OS == 'ios' ? 77 : 140,
                }}>
                You can choose any type {'\n'}or genre you like
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: Platform.OS == 'ios' ? 453 : 390,
              }}>
              <TouchableOpacity
                onPress={() => {
                  setSource(c => c - 1);
                }}>
                <Image
                  source={arrowLeft}
                  style={{width: 40, height: 30, marginLeft: 40}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSource(c => c + 1);
                }}>
                <Image
                  source={arrowRight}
                  style={{width: 40, height: 30, marginRight: 40}}
                />
              </TouchableOpacity>
            </View>
          </View>
        );
      case 5:
        return (
          <View
            style={{
              width: 390,
              height: 520,
              position: 'absolute',
              bottom: source == 5 ? 150 : 0,
              left: 0,
            }}>
            <View style={{}}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 21,
                  fontWeight: '700',
                  margin: 'auto',
                  textAlign: 'center',
                  marginTop: Platform.OS == 'ios' ? 72 : 140,
                }}>
                We've also compiled some playlist{'\n'}for you so you can easily
                copy them{'\n'}into your own playlist
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: Platform.OS == 'ios' ? 431 : 362,
              }}>
              <TouchableOpacity
                onPress={() => {
                  setSource(c => c - 1);
                }}>
                <Image
                  source={arrowLeft}
                  style={{width: 40, height: 30, marginLeft: 40}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  await AsyncStorage.setItem('PassedInitScreen', 'ok');
                  navigation.navigate('Home');
                }}>
                <View
                  style={{
                    backgroundColor: 'red',
                    width: 120,
                    height: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 5,
                    marginRight: 40,
                  }}>
                  <Text
                    style={{color: 'white', fontSize: 17, fontWeight: '800'}}>
                    OK, I GOT IT
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        );
    }
  };
  return loading ? (
    <ActivityIndicator
      size={'large'}
      color={'white'}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
      }}></ActivityIndicator>
  ) : (
    <View style={{flex: 1}}>
      <Image source={Images[source]} style={styles.image} />
      {renderArrow()}
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    width: '100%',
    height: '100%',
  },
  image: {
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
  },
  arrow: {
    width: '3%',
    height: '3%',
  },
});

export default InitScreen;
