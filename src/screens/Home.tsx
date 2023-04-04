import React, {useEffect, useRef, useState} from 'react';
import {TextInput, TouchableOpacity} from 'react-native';
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

const Home = ({navigation}: any) => {
  const [dataSearch, setDataSearch] = useState([]);
  const [search, setKeySearch] = useState('');
  const [recommended, setDataRecommended] = useState([]);
  const _onChangeText = (text: any) => {
    setKeySearch(text);
  };
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

  const _toScreen = (name: String, props: any) => () =>
    navigation.navigate(name, props);

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    marginBottom: 300 * pt,
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
});

export default Home;
