import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { colors } from '../../../styles/colors';
import CategorySection from '../components/CategorySection';
import AuthMethodSection, {
  type AuthMethod,
  type MethodConfig,
} from '../components/AuthMethodSection';
import AuthDetailSection from '../components/AuthDetailSection';
import SecondaryAuthMethodSection from '../components/SecondaryAuthMethodSection';
import CreateStudyHeader from '../components/CreateStudyHeader';
import GroupNameSection from '../components/GroupNameSection';
import AuthTimeControls from '../components/AuthTimeControls';
import TimePickerModal from '../components/TimePickerModal';
import StudyThumbnailPicker from '../components/StudyThumbnailPicker';
import StudyTextField from '../components/StudyTextField';
import MemberCounter from '../components/MemberCounter';
import WeekdayPicker from '../components/WeekdayPicker';
import PeriodPicker from '../components/PeriodPicker';
import PrimaryActionButton from '../components/PrimaryActionButton';
import DatePickerModal from '../components/DatePickerModal';
import CreateStudyGroupResultScreen from './CreateStudyGroupResultScreen';
import { createStudyGroup } from '../../../api/studyGroups';
import { buildStudyGroupCreatePayload } from '../../../api/studyGroupCreate';

type CreateStudyGroupScreenProps = {
  onClose: () => void;
  onComplete?: () => void;
};

const categories = ['코딩 테스트', '자격증', '언어', '기상', '착석', '기타'];
const authMethods: AuthMethod[] = ['사진', '위치', 'TODO', 'GitHub'];

const createTime = (hours: number, minutes = 0) => {
  const base = new Date();
  const next = new Date(base);
  next.setHours(hours, minutes, 0, 0);
  return next;
};

const formatTime = (value: Date) => {
  const hours = value.getHours().toString().padStart(2, '0');
  const minutes = value.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const createDefaultConfig = (method: AuthMethod): MethodConfig => ({
  method,
  todoDeadline: createTime(10, 0),
  todoComplete: createTime(22, 0),
  rangeStart: createTime(10, 0),
  rangeEnd: createTime(22, 0),
  locationType: '공통 위치',
  locationName: '',
});

function CreateStudyGroupScreen({ onClose, onComplete }: CreateStudyGroupScreenProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('착석');
  const [primaryConfig, setPrimaryConfig] = useState<MethodConfig | null>(
    createDefaultConfig('TODO'),
  );
  const [secondaryConfig, setSecondaryConfig] = useState<MethodConfig | null>(null);
  const [thumbnailUri, setThumbnailUri] = useState<string | null>(null);
  const [members, setMembers] = useState(2);
  const [days, setDays] = useState(['화', '목']);
  const [startDate, setStartDate] = useState(new Date(2026, 1, 4));
  const [endDate, setEndDate] = useState(new Date(2026, 2, 4));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeDateField, setActiveDateField] = useState<'start' | 'end'>('start');
  const [tempDate, setTempDate] = useState(new Date(2026, 1, 4));
  const [tempTime, setTempTime] = useState(createTime(10, 0));
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdGroupId, setCreatedGroupId] = useState<number | null>(null);
  const [activeTimeField, setActiveTimeField] = useState<
    'todoDeadline' | 'todoComplete' | 'rangeStart' | 'rangeEnd'
  >('todoDeadline');
  const [activeConfigKey, setActiveConfigKey] = useState<'primary' | 'secondary'>('primary');

  const nameCount = useMemo(() => name.length, [name]);
  const timeTitle =
    activeTimeField === 'todoDeadline'
      ? '작성마감 시간'
      : activeTimeField === 'todoComplete'
        ? '완료시간'
        : activeTimeField === 'rangeStart'
          ? '인증시간'
          : '종료시간';

  const selectedConfig = activeConfigKey === 'primary' ? primaryConfig : secondaryConfig;
  const selectedTime =
    selectedConfig?.[activeTimeField] ??
    createTime(10, 0);

  const formatDate = (value: Date) =>
    `${value.getFullYear()}. ${value.getMonth() + 1}. ${value.getDate()}.`;

  const selectedDate = activeDateField === 'start' ? startDate : endDate;

  const openDatePicker = (field: 'start' | 'end') => {
    setActiveDateField(field);
    setTempDate(field === 'start' ? startDate : endDate);
    setShowDatePicker(true);
  };

  const handleDateChange = (_event: DateTimePickerEvent, date?: Date) => {
    if (!date) {
      return;
    }
    if (Platform.OS === 'android') {
      if (activeDateField === 'start') {
        setStartDate(date);
      } else {
        setEndDate(date);
      }
      setShowDatePicker(false);
      return;
    }
    setTempDate(date);
  };

  const applyDate = () => {
    if (activeDateField === 'start') {
      setStartDate(tempDate);
    } else {
      setEndDate(tempDate);
    }
    setShowDatePicker(false);
  };

  const handleConfirm = () => {
    setShowResult(false);
    setCreatedGroupId(null);
    setTimeout(() => {
      if (onComplete) {
        onComplete();
        return;
      }
      onClose();
    }, 300);
  };

  const handleSubmitComplete = async () => {
    if (!primaryConfig) {
      Alert.alert('안내', '인증 방식을 하나 이상 선택해주세요.');
      return;
    }
    if (!name.trim()) {
      Alert.alert('안내', '스터디 이름을 입력해주세요.');
      return;
    }
    if (days.length === 0) {
      Alert.alert('안내', '인증 요일을 하나 이상 선택해주세요.');
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = buildStudyGroupCreatePayload({
        title: name,
        description,
        activeCategory,
        thumbnailUri,
        members,
        days,
        startDate,
        endDate,
        primaryConfig,
        secondaryConfig,
      });
      const { data } = await createStudyGroup(payload);
      const ok = data && ((data as { success?: boolean; isSuccess?: boolean }).success === true || data.isSuccess === true);
      if (ok && data?.data?.groupId != null) {
        setCreatedGroupId(data.data.groupId);
        setShowResult(true);
      } else {
        Alert.alert('생성 실패', data?.message ?? '스터디 그룹 생성에 실패했습니다.');
      }
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      Alert.alert(
        '오류',
        message ?? '서버에 연결할 수 없습니다. X-User-Id 설정 및 네트워크를 확인해주세요.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const openTimePicker = (
    field: 'todoDeadline' | 'todoComplete' | 'rangeStart' | 'rangeEnd',
    configKey: 'primary' | 'secondary',
  ) => {
    const config = configKey === 'primary' ? primaryConfig : secondaryConfig;
    if (!config) {
      return;
    }
    setActiveConfigKey(configKey);
    setActiveTimeField(field);
    setTempTime(config[field]);
    setShowTimePicker(true);
  };

  const handleTimeChange = (_event: DateTimePickerEvent, date?: Date) => {
    if (!date) {
      return;
    }
    if (Platform.OS === 'android') {
      const updater =
        activeConfigKey === 'primary' ? setPrimaryConfig : setSecondaryConfig;
      updater((prev) => (prev ? { ...prev, [activeTimeField]: date } : prev));
      setShowTimePicker(false);
      return;
    }
    setTempTime(date);
  };

  const applyTime = () => {
    const updater = activeConfigKey === 'primary' ? setPrimaryConfig : setSecondaryConfig;
    updater((prev) => (prev ? { ...prev, [activeTimeField]: tempTime } : prev));
    setShowTimePicker(false);
  };

  const setConfigMethod = (key: 'primary' | 'secondary', method: AuthMethod) => {
    if (key === 'primary') {
      setPrimaryConfig((prev) => {
        if (!prev) {
          return createDefaultConfig(method);
        }
        if (prev.method === method) {
          setSecondaryConfig(null);
          return null;
        }
        return { ...prev, method };
      });
      if (secondaryConfig?.method === method) {
        setSecondaryConfig(null);
      }
      return;
    }
    setSecondaryConfig((prev) => (prev ? { ...prev, method } : prev));
  };

  const addSecondary = () => {
    if (secondaryConfig || !primaryConfig) {
      return;
    }
    const fallback = authMethods.find((method) => method !== primaryConfig.method) ?? '사진';
    setSecondaryConfig(createDefaultConfig(fallback));
  };

  const renderTimeControls = (config: MethodConfig, configKey: 'primary' | 'secondary') => (
    <AuthTimeControls
      config={config}
      configKey={configKey}
      formatTime={formatTime}
      onOpenTimePicker={openTimePicker}
      onLocationTypeChange={(key, type) =>
        key === 'primary'
          ? setPrimaryConfig((prev) => (prev ? { ...prev, locationType: type } : prev))
          : setSecondaryConfig((prev) => (prev ? { ...prev, locationType: type } : prev))
      }
      onLocationNameChange={(key, text) =>
        key === 'primary'
          ? setPrimaryConfig((prev) => (prev ? { ...prev, locationName: text } : prev))
          : setSecondaryConfig((prev) => (prev ? { ...prev, locationName: text } : prev))
      }
    />
  );

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <CreateStudyHeader title="스터디 그룹 생성" onClose={onClose} />

        <View style={styles.profileRow}>
          <StudyThumbnailPicker compact imageUri={thumbnailUri} onChangeImage={setThumbnailUri} />
        </View>

        <GroupNameSection value={name} count={nameCount} maxLength={20} onChange={setName} />

        <StudyTextField
          value={description}
          onChange={setDescription}
          placeholder="소개글을 입력해주세요."
          containerStyle={styles.descriptionField}
          inputStyle={styles.profileDescInput}
          multiline
          numberOfLines={5}
          boxed
        />

        <CategorySection
          categories={categories}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />

        <MemberCounter value={members} onChange={setMembers} />

        <AuthMethodSection
          methods={authMethods}
          primaryConfig={primaryConfig}
          secondaryConfig={secondaryConfig}
          onSelectPrimary={(method) => setConfigMethod('primary', method)}
          onAddSecondary={addSecondary}
          onRemoveSecondary={() => setSecondaryConfig(null)}
        />

        {primaryConfig ? (
          <AuthDetailSection
            title={primaryConfig.method === '위치' ? '인증 위치' : '인증 시간'}
            config={primaryConfig}
            configKey="primary"
            renderControls={renderTimeControls}
          />
        ) : null}

        {primaryConfig && secondaryConfig ? (
          <>
            <SecondaryAuthMethodSection
              methods={authMethods}
              primaryConfig={primaryConfig}
              secondaryConfig={secondaryConfig}
              onSelectSecondary={(method) => setConfigMethod('secondary', method)}
            />
            <AuthDetailSection
              title={secondaryConfig.method === '위치' ? '인증 위치' : '인증 시간'}
              config={secondaryConfig}
              configKey="secondary"
              renderControls={renderTimeControls}
            />
          </>
        ) : null}

        <WeekdayPicker value={days} onChange={setDays} />
        <PeriodPicker
          startDate={formatDate(startDate)}
          endDate={formatDate(endDate)}
          onPressStart={() => openDatePicker('start')}
          onPressEnd={() => openDatePicker('end')}
        />
      </ScrollView>

      <View style={styles.bottom}>
        <PrimaryActionButton
          label={isSubmitting ? '생성 중…' : '완료'}
          onPress={handleSubmitComplete}
          disabled={isSubmitting}
        />
        {isSubmitting ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : null}
      </View>

      <TimePickerModal
        visible={showTimePicker}
        title={timeTitle}
        selectedTime={selectedTime}
        tempTime={tempTime}
        onChange={handleTimeChange}
        onApply={applyTime}
        onClose={() => setShowTimePicker(false)}
      />

      <DatePickerModal
        visible={showDatePicker}
        title={activeDateField === 'start' ? '시작일' : '종료일'}
        selectedDate={selectedDate}
        tempDate={tempDate}
        onChange={handleDateChange}
        onApply={applyDate}
        onClose={() => setShowDatePicker(false)}
      />

      <Modal
        visible={showResult}
        animationType="slide"
        onRequestClose={() => setShowResult(false)}
      >
        <CreateStudyGroupResultScreen
          onClose={() => setShowResult(false)}
          onConfirm={handleConfirm}
          category={activeCategory}
          primaryConfig={primaryConfig}
          secondaryConfig={secondaryConfig}
          members={members}
          startDate={startDate}
          endDate={endDate}
          days={days}
          imageUri={thumbnailUri}
          createdGroupId={createdGroupId}
        />
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 28,
  },
  bottom: {
    paddingHorizontal: 28,
    paddingBottom: 26,
  },
  loaderWrap: {
    marginTop: 8,
    alignItems: 'center',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 28,
    paddingTop: 18,
    paddingBottom: 6,
  },
  profileField: {
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  descriptionField: {
    paddingHorizontal: 28,
    paddingTop: 6,
  },
  profileTitleInput: {
    fontSize: 18,
    fontWeight: '800',
  },
  profileDescInput: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});

export default CreateStudyGroupScreen;
