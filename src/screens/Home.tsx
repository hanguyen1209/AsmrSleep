import React, {useState} from 'react';
import {TextInput} from 'react-native';
import {Text} from 'react-native';
import {Image, SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import * as images from '../assets';
import {
  Category,
  CardSound,
  PlaylistCard,
  IntensityCard,
  TypeCard,
} from '../components';
import {pt} from '../Utils';

const PLAYLIST = ['relax', 'sleep', 'meditation'];
const INTENSITY = ['soft', 'medium', 'intense'];
const TYPE = [
  'Whispering',
  'Tapping',
  'Scratching',
  'Rain sounds',
  'Rustling',
  'Mouth sounds',
  'Positive messages',
  'Brushing',
  'Page Turning',
];
const GENRE = [
  'Nature sounds',
  'Ambience sounds',
  'Food and drink',
  'Guided meditation',
  'Storytelling',
  'Musical ASMR',
  'White noise',
  '3D sound',
  'Roleplay',
];

const Home = () => {
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
            />
          </View>
        </View>
        <Category title="recommended" />
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          horizontal={true}>
          <CardSound intense={1} type={7} />
          <CardSound intense={2} type={5} />
          <CardSound intense={3} type={9} />
        </ScrollView>
        <Category title="playlist" />
        <View style={styles.playlistBox}>
          {PLAYLIST.map((item, index) => (
            <PlaylistCard key={`--${index}`} type={item} name={item} />
          ))}
        </View>
        <Category title="intense" />
        <View style={styles.playlistBox}>
          {INTENSITY.map((item, index) => (
            <IntensityCard key={`-${index}`} type={item} name={item} />
          ))}
        </View>
        <Category title="type" />
        <View style={styles.typeBox}>
          {TYPE.map((item, index) => (
            <TypeCard key={`__${index}`} type={item} name={item} />
          ))}
        </View>
        <Category title="genre" />
        <View style={styles.genreBox}>
          {GENRE.map((item, index) => (
            <View key={`__${index}`} style={styles.genre}>
              <Text style={styles.text}>{item}</Text>
            </View>
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
    paddingTop: 30*pt,
    marginBottom: 300*pt
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
});

export default Home;
