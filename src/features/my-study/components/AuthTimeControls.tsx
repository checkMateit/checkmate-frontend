import React, { useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../../../styles/colors';
import { type MethodConfig } from './AuthMethodSection';

type MapsModule = typeof import('react-native-maps');
const getMapsModule = (): MapsModule | null => {
  try {
    return require('react-native-maps') as MapsModule;
  } catch {
    return null;
  }
};

type TimeField = 'todoDeadline' | 'todoComplete' | 'rangeStart' | 'rangeEnd';
type ConfigKey = 'primary' | 'secondary';

const DEFAULT_REGION = {
  latitude: 37.5665,
  longitude: 126.978,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

type AuthTimeControlsProps = {
  config: MethodConfig;
  configKey: ConfigKey;
  formatTime: (value: Date) => string;
  onOpenTimePicker: (field: TimeField, key: ConfigKey) => void;
  onLocationTypeChange: (key: ConfigKey, type: '개인 위치' | '공통 위치') => void;
  onLocationNameChange: (key: ConfigKey, name: string) => void;
  onLocationCoordsChange: (key: ConfigKey, latitude: number, longitude: number) => void;
  onGithubRepoUrlChange?: (key: ConfigKey, value: string) => void;
  onGithubBranchChange?: (key: ConfigKey, value: string) => void;
};

function AuthTimeControls({
  config,
  configKey,
  formatTime,
  onOpenTimePicker,
  onLocationTypeChange,
  onLocationNameChange,
  onLocationCoordsChange,
  onGithubRepoUrlChange,
  onGithubBranchChange,
}: AuthTimeControlsProps) {
  const mapRef = useRef<any>(null);
  const mapsModule = getMapsModule();
  const MapComponent = mapsModule?.default;
  const MarkerComponent = mapsModule?.Marker;
  const initialRegion =
    config.locationLatitude != null && config.locationLongitude != null
      ? {
          latitude: config.locationLatitude,
          longitude: config.locationLongitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }
      : DEFAULT_REGION;
  const regionRef = useRef(initialRegion);
  const defaultCenter = {
    latitude: DEFAULT_REGION.latitude,
    longitude: DEFAULT_REGION.longitude,
  };

  const handleZoomIn = () => {
    const current = regionRef.current ?? { ...defaultCenter, latitudeDelta: 0.01, longitudeDelta: 0.01 };
    const next = {
      ...current,
      latitudeDelta: Math.max(current.latitudeDelta * 0.5, 0.0005),
      longitudeDelta: Math.max(current.longitudeDelta * 0.5, 0.0005),
    };
    regionRef.current = next;
    mapRef.current?.animateToRegion?.(next, 150);
  };

  const handleZoomOut = () => {
    const current = regionRef.current ?? { ...defaultCenter, latitudeDelta: 0.01, longitudeDelta: 0.01 };
    const next = {
      ...current,
      latitudeDelta: Math.min(current.latitudeDelta * 2, 60),
      longitudeDelta: Math.min(current.longitudeDelta * 2, 60),
    };
    regionRef.current = next;
    mapRef.current?.animateToRegion?.(next, 150);
  };

  if (config.method === 'TODO') {
    return (
      <View style={styles.timeRow}>
        <View style={styles.timeGroup}>
          <Text style={styles.timeLabel}>작성마감</Text>
          <Pressable
            style={styles.timeChip}
            onPress={() => onOpenTimePicker('todoDeadline', configKey)}
          >
            <Text style={styles.timeText}>{formatTime(config.todoDeadline)}</Text>
          </Pressable>
        </View>
        <View style={styles.timeGroup}>
          <Text style={styles.timeLabel}>완료시간</Text>
          <Pressable
            style={styles.timeChip}
            onPress={() => onOpenTimePicker('todoComplete', configKey)}
          >
            <Text style={styles.timeText}>{formatTime(config.todoComplete)}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (config.method === '위치') {
    return (
      <View style={styles.locationWrap}>
        <View style={styles.locationRow}>
          {(['개인 위치', '공통 위치'] as const).map((type) => {
            const isActive = config.locationType === type;
            return (
              <Pressable
                key={type}
                onPress={() => onLocationTypeChange(configKey, type)}
                style={[styles.locationChip, isActive && styles.locationChipActive]}
              >
                <Text
                  style={[styles.locationChipText, isActive && styles.locationChipTextActive]}
                >
                  {type}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {config.locationType === '공통 위치' ? (
          <>
            <View style={styles.locationInputWrap}>
              <TextInput
                value={config.locationName}
                onChangeText={(text) => onLocationNameChange(configKey, text)}
                placeholder="예) ○○도서관"
                placeholderTextColor="#B0B0B0"
                style={styles.locationInput}
              />
            </View>
            <View style={styles.mapWrap}>
              <Text style={styles.mapHint}>지도를 탭하여 인증 위치를 지정하세요</Text>
              {MapComponent && MarkerComponent ? (
                <>
                  <MapComponent
                    ref={mapRef}
                    style={styles.map}
                    initialRegion={initialRegion}
                    onRegionChangeComplete={(r: {
                      latitude: number;
                      longitude: number;
                      latitudeDelta: number;
                      longitudeDelta: number;
                    }) => {
                      regionRef.current = r;
                    }}
                    onPress={(e) => {
                      const { latitude, longitude } = e.nativeEvent.coordinate;
                      onLocationCoordsChange(configKey, latitude, longitude);
                    }}
                    scrollEnabled
                    zoomEnabled
                    pitchEnabled={false}
                    rotateEnabled={false}
                  >
                    {config.locationLatitude != null && config.locationLongitude != null ? (
                      <MarkerComponent
                        coordinate={{
                          latitude: config.locationLatitude,
                          longitude: config.locationLongitude,
                        }}
                        title={config.locationName || '인증 위치'}
                      />
                    ) : null}
                  </MapComponent>
                  <View style={styles.zoomButtons} pointerEvents="box-none">
                    <Pressable style={[styles.zoomButton, styles.zoomButtonFirst]} onPress={handleZoomIn}>
                      <Text style={styles.zoomButtonText}>+</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.zoomButton, styles.zoomButtonBottom]}
                      onPress={handleZoomOut}
                    >
                      <Text style={styles.zoomButtonText}>−</Text>
                    </Pressable>
                  </View>
                </>
              ) : (
                <View style={styles.mapUnavailable}>
                  <Text style={styles.mapUnavailableText}>지도를 불러오지 못했어요.</Text>
                </View>
              )}
            </View>
          </>
        ) : null}
        <View style={styles.timeRow}>
          <View style={styles.timeGroup}>
            <Text style={styles.timeLabel}>마감 시간</Text>
            <Pressable
              style={styles.timeChip}
              onPress={() => onOpenTimePicker('rangeEnd', configKey)}
            >
              <Text style={styles.timeText}>{formatTime(config.rangeEnd)}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  if (config.method === 'GitHub') {
    return (
      <View style={styles.githubWrap}>
        <View style={styles.locationInputWrap}>
          <Text style={styles.githubLabel}>저장소 URL</Text>
          <TextInput
            value={config.githubRepoUrl}
            onChangeText={(text) => onGithubRepoUrlChange?.(configKey, text)}
            placeholder="https://github.com/owner/repo 또는 owner/repo"
            placeholderTextColor="#B0B0B0"
            style={styles.locationInput}
          />
        </View>
        <View style={[styles.locationInputWrap, { marginTop: 8 }]}>
          <Text style={styles.githubLabel}>브랜치</Text>
          <TextInput
            value={config.githubBranch}
            onChangeText={(text) => onGithubBranchChange?.(configKey, text)}
            placeholder="main"
            placeholderTextColor="#B0B0B0"
            style={styles.locationInput}
          />
        </View>
        <View style={styles.timeRow}>
          <View style={styles.timeGroup}>
            <Text style={styles.timeLabel}>인증 마감 시간</Text>
            <Pressable
              style={styles.timeChip}
              onPress={() => onOpenTimePicker('rangeEnd', configKey)}
            >
              <Text style={styles.timeText}>{formatTime(config.rangeEnd)}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.timeRow}>
      <View style={styles.timeGroup}>
        <Text style={styles.timeLabel}>마감 시간</Text>
        <Pressable
          style={styles.timeChip}
          onPress={() => onOpenTimePicker('rangeEnd', configKey)}
        >
          <Text style={styles.timeText}>{formatTime(config.rangeEnd)}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 14,
    marginTop: 10,
    alignItems: 'center',
  },
  timeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeLabel: {
    fontSize: 11,
    color: '#9B9B9B',
    fontWeight: '700',
  },
  timeChip: {
    backgroundColor: '#EFEFEF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  locationWrap: {
    marginTop: 6,
    gap: 12,
  },
  locationRow: {
    flexDirection: 'row',
    gap: 12,
  },
  locationChip: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 9,
    backgroundColor: '#FFFFFF',
  },
  locationChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  locationChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  locationChipTextActive: {
    color: '#FFFFFF',
  },
  locationInputWrap: {
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 2,
  },
  locationInput: {
    fontSize: 14,
    color: colors.textPrimary,
    paddingVertical: 4,
  },
  mapWrap: {
    marginTop: 10,
    width: '100%',
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
    position: 'relative',
  },
  mapHint: {
    fontSize: 11,
    color: '#9B9B9B',
    marginBottom: 4,
  },
  githubWrap: {
    marginTop: 6,
    gap: 0,
  },
  githubLabel: {
    fontSize: 11,
    color: '#9B9B9B',
    fontWeight: '700',
    marginBottom: 4,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapUnavailable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F7F7',
  },
  mapUnavailableText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  zoomButtons: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    flexDirection: 'column',
    gap: 0,
  },
  zoomButton: {
    width: 36,
    height: 36,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  zoomButtonFirst: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  zoomButtonBottom: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  zoomButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 22,
  },
});

export default AuthTimeControls;
