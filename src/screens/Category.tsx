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
import {CardSound} from '../components';
import api from '../apis';
import {Category as CategoryName} from '../components';

const Category = ({navigation, route}: any) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    let url = 'sounds/';
    switch (route.params.category) {
      case 'intense':
        url += `intense/${route.params.categoryId}`;
        break;
      case 'type':
        url += `type/${route.params.categoryId}`;
        break;
      case 'genre':
        url += `genre/${route.params.categoryName.toLowerCase()}`;
        break;
      default:
        break;
    }
    api.get(url).then(({data}) => {
      if (data.data) {
        const _data = data.data
        setData(_data);
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
      <CategoryName title={route.params.categoryName} />
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View style={styles.listSound}>
          {data.length
            ? data.map((card, index) => (
                <View key={index} style={styles.card}>
                  <CardSound props={card} />
                </View>
              ))
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
  listSound: {
    flexWrap: 'wrap',
    flex: 1,
    flexDirection: 'row',
  },
  card: {
    width: '50%',
  },
});
export default Category;
