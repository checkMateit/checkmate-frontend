import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
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

type CreateStudyGroupScreenProps = {
  onClose: () => void;
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
  const hours = value.getHours();
  const minutes = value.getMinutes();
  const isAm = hours < 12;
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  const displayMinutes = minutes.toString().padStart(2, '0');
  return `${isAm ? '오전' : '오후'} ${displayHour}:${displayMinutes}`;
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

function CreateStudyGroupScreen({ onClose }: CreateStudyGroupScreenProps) {
  const [name, setName] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('착석');
  const [primaryConfig, setPrimaryConfig] = useState<MethodConfig | null>(
    createDefaultConfig('TODO'),
  );
  const [secondaryConfig, setSecondaryConfig] = useState<MethodConfig | null>(null);
  const [tempTime, setTempTime] = useState(createTime(10, 0));
  const [showTimePicker, setShowTimePicker] = useState(false);
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

        <GroupNameSection value={name} count={nameCount} maxLength={20} onChange={setName} />

        <CategorySection
          categories={categories}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />

        <AuthMethodSection
          methods={authMethods}
          primaryConfig={primaryConfig}
          secondaryConfig={secondaryConfig}
          onSelectPrimary={(method) => setConfigMethod('primary', method)}
          onAddSecondary={addSecondary}
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
      </ScrollView>

      <View style={styles.bottom}>
        <Pressable style={styles.primaryButton} onPress={() => {}}>
          <Text style={styles.primaryButtonText}>다음</Text>
        </Pressable>
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
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});

export default CreateStudyGroupScreen;
