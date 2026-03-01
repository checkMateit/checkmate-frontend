import React from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { type BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { type CompositeNavigationProp } from '@react-navigation/native';
import MyStudyScreen from '../../my-study/screens/MyStudyScreen';
import { type SearchStackParamList } from '../../../navigation/types';
import { type BottomTabParamList } from '../../../navigation/types';

function SearchScreen() {
  const navigation = useNavigation<
    CompositeNavigationProp<
      import('@react-navigation/native-stack').NativeStackNavigationProp<SearchStackParamList, 'SearchMain'>,
      BottomTabNavigationProp<BottomTabParamList>
    >
  >();
  const route = useRoute<RouteProp<SearchStackParamList, 'SearchMain'>>();
  const fromHomeEmptyCard = route.params?.fromHomeEmptyCard === true;

  const handleClose = () => {
    if (fromHomeEmptyCard) {
      const parent = navigation.getParent<BottomTabNavigationProp<BottomTabParamList>>();
      parent?.navigate('Home');
    }
  };

  return <MyStudyScreen onClose={handleClose} mode="search" />;
}

export default SearchScreen;
