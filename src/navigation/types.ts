import { type NavigatorScreenParams } from '@react-navigation/native';
import { type StudyDetail } from '../features/study-detail/screens/StudyDetailScreen';

export type HomeStackParamList = {
  HomeMain: undefined;
  StudyDetail: { study: StudyDetail };
};

export type BottomTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Search: undefined;
  History: undefined;
  MyPage: undefined;
};
