import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Modal,
  Platform,
  RefreshControl,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {Text} from 'react-native';
import {Image, SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {default as api} from '../apis';
import * as images from '../assets';
import {
  Category,
  CardSound,
  PlaylistCard,
  IntensityCard,
  TypeCard,
  SliderSmooth,
} from '../components';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {fixUrlSound, pt, refactorSoundData} from '../Utils';
import {PLAYLIST, INTENSITY, TYPE, GENRE} from '../config';
import {useDispatch, useSelector} from 'react-redux';
import {Playlist} from '../store/Playlist';
import {App, changeCurrentPlaylistIndex, setInitial} from '../store/App';
import {Player} from '@react-native-community/audio-toolkit';
import {getUniqueId} from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';
import CheckBox from '@react-native-community/checkbox';

const Home = ({navigation}: any) => {
  const [dataSearch, setDataSearch] = useState([]);
  const [search, setKeySearch] = useState('');
  const [recommended, setDataRecommended] = useState([]);
  const dispatch = useDispatch();

  const listSounds = useRef<Array<Player>>([]);
  const soundPlaying = useRef(0);
  const [playerStatus, setPlayerStatus] = useState('waiting');

  const timer = useRef(0);
  const volumnPercent = useRef(1);
  const percent = useRef(0);
  const isFadingVolumn = useRef(false);
  const [intervalValue, setIntervalValue] = useState(-1);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const playlist = useSelector(
    (store: {playlist: Array<Playlist>}) => store.playlist,
  );

  const playlistCurrentIndex = useSelector(
    (state: {app: App}) => state.app.playlistCurrentIndex,
  );

  const playbackOptions = {
    continuesToPlayInBackground: true,
    // mixWithOthers: true,
    autoDestroy: false,
  };

  const _onChangeText = (text: any) => {
    setKeySearch(text);
  };
  const _toScreen = (name: String, props: any) => () =>
    navigation.navigate(name, props);

  const [soundId, setId] = useState(-1);

  const init = useSelector((state: {app: App}) => state.app.init);

  const [isNext, setIsNext] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const [isMuted, setMute] = useState(false);

  const [speed, setSpeed] = useState(1);

  const [isShowPolicy, setShowPolicy] = useState(false);

  const [deviceID, setDeviceID] = useState('');

  const [refreshing, setRefreshing] = React.useState(true);

  const showAlert = (decodedStr: String, navigation: any) => {
    const soundIds = decodedStr.split(',').map((e: string) => parseInt(e));
    if (soundIds.length)
      Alert.alert(
        `Do you want to copy a playlist contains ${soundIds.length} sound${
          soundIds.length > 1 ? 's' : ''
        } ?`,
        '',
        [
          {
            text: 'No',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              api
                .get('sounds/ids/' + soundIds)
                .then((res: any) => {
                  const data = res.data.data;
                  if (data)
                    navigation?.navigate('Modal', {
                      sounds: res.data.data,
                    });
                })
                .catch((err: any) => console.log(err.message, 'ERRR DATATAA'));
            },
          },
        ],
      );
  };

  const showPromtPolicy = async () => {
    const agreedPolicy = await AsyncStorage.getItem('agreedPolicy');
    if (!agreedPolicy) {
      setShowPolicy(true);
    }
  };

  useEffect(() => {
    showPromtPolicy();
  }, []);

  const handleDynamicLink = (link: any) => {
    if (link?.url) {
      const arr = link.url.split('#');
      if (arr[0] === 'https://asmr-sleep.gappvn.com' && arr[1]) {
        const Buffer = require('buffer').Buffer;
        const decodedStr = Buffer.from(arr[1], 'base64').toString('ascii');
        if (decodedStr) {
          showAlert(decodedStr, navigation);
        }
      }
    }
  };

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then((link: any) => {
        handleDynamicLink(link);
      });
  }, []);

  const initDataSounds = useCallback(() => {
    if (playlist.length == 0) return;
    setIsNext(false);
    setId(-1);
    soundPlaying.current = 0;
    const isLoop = playlist[playlistCurrentIndex]?.isLoop;
    const isMix = playlist[playlistCurrentIndex]?.isMix;
    listSounds.current = [];
    playlist[playlistCurrentIndex]?.sounds.forEach((item, index) => {
      const options = {...playbackOptions};
      const sound = new Player(fixUrlSound(item.url), options).prepare(err => {
        if (!err) setPlayerStatus(isNext ? 'playing' : 'canPlay');
        else {
          console.log(sound, 'ERROR! - ' + err.message);
          return;
        }
      });
      sound.speed = speed;
      sound.volume = item.volume;
      if (isLoop && isMix) {
        sound.looping = true;
      }
      if (isMuted) sound.volume = 0;

      listSounds.current.push(sound);
    });
  }, [init]);

  useEffect(() => {
    (async () => {
      let _id = (await AsyncStorage.getItem('deviceID')) || '';
      if (!_id) {
        const id = await getUniqueId();
        if (id) {
          _id = id;
          await api
            .post('/users', {deviceId: id})
            .then(async res => {
              const {data} = res.data;
              if (data.id) {
                await AsyncStorage.setItem('uid', data.id);
                await AsyncStorage.setItem('deviceID', id);
              }
            })
            .catch((err: any) => console.log(err.message, 'ERRORRR'));
        }
      }
      setDeviceID(_id);
    })();
  }, []);

  useEffect(() => {
    listSounds.current.forEach(sound =>
      isMuted
        ? (sound.volume = 0)
        : (sound.volume =
            isFadingVolumn && timer.current > 0
              ? (1 - percent.current) * sound.volume
              : sound.volume),
    );
  }, [isMuted]);

  useEffect(() => {
    if (init) {
      setPlayerStatus('waiting');
      initDataSounds();
      return () => {
        listSounds.current.forEach(p => {
          p.stop();
          p.destroy();
        });
      };
    }
    return;
  }, [init]);

  useEffect(() => {
    if (playlist[playlistCurrentIndex]) {
      dispatch(setInitial());
    }
  }, [playlistCurrentIndex]);

  useEffect(() => {
    const sounds = listSounds.current;
    const isLoop = playlist[playlistCurrentIndex]?.isLoop;
    const isMix = playlist[playlistCurrentIndex]?.isMix;
    if (playerStatus == 'playing' && sounds.length) {
      if (!isMix) {
        if (soundId < 0) setId(0);
        else sounds[soundId]?.play();
      } else {
        sounds.forEach((sound, index) => {
          sound
            .play(err => {
              if (!err) soundPlaying.current += 1;
            })
            .on('ended', () => {
              if (soundPlaying.current > 0) {
                soundPlaying.current -= 1;
                if (soundPlaying.current == 0) {
                  setPlayerStatus('stop');
                }
              }
            });
        });
      }
    } else if (playerStatus == 'pausing' && sounds.length) {
      sounds.forEach((sound, index) => {
        sound.pause();
      });
    } else if (playerStatus == 'stop') {
      if (!isLoop) {
        setIsNext(true);
        _next();
      }
    }
  }, [playerStatus]);

  useEffect(() => {
    const sounds = listSounds.current;
    if (soundId < 0 || !sounds[soundId]) return;
    const isLoop = playlist[playlistCurrentIndex]?.isLoop;
    sounds[soundId].play().on('ended', () => {
      if (sounds.length > 0) {
        if (soundId < sounds.length - 1) setId(soundId + 1);
        else {
          if (isLoop) setId(0);
          else {
            setIsNext(true);
            _next();
          }
        }
      }
    });
  }, [soundId]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (intervalValue) {
        timer.current -= 1;
        setIntervalValue(timer.current);

        if (timer.current === 0) {
          dispatch(setInitial());
          return;
        }
        if (timer.current) {
          listSounds.current.forEach(sound => {
            if (isMuted) {
              return;
            }
            if (isFadingVolumn.current) {
              sound.volume = (1 - percent.current) * sound.volume;
            }
          });
          percent.current += 1 / volumnPercent.current;
        }
      }
    }, timer.current * 60 * 1000);
    if (intervalValue < 1) clearInterval(interval);
    return () => {
      clearInterval(interval);
    };
  }, [intervalValue]);

  useEffect(() => {
    if (timer.current) {
      setIntervalValue(timer.current);
    }
  }, [timer.current]);

  useEffect(() => {
    if (volumnPercent.current > 1) {
      percent.current = 1 / volumnPercent.current;
    }
  }, [volumnPercent.current]);

  useEffect(() => {
    listSounds.current.forEach(sound => (sound.speed = speed));
  }, [speed]);

  useEffect(() => {
    if (refreshing) {
      api
        .get(`sounds/recommended`)
        .then(res => {
          const {data} = res;
          if (data) {
            setDataRecommended(data.data);
          }
          setRefreshing(!refreshing);
        })
        .catch(err => {
          setRefreshing(!refreshing);
        });
    }
  }, [refreshing]);

  const _renderRecomended = useMemo(
    () =>
      recommended.map((item: any, index) => {
        return <CardSound key={`-top-${index}`} props={item} />;
      }),
    [recommended.length],
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
  }, []);

  useEffect(() => {
    if (search && search.length > 1) {
      api
        .get(`sounds/name/${search}`)
        .then(res => {
          const {data} = res;
          if (data) {
            setDataSearch(data.data);
          }
        })
        .catch(err => console.log(err.message, 'ERROR_API'));
    } else {
      setDataSearch([]);
    }
  }, [search]);

  const _previous = () => {
    if (playlist[playlistCurrentIndex - 1]) {
      dispatch(changeCurrentPlaylistIndex({id: playlistCurrentIndex - 1}));
      dispatch(setInitial());
    }
  };

  const _next = () => {
    if (playlist[playlistCurrentIndex + 1]) {
      dispatch(changeCurrentPlaylistIndex({id: playlistCurrentIndex + 1}));
    } else {
      dispatch(changeCurrentPlaylistIndex({id: 0}));
      if (playlist.length == 1) dispatch(setInitial());
    }
  };

  const _setSpeed = () => {
    setSpeed(c => (c < 2 ? c + 0.25 : 0.25));
  };

  const _onSelectPlaylist = (type: String) => {
    return () => {
      navigation.navigate('PlaylistDetail', {type});
    };
  };

  const _renderSearchData = useMemo(
    () =>
      dataSearch.map((item: any, index) => {
        return <CardSound key={`-search-${item._id}`} props={item} />;
      }),
    [JSON.stringify(dataSearch)],
  );

  const _renderPlaylist = () => {
    if (!playlist.length) return null;
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          marginTop: 10 * pt,
        }}>
        <Text style={styles.smallTitle}>
          {playlist[playlistCurrentIndex - 1]
            ? playlist[playlistCurrentIndex - 1].name
            : ''}
        </Text>
        <Text style={styles.mainTitle}>
          {playlist[playlistCurrentIndex]
            ? playlist[playlistCurrentIndex].name
            : ''}
        </Text>
        <Text style={styles.smallTitle}>
          {playlist[playlistCurrentIndex + 1]
            ? playlist[playlistCurrentIndex + 1].name
            : ''}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.SafeAreaView}>
      {isShowPolicy ? (
        <View
          style={{
            flex: 1,
            zIndex: 2,
            height: '100%',
            position: 'absolute',
            width: '100%',
          }}>
          <View
            style={{
              position: 'absolute',
              width: '96%',
              backgroundColor: 'white',
              borderRadius: 10 * pt,
              padding: 15 * pt,
              alignSelf: 'center',
              top: '10%',
            }}>
            <Text
              style={{fontSize: 16 * pt, color: 'black', fontWeight: 'bold'}}>
              Consent for Data Collection{`\n`}
            </Text>
            <Text
              style={{fontSize: 12 * pt, color: 'black', fontStyle: 'italic'}}>
              By downloading, installing, or using asmr sleep, you agree to be
              bound by any alterations, amendments, additions, or modifications
              to this policy. At asmr sleep, we value your privacy and data
              security. {`\n\n`}
              We collect the IDFV number for iOS devices and the Android ID for
              Android devices solely for the purpose of calculating the number
              of user favorites for sounds displayed in our most recommended
              sound section.{`\n\n`} We do not collect any personally
              identifiable information (PII) associated with these device
              identifiers. This data collection occurs only with your consent
              and is securely stored on our servers. We retain this data as long
              as necessary to calculate the number of user favorites and for
              internal statistical analysis.{`\n\n`} We do not share this data
              with any third parties, and it is not used for any other purposes.
              By using asmr sleep, you implicitly consent to the collection and
              utilization of your IDFV number for iOS devices or Android ID for
              Android devices as described above.{`\n\n`} You have the right to
              withdraw your consent at any time by disabling the relevant
              permissions in your device settings. {`\n\n`} However, please note
              that disabling these permissions may impact the functionality of
              our application, including the accurate display of recommended
              sounds.{`\n\n`}
              If you have any questions or concerns regarding our data
              collection practices, please refer to our privacy policy or
              contact our support team.
            </Text>
            <View
              style={{
                paddingVertical: 10 * pt,
                flex: 1,
                flexDirection: 'row',
                // justifyContent: 'center',
                alignItems: 'center',
              }}>
              <CheckBox
                style={{
                  backgroundColor: Platform.OS == 'android' ? 'gray' : 'white',
                }}
                value={toggleCheckBox}
                onValueChange={newValue => setToggleCheckBox(newValue)}
              />
              <Text style={{color: 'black', flex: 1}}> I agree.</Text>
              <TouchableOpacity
                disabled={toggleCheckBox ? false : true}
                style={{backgroundColor: toggleCheckBox ? '#ff5757' : 'gray'}}
                onPress={async () => {
                  await AsyncStorage.setItem(
                    'agreedPolicy',
                    JSON.stringify(true),
                  );
                  setShowPolicy(false);
                }}>
                <Text style={{padding: 8 * pt, color: 'white'}}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : null}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.searchIcon}>
            <Image
              style={{height: 27 * pt, width: 20 * pt}}
              source={images.searchGray}
              resizeMode="contain"
            />
          </View>
          <View style={styles.centerView}>
            <TextInput
              style={styles.search}
              placeholderTextColor="gray"
              placeholder="Search sounds by ID or name ..."
              onChangeText={_onChangeText}
            />
          </View>
          <View>
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
              <Icon name="bars" color={'white'} size={30 * pt} />
            </TouchableOpacity>
          </View>
        </View>
        {dataSearch.length && search.length > 1 ? (
          <View style={styles.searchBox}>
            <Category
              title={
                search.length > 10 ? search.substring(0, 10) + '...' : search
              }
            />
            <ScrollView
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              horizontal={true}>
              {_renderSearchData}
            </ScrollView>
          </View>
        ) : null}
        <Category title="recommended" />
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          horizontal={true}>
          {_renderRecomended}
        </ScrollView>
        <Category title="playlist" />
        <View style={styles.playlistBox}>
          {PLAYLIST.map((item, index) => (
            <TouchableOpacity
              onPress={_onSelectPlaylist(item)}
              style={{flex: 1}}
              key={`--${index}`}>
              <PlaylistCard type={item} name={item} />
            </TouchableOpacity>
          ))}
        </View>
        <Category title="intense" />
        <View style={styles.playlistBox}>
          {INTENSITY.map((item, index) => (
            <TouchableOpacity
              style={{flex: 1}}
              key={`-${index}`}
              onPress={_toScreen('Category', {
                category: 'intense',
                categoryName: item.name,
                categoryId: item.id,
              })}>
              <IntensityCard type={item.id} name={item.name} />
            </TouchableOpacity>
          ))}
        </View>
        <Category title="type" />
        <View style={styles.typeBox}>
          {TYPE.map((item, index) => (
            <TouchableOpacity
              style={{width: '33%'}}
              key={`__${index}`}
              onPress={_toScreen('Category', {
                category: 'type',
                categoryName: item.name,
                categoryId: item.id,
              })}>
              <TypeCard type={item.id} name={item.name} />
            </TouchableOpacity>
          ))}
        </View>
        <Category title="genre" />
        <View style={styles.genreBox}>
          {GENRE.map((item, index) => (
            <TouchableOpacity
              key={`__${index}`}
              style={styles.genre}
              onPress={_toScreen('Category', {
                category: 'genre',
                categoryName: item,
              })}>
              <Text style={styles.text}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{width: '100%', paddingBottom: 20 * pt}}>
          <Text style={{color: 'gray', textAlign: 'center', fontSize: 9 * pt}}>
            Device ID: {deviceID}
          </Text>
        </View>
      </ScrollView>
      {playlist.length ? (
        <View style={styles.panel}>
          <View style={styles.mainPanel}>
            <View
              style={{
                width: '100%',
                height: 3 * pt,
                position: 'absolute',
                top: '48%',
                backgroundColor: 'white',
              }}
            />
            <View style={styles.col1}>
              <TouchableOpacity onPress={() => setMute(c => !c)}>
                <ImageBackground
                  style={[styles.volume, {opacity: isMuted ? 0.5 : 1}]}
                  resizeMode="contain"
                  source={images.volume}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.col2}>
              <TouchableOpacity onPress={_previous}>
                <ImageBackground
                  style={styles.previous}
                  resizeMode="contain"
                  source={images.previous}
                />
              </TouchableOpacity>
              {playerStatus == 'waiting' ? (
                <ActivityIndicator
                  color={'white'}
                  style={[
                    styles.play,
                    {
                      marginHorizontal: 20 * pt,
                      backgroundColor: 'black',
                      overflow: 'hidden',
                      borderRadius: 30 * pt,
                      borderColor: 'white',
                      borderWidth: 3 * pt,
                    },
                  ]}
                />
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    if (['stop', 'canPlay', 'pausing'].includes(playerStatus)) {
                      setPlayerStatus('playing');
                    } else {
                      setPlayerStatus('pausing');
                    }
                  }}
                  style={{
                    marginHorizontal: 20 * pt,
                    opacity: playerStatus == 'waiting' ? 0.5 : 1,
                  }}>
                  <ImageBackground
                    style={styles.play}
                    resizeMode="contain"
                    source={
                      ['stop', 'canPlay', 'pausing'].includes(playerStatus)
                        ? images.playMusic
                        : images.pauseWhiteRound
                    }
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={_next}>
                <ImageBackground
                  style={styles.next}
                  resizeMode="contain"
                  source={images.next}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.col3}>
              <TouchableOpacity
                onPress={_setSpeed}
                style={{marginHorizontal: 5 * pt}}>
                <ImageBackground
                  style={styles.rightIcon}
                  resizeMode="contain"
                  source={images.speed}>
                  <Text
                    style={{
                      fontSize: speed == 1 ? 11 * pt : 9 * pt,
                      fontWeight: 'bold',
                      fontStyle: 'italic',
                    }}>
                    {speed}x
                  </Text>
                </ImageBackground>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={{marginHorizontal: 5 * pt}}>
                <ImageBackground
                  style={styles.rightIcon}
                  resizeMode="contain"
                  source={images.timer}>
                  <Text
                    style={{
                      fontSize: 9 * pt,
                      fontWeight: 'bold',
                      fontStyle: 'italic',
                    }}>
                    {timer.current > 0 ? `${timer.current}m` : 'OFF'}
                  </Text>
                </ImageBackground>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Playlist')}
            style={styles.lists}>
            {_renderPlaylist()}
          </TouchableOpacity>
        </View>
      ) : null}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <TouchableOpacity
          onPress={() => setModalVisible(false)}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            backgroundColor: 'black',
            opacity: 0.5,
          }}></TouchableOpacity>
        <View
          style={{
            backgroundColor: 'gray',
            height: '18%',
            width: '80%',
            position: 'absolute',
            zIndex: 2,
            alignSelf: 'center',
            top: '50%',
            borderRadius: 10 * pt,
            justifyContent: 'center',
          }}>
          <SliderSmooth
            timer={timer}
            isFadingVolumn={isFadingVolumn}
            volumnPercent={volumnPercent}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  rightIcon: {
    width: 40 * pt,
    height: 40 * pt,
    resizeMode: 'contain',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  col1: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  col2: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  col3: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  volume: {
    width: 30 * pt,
    height: 30 * pt,
    resizeMode: 'contain',
    backgroundColor: 'black',
    marginHorizontal: 20 * pt,
  },
  mainPanel: {
    width: '100%',
    marginTop: 50 * pt,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  play: {
    width: 60 * pt,
    height: 60 * pt,
    resizeMode: 'contain',
    backgroundColor: 'black',
  },
  previous: {
    width: 40 * pt,
    height: 40 * pt,
    resizeMode: 'contain',
    backgroundColor: 'black',
  },
  next: {
    width: 40 * pt,
    height: 40 * pt,
    resizeMode: 'contain',
    backgroundColor: 'black',
  },
  smallTitle: {
    color: '#555',
    fontSize: 10 * pt,
    fontStyle: 'italic',
    paddingTop: 10 * pt,
  },
  mainTitle: {
    color: 'white',
    fontSize: 16 * pt,
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginHorizontal: 10 * pt,
    paddingVertical: 5 * pt,
    backgroundColor: '#FF5757',
    borderRadius: 8 * pt,
    overflow: 'hidden',
    paddingHorizontal: 10 * pt,
  },
  lists: {
    alignItems: 'center',
    flex: 5,
    marginTop: 35 * pt,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20 * pt,
    paddingTop: 10 * pt,
  },
  SafeAreaView: {
    flex: 1,
    paddingVertical: 20 * pt,
  },
  centerView: {
    flex: 1,
  },
  searchIcon: {
    paddingRight: 20 * pt,
  },
  playLists: {
    padding: 20 * pt,
    maxHeight: 70 * pt,
  },
  search: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 14 * pt,
  },
  playlistBox: {
    flexDirection: 'row',
  },
  typeBox: {
    flexWrap: 'wrap',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  genreBox: {
    flexWrap: 'wrap',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 30 * pt,
    marginBottom: 30 * pt,
  },
  genre: {
    padding: 6 * pt,
    borderRadius: 5 * pt,
    backgroundColor: '#FFEEEE',
    margin: 10 * pt,
  },
  text: {
    fontSize: 10 * pt,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#FF5757',
  },
  searchBox: {
    borderWidth: 1 * pt,
    borderColor: 'white',
    borderRadius: 10 * pt,
    marginTop: 10 * pt,
  },
  panel: {
    height: 150 * pt,
    width: '100%',
    bottom: 0,
    borderWidth: 3 * pt,
    borderTopLeftRadius: 20 * pt,
    borderTopRightRadius: 20 * pt,
    borderColor: 'white',
    borderBottomColor: 'black',
  },
});

export default Home;
