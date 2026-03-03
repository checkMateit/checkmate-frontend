import React, { useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { colors } from '../../../styles/colors';
import { type MethodConfig } from './AuthMethodSection';

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
};

function AuthTimeControls({
  config,
  configKey,
  formatTime,
  onOpenTimePicker,
  onLocationTypeChange,
  onLocationNameChange,
  onLocationCoordsChange,
}: AuthTimeControlsProps) {
  const mapRef = useRef<MapView>(null);
  const defaultCenter = {
    latitude: DEFAULT_REGION.latitude,
    longitude: DEFAULT_REGION.longitude,
  };

  const handleZoomIn = () => {
    mapRef.current
      ?.getCamera()
      .then(
        (camera: { zoom?: number; center?: { latitude: number; longitude: number } }) => {
          const nextZoom = Math.min((camera.zoom ?? 15) + 1, 21);
          mapRef.current?.animateCamera({
            center: camera.center ?? defaultCenter,
            zoom: nextZoom,
          });
        },
      )
      .catch(() => {});
  };

  const handleZoomOut = () => {
    mapRef.current
      ?.getCamera()
      .then(
        (camera: { zoom?: number; center?: { latitude: number; longitude: number } }) => {
          const nextZoom = Math.max((camera.zoom ?? 15) - 1, 3);
          mapRef.current?.animateCamera({
            center: camera.center ?? defaultCenter,
            zoom: nextZoom,
          });
        },
      )
      .catch(() => {});
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
              <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={
                  config.locationLatitude != null && config.locationLongitude != null
                    ? {
                        latitude: config.locationLatitude,
                        longitude: config.locationLongitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                      }
                    : DEFAULT_REGION
                }
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
                  <Marker
                    coordinate={{
                      latitude: config.locationLatitude,
                      longitude: config.locationLongitude,
                    }}
                    title={config.locationName || '인증 위치'}
                  />
                ) : null}
              </MapView>
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
  map: {
    width: '100%',
    height: '100%',
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
