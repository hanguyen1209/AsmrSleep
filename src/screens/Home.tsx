import React, {useEffect, useRef, useState} from 'react';
import {
  ImageBackground,
  Switch,
  SwitchComponent,
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
import {pt} from '../Utils';
import {PLAYLIST, INTENSITY, TYPE, GENRE} from '../config';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/FontAwesome';


const Home = ({navigation}: any) => {
  const [dataSearch, setDataSearch] = useState([]);
  const [search, setKeySearch] = useState('');
  const [recommended, setDataRecommended] = useState([]);
  const [isFadeOut, setFadeout] = useState(false);

  const _onChangeText = (text: any) => {
    setKeySearch(text);
  };
  const _toScreen = (name: String, props: any) => () =>
    navigation.navigate(name, props);

  const _onFaddingOut = () => {
    setFadeout(!isFadeOut);
  };
  const [icon, setIcon] = useState();

  useEffect(() => {
    api.get(`sounds/recommended`).then(res => {
      const {data} = res;
      if (data) {
        setDataRecommended(data.data);
      }
    });
  }, []);

  useEffect(() => {
    if (search && search.length > 3) {
      api.get(`sounds/name/${search}`).then(res => {
        const {data} = res;
        if (data) {
          setDataSearch(data.data);
        }
      });
    }
  }, [search]);

  useEffect(() => {
    Icon.getImageSource('circle', 15, 'white').then(setIcon);
  }, []);

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
        {dataSearch.length && search.length > 3 ? (
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
              <Image
                style={styles.volumn}
                resizeMode="contain"
                source={images.volumn}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.col2}>
            <TouchableOpacity>
              <Image
                style={styles.previous}
                resizeMode="contain"
                source={images.previous}
              />
            </TouchableOpacity>
            <TouchableOpacity style={{marginHorizontal: 20 * pt}}>
              <Image
                style={styles.play}
                resizeMode="contain"
                source={images.playMusic}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
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
        <View style={styles.lists}>
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
              style={{width: "70%", height: 20}}
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
          <Text style={styles.smallTitle}>
            playlist 1 playlist 1 playlist 1
          </Text>
          <Text style={styles.mainTitle}>
            playlist 2 playlist 1 playlist 3 playlist 4 playlist 5
          </Text>
          <Text style={styles.smallTitle}>
            playlist 3 playlist 1 playlist 1 playlist 1
          </Text>
        </View>
      </View>
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
    flex: 1,
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
