import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {pt} from '../Utils';
import * as images from '../assets';
import api from '../apis';
import {Category as CategoryName, PlaylistBox} from '../components';

const PlaylistDetail = ({navigation, route}: any) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const url = 'playlists/' + route.params.type;
    api.get(url).then(({data}) => {
      if (data.data) {
        setData(data.data);
      }
    });
  }, []);
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
      </View>
      <CategoryName title={route.params.type} />
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View style={styles.playlists}>
          {data.length
            ? data.map((card: Object, index) => {
                return (
                  <View key={index} style={styles.card}>
                    <PlaylistBox {...card} navigation={navigation} />
                  </View>
                );
              })
            : null}
        </View>
      </ScrollView>
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
export default PlaylistDetail;
