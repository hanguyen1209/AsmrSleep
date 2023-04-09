import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  ImageBackground,
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
} from '../components';
import {fixUrlSound, pt} from '../Utils';
import {PLAYLIST, INTENSITY, TYPE, GENRE} from '../config';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useDispatch, useSelector} from 'react-redux';
import {Playlist} from '../store/Playlist';
import {App, changeCurrentPlaylistIndex} from '../store/App';
import {Player} from '@react-native-community/audio-toolkit';

const Home = ({navigation}: any) => {
  const [dataSearch, setDataSearch] = useState([]);
  const [search, setKeySearch] = useState('');
  const [recommended, setDataRecommended] = useState([]);
  const dispatch = useDispatch();

  // const [sounds, setSounds] = useState<Player[]>([]);

  const listSounds = useRef<Array<Player>>([]);
  const soundPlaying = useRef(0);
  const [playerStatus, setPlayerStatus] = useState('waiting');

  const playlist = useSelector(
    (store: {playlist: Array<Playlist>}) => store.playlist,
  );

  const playlistCurrentIndex = useSelector(
    (state: {app: App}) => state.app.playlistCurrentIndex,
  );
  // const [isFadeOut, setFadeout] = useState(false);
  const playbackOptions = {
    continuesToPlayInBackground: true,
    mixWithOthers: false,
    autoDestroy: false,
    loop: true,
  };

  const _onChangeText = (text: any) => {
    setKeySearch(text);
  };
  const _toScreen = (name: String, props: any) => () =>
    navigation.navigate(name, props);

  // const _onFaddingOut = () => {
  //   setFadeout(!isFadeOut);
  // };
  const [icon, setIcon] = useState();

  useEffect(() => {
    // if (soundPlaying) {
    //   setPlayerStatus('playing');
    // } else {
    //   setPlayerStatus('pausing');
    // }
  }, []);

  useEffect(() => {
    if (playlist[playlistCurrentIndex]) {
      listSounds.current = [];
      soundPlaying.current = 0;
      const isLoop = playlist[playlistCurrentIndex].isLoop;
      const isMix = playlist[playlistCurrentIndex].isMix;
      playlist[playlistCurrentIndex].sounds.forEach((item, index) => {
        const options = {...playbackOptions, loop: isLoop};
        const sound = new Player(fixUrlSound(item.url), options).prepare(
          err => {
            if (!err) setPlayerStatus('canPlay');
          },
        );
        listSounds.current.push(sound);
      });
    }
    return () => {
      console.log('destroyed!', listSounds.current);
      listSounds.current.forEach(p => p.destroy());
    };
  }, [playlistCurrentIndex]);

  useEffect(() => {
    const sounds = listSounds.current;
    if (playerStatus == 'playing' && sounds.length) {
      sounds.forEach((sound, index) => {
        if (sound.canPlay) {
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
        } else {
          console.log('cant play');
        }
      });
    } else if (playerStatus == 'pausing' && sounds.length) {
      sounds.forEach((sound, index) => {
        sound.pause();
      });
    }
  }, [playerStatus]);

  useEffect(() => {
    setPlayerStatus('waiting');
  }, []);

  console.log('current: ' + listSounds.current, ', play: ' + playerStatus);

  useEffect(() => {
    api.get(`sounds/recommended`).then(res => {
      const {data} = res;
      if (data) {
        setDataRecommended(data.data);
      }
    });
  }, []);

  useEffect(() => {
    if (search && search.length > 1) {
      api.get(`sounds/name/${search}`).then(res => {
        const {data} = res;
        if (data) {
          setDataSearch(data.data);
        }
      });
    } else {
      setDataSearch([]);
    }
  }, [search]);

  useEffect(() => {
    Icon.getImageSource('circle', 15, 'white').then(setIcon);
  }, []);

  const _previous = () => {
    if (playlist[playlistCurrentIndex - 1]) {
      dispatch(changeCurrentPlaylistIndex({id: playlistCurrentIndex - 1}));
      setPlayerStatus('waiting');
    }
  };

  const _next = () => {
    if (playlist[playlistCurrentIndex + 1]) {
      dispatch(changeCurrentPlaylistIndex({id: playlistCurrentIndex + 1}));
      setPlayerStatus('waiting');
    }
  };

  const _renderPlaylist = () => {
    if (!playlist.length) return null;
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
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
      <ScrollView
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
              {dataSearch.map((item: any, index) => {
                return <CardSound key={`-search-${index}`} props={item} />;
              })}
            </ScrollView>
          </View>
        ) : null}
        <Category title="recommended" />
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          horizontal={true}>
          {recommended.map((item: any, index) => {
            return <CardSound key={`-top-${index}`} props={item} />;
          })}
        </ScrollView>
        <Category title="playlist" />
        <View style={styles.playlistBox}>
          {PLAYLIST.map((item, index) => (
            <TouchableOpacity style={{flex: 1}} key={`--${index}`}>
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
              <TouchableOpacity>
                <ImageBackground
                  style={styles.volumn}
                  resizeMode="contain"
                  source={images.volumn}
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
              <TouchableOpacity
                disabled={playerStatus == 'waiting'}
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
              <TouchableOpacity onPress={_next}>
                <ImageBackground
                  style={styles.next}
                  resizeMode="contain"
                  source={images.next}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.col3}>
              <TouchableOpacity style={{marginHorizontal: 5 * pt}}>
                <ImageBackground
                  style={styles.rightIcon}
                  resizeMode="contain"
                  source={images.speed}>
                  <Text
                    style={{
                      fontSize: 9 * pt,
                      fontWeight: 'bold',
                      fontStyle: 'italic',
                    }}>
                    1.5x
                  </Text>
                </ImageBackground>
              </TouchableOpacity>
              <TouchableOpacity style={{marginHorizontal: 5 * pt}}>
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
                    25m
                  </Text>
                </ImageBackground>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Playlist')}
            style={styles.lists}>
            <View
              style={{
                height: 30 * pt,
                width: '100%',
                marginBottom: 10 * pt,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Slider
                // disabled={disable}
                style={{width: '70%', height: 20}}
                minimumValue={0}
                maximumValue={100}
                // value={77}
                maximumTrackTintColor="#FFFFFF"
                minimumTrackTintColor={'#FF5757'}
                thumbImage={icon}
                // onValueChange={_changeVolumn}
                step={1}
              />
            </View>
            {_renderPlaylist()}
          </TouchableOpacity>
        </View>
      ) : null}
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
  volumn: {
    width: 30 * pt,
    height: 30 * pt,
    resizeMode: 'contain',
    backgroundColor: 'black',
    marginHorizontal: 20 * pt,
  },
  mainPanel: {
    width: '100%',
    marginTop: 60 * pt,
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
  },
  mainTitle: {
    color: 'white',
    fontSize: 16 * pt,
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginVertical: 10 * pt,
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
    height: 250 * pt,
    width: '100%',
    bottom: 0,
    borderWidth: 3 * pt,
    borderTopLeftRadius: 30 * pt,
    borderTopRightRadius: 30 * pt,
    borderColor: 'white',
    borderBottomColor: 'black',
  },
});

export default Home;
