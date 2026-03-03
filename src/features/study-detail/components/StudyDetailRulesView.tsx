import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import MapView, { Marker } from 'react-native-maps';
import { colors } from '../../../styles/colors';
import {
  fetchStudyGroupMembers,
  fetchVerificationRules,
} from '../../../api/studyGroups';
import type {
  StudyGroupMemberRes,
  VerificationRuleRes,
} from '../../../api/studyGroups';
import {
  getGpsLocations,
  addGpsLocation,
  type GpsLocationRes,
} from '../../../api/verification';
import { patchVerificationRule, type VerificationRulePatchPayload } from '../../../api/studyGroups';
import type { MethodConfig } from '../../my-study/components/AuthMethodSection';
import AuthTimeControls from '../../my-study/components/AuthTimeControls';
import WeekdayPicker from '../../my-study/components/WeekdayPicker';
import TimePickerModal from '../../my-study/components/TimePickerModal';

const backIcon = require('../../../assets/icon/left_arrow.png');
const editIcon = require('../../../assets/icon/modify_icon.png');

const METHOD_LABEL: Record<string, string> = {
  PHOTO: '사진',
  CHECKLIST: 'TODO',
  GPS: '위치',
  GITHUB: 'GITHUB',
};

const METHOD_REVERSE: Record<string, '사진' | '위치' | 'TODO' | 'GitHub'> = {
  PHOTO: '사진',
  GPS: '위치',
  CHECKLIST: 'TODO',
  GITHUB: 'GitHub',
};

const DAY_REVERSE: Record<string, string> = {
  MON: '월',
  TUE: '화',
  WED: '수',
  THU: '목',
  FRI: '금',
  SAT: '토',
  SUN: '일',
};

const DAY_MAP: Record<string, string> = {
  월: 'MON',
  화: 'TUE',
  수: 'WED',
  목: 'THU',
  금: 'FRI',
  토: 'SAT',
  일: 'SUN',
};

const METHOD_MAP: Record<string, string> = {
  사진: 'PHOTO',
  위치: 'GPS',
  TODO: 'CHECKLIST',
  GitHub: 'GITHUB',
};

function parseTimeToDate(timeStr: string): Date {
  const [h, m] = (timeStr || '10:00').split(':').map(Number);
  const d = new Date();
  d.setHours(h ?? 10, m ?? 0, 0, 0);
  return d;
}

function ruleToMethodConfig(rule: VerificationRuleRes): MethodConfig {
  const details = rule.methodDetails ?? {};
  const gps = details.gps ?? {};
  const method = METHOD_REVERSE[rule.methodCode] ?? 'TODO';
  const endTime = parseTimeToDate(rule.endTime ?? '10:00');
  const checkEndTime = rule.checkEndTime
    ? parseTimeToDate(rule.checkEndTime)
    : parseTimeToDate('22:00');
  const locations = Array.isArray((gps as { locations?: unknown[] }).locations)
    ? (gps as { locations: Array<{ name?: string; latitude?: number; longitude?: number }> }).locations
    : [];
  const radiusMode = (gps as { radius_mode?: string }).radius_mode?.toUpperCase();
  const isCommon = radiusMode === 'COMMON' || (radiusMode !== 'PER_LOCATION' && locations.length > 0);
  const loc0 = locations[0];
  return {
    method,
    todoDeadline: method === 'TODO' ? endTime : parseTimeToDate('10:00'),
    todoComplete: method === 'TODO' ? checkEndTime : parseTimeToDate('22:00'),
    rangeStart: endTime,
    rangeEnd: endTime,
    locationType: isCommon ? '공통 위치' : '개인 위치',
    locationName: loc0?.name ?? '',
    locationLatitude: loc0?.latitude ?? null,
    locationLongitude: loc0?.longitude ?? null,
  };
}

function displayName(member: StudyGroupMemberRes): string {
  if (member.nickname?.trim()) return member.nickname.trim();
  if (member.role === 'Leader') return '방장';
  const short = member.userId.replace(/-/g, '').slice(-8);
  return short ? `…${short}` : '방장';
}

type LocationPoint = { name?: string; latitude?: number; longitude?: number };

function VerificationLocationMap({ locations }: { locations: LocationPoint[] }) {
  const mapRef = useRef<MapView>(null);
  const points = locations.filter(
    (loc): loc is LocationPoint & { latitude: number; longitude: number } =>
      typeof loc.latitude === 'number' &&
      typeof loc.longitude === 'number' &&
      Number.isFinite(loc.latitude) &&
      Number.isFinite(loc.longitude),
  );
  if (points.length === 0) return null;

  const lats = points.map((p) => p.latitude);
  const lngs = points.map((p) => p.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const padding = 0.002;
  const region = {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max(maxLat - minLat + padding * 2, 0.005),
    longitudeDelta: Math.max(maxLng - minLng + padding * 2, 0.005),
  };

  const handleZoomIn = () => {
    mapRef.current?.getCamera().then((camera: { zoom?: number; center?: { latitude: number; longitude: number } }) => {
      const nextZoom = Math.min((camera.zoom ?? 15) + 1, 21);
      mapRef.current?.animateCamera({
        center: camera.center ?? { latitude: region.latitude, longitude: region.longitude },
        zoom: nextZoom,
      });
    }).catch(() => {});
  };

  const handleZoomOut = () => {
    mapRef.current?.getCamera().then((camera: { zoom?: number; center?: { latitude: number; longitude: number } }) => {
      const nextZoom = Math.max((camera.zoom ?? 15) - 1, 3);
      mapRef.current?.animateCamera({
        center: camera.center ?? { latitude: region.latitude, longitude: region.longitude },
        zoom: nextZoom,
      });
    }).catch(() => {});
  };

  return (
    <View style={styles.mapWrap}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        scrollEnabled
        zoomEnabled
        pitchEnabled={false}
        rotateEnabled={false}
      >
        {points.map((p, idx) => (
          <Marker
            key={`${p.latitude}-${p.longitude}-${idx}`}
            coordinate={{ latitude: p.latitude, longitude: p.longitude }}
            title={p.name ?? undefined}
          />
        ))}
      </MapView>
      <View style={styles.zoomButtons} pointerEvents="box-none">
        <Pressable style={[styles.zoomButton, styles.zoomButtonFirst]} onPress={handleZoomIn}>
          <Text style={styles.zoomButtonText}>+</Text>
        </Pressable>
        <Pressable style={[styles.zoomButton, styles.zoomButtonBottom]} onPress={handleZoomOut}>
          <Text style={styles.zoomButtonText}>−</Text>
        </Pressable>
      </View>
    </View>
  );
}

const DEFAULT_REGION = {
  latitude: 37.5665,
  longitude: 126.978,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

function AddLocationMap({
  latitude,
  longitude,
  onCoordsChange,
}: {
  latitude: number | null;
  longitude: number | null;
  onCoordsChange: (lat: number, lng: number) => void;
}) {
  const mapRef = useRef<MapView>(null);
  const center =
    latitude != null && longitude != null
      ? { latitude, longitude }
      : { latitude: DEFAULT_REGION.latitude, longitude: DEFAULT_REGION.longitude };

  const handleZoomIn = () => {
    mapRef.current?.getCamera().then((camera: { zoom?: number; center?: { latitude: number; longitude: number } }) => {
      const nextZoom = Math.min((camera.zoom ?? 15) + 1, 21);
      mapRef.current?.animateCamera({
        center: camera.center ?? center,
        zoom: nextZoom,
      });
    }).catch(() => {});
  };

  const handleZoomOut = () => {
    mapRef.current?.getCamera().then((camera: { zoom?: number; center?: { latitude: number; longitude: number } }) => {
      const nextZoom = Math.max((camera.zoom ?? 15) - 1, 3);
      mapRef.current?.animateCamera({
        center: camera.center ?? center,
        zoom: nextZoom,
      });
    }).catch(() => {});
  };

  return (
    <View style={styles.modalMapWrap}>
      <MapView
        ref={mapRef}
        style={styles.modalMap}
        initialRegion={
          latitude != null && longitude != null
            ? { latitude, longitude, latitudeDelta: 0.005, longitudeDelta: 0.005 }
            : DEFAULT_REGION
        }
        onPress={(e) => {
          const { latitude: lat, longitude: lng } = e.nativeEvent.coordinate;
          onCoordsChange(lat, lng);
        }}
        scrollEnabled
        zoomEnabled
        pitchEnabled={false}
        rotateEnabled={false}
      >
        {latitude != null && longitude != null ? (
          <Marker coordinate={{ latitude, longitude }} title="인증 위치" />
        ) : null}
      </MapView>
      <View style={[styles.zoomButtons, { right: 10, bottom: 10 }]} pointerEvents="box-none">
        <Pressable style={[styles.zoomButton, styles.zoomButtonFirst]} onPress={handleZoomIn}>
          <Text style={styles.zoomButtonText}>+</Text>
        </Pressable>
        <Pressable style={[styles.zoomButton, styles.zoomButtonBottom]} onPress={handleZoomOut}>
          <Text style={styles.zoomButtonText}>−</Text>
        </Pressable>
      </View>
    </View>
  );
}

type StudyDetailRulesViewProps = {
  groupId: string;
  currentUserId: string | null;
  onBack: () => void;
  onEditRule?: (groupId: string, slot: number) => void;
};

function StudyDetailRulesView({
  groupId,
  currentUserId,
  onBack,
  onEditRule,
}: StudyDetailRulesViewProps) {
  const [rules, setRules] = useState<VerificationRuleRes[]>([]);
  const [members, setMembers] = useState<StudyGroupMemberRes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [myGpsLocationsBySlot, setMyGpsLocationsBySlot] = useState<Record<number, GpsLocationRes[]>>({});
  const [addLocationSlot, setAddLocationSlot] = useState<number | null>(null);
  const [addLocationName, setAddLocationName] = useState('');
  const [addLocationLat, setAddLocationLat] = useState<number | null>(null);
  const [addLocationLng, setAddLocationLng] = useState<number | null>(null);
  const [addLocationSubmitting, setAddLocationSubmitting] = useState(false);

  const [editRuleSlot, setEditRuleSlot] = useState<number | null>(null);
  const [editConfig, setEditConfig] = useState<MethodConfig | null>(null);
  const [editDays, setEditDays] = useState<string[]>([]);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [showEditTimePicker, setShowEditTimePicker] = useState(false);
  const [editTimeField, setEditTimeField] = useState<
    'todoDeadline' | 'todoComplete' | 'rangeStart' | 'rangeEnd'
  >('rangeEnd');
  const [tempTime, setTempTime] = useState(new Date());
  const [editRuleDetail, setEditRuleDetail] = useState<VerificationRuleRes | null>(null);

  const loadMyGpsLocationsForSlot = useCallback(
    async (slot: number) => {
      try {
        const res = await getGpsLocations(groupId, slot);
        const list = res.data?.data ?? [];
        setMyGpsLocationsBySlot((prev) => ({ ...prev, [slot]: list }));
      } catch {
        setMyGpsLocationsBySlot((prev) => ({ ...prev, [slot]: [] }));
      }
    },
    [groupId],
  );

  const openEditRuleModal = useCallback((rule: VerificationRuleRes) => {
    setEditRuleSlot(rule.slot);
    setEditRuleDetail(rule);
    setEditConfig(ruleToMethodConfig(rule));
    setEditDays(
      (rule.daysOfWeek ?? []).map((d) => DAY_REVERSE[d] ?? d).filter(Boolean).length > 0
        ? (rule.daysOfWeek ?? []).map((d) => DAY_REVERSE[d] ?? d)
        : ['월', '화'],
    );
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [rulesRes, membersRes] = await Promise.all([
        fetchVerificationRules(groupId),
        fetchStudyGroupMembers(groupId),
      ]);
      const rulesOk =
        rulesRes.data &&
        (rulesRes.data.isSuccess === true ||
          (rulesRes.data as { success?: boolean }).success === true);
      if (rulesOk && Array.isArray(rulesRes.data?.data)) {
        const rulesList = rulesRes.data.data as VerificationRuleRes[];
        setRules(rulesList);
        const perLocationSlots = rulesList
          .filter(
            (r) =>
              r.methodCode === 'GPS' &&
              (r.methodDetails?.gps?.radius_mode?.toUpperCase() === 'PER_LOCATION'),
          )
          .map((r) => r.slot);
        const nextBySlot: Record<number, GpsLocationRes[]> = {};
        for (const slot of perLocationSlots) {
          try {
            const locRes = await getGpsLocations(groupId, slot);
            nextBySlot[slot] = locRes.data?.data ?? [];
          } catch {
            nextBySlot[slot] = [];
          }
        }
        setMyGpsLocationsBySlot((prev) => ({ ...prev, ...nextBySlot }));
      } else {
        setRules([]);
      }
      const membersOk =
        membersRes.data &&
        (membersRes.data.isSuccess === true ||
          (membersRes.data as { success?: boolean }).success === true);
      if (membersOk && Array.isArray(membersRes.data?.data)) {
        setMembers(membersRes.data.data);
      } else {
        setMembers([]);
      }
    } catch {
      setRules([]);
      setMembers([]);
      setError('상세 규칙을 불러오지 못했어요.');
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const leader = members.find((m) => m.role === 'Leader');
  const hostName = leader ? displayName(leader) : '방장';
  const isOwner = Boolean(
    currentUserId && leader && leader.userId === currentUserId,
  );

  const formatTime = useCallback((value: Date) => {
    const h = value.getHours().toString().padStart(2, '0');
    const m = value.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  }, []);

  const buildEditPayload = useCallback((): VerificationRulePatchPayload | null => {
    if (!editConfig || editRuleSlot == null) return null;
    const endTime =
      editConfig.method === 'TODO'
        ? formatTime(editConfig.todoDeadline)
        : formatTime(editConfig.rangeEnd);
    const checkEndTime =
      editConfig.method === 'TODO' ? formatTime(editConfig.todoComplete) : null;
    const daysOfWeek =
      editDays.length > 0 ? editDays.map((d) => DAY_MAP[d] ?? d).filter(Boolean) : ['MON'];
    const methodCode = METHOD_MAP[editConfig.method] ?? 'PHOTO';
    const method: VerificationRulePatchPayload['method'] = { methodCode };
    if (editConfig.method === '사진') {
      method.photo = { minFiles: 1, maxFiles: 3, source: 'ALLOW_ALBUM' };
    }
    if (editConfig.method === '위치') {
      const isCommon = editConfig.locationType === '공통 위치';
      const hasCommonLocation =
        isCommon &&
        (editConfig.locationName?.trim() ?? '') !== '' &&
        editConfig.locationLatitude != null &&
        editConfig.locationLongitude != null;
      (method as { gps?: { radiusMode?: string; radiusM: number; locations: unknown[]; blockOutsideTime: boolean } }).gps = {
        radiusMode: isCommon ? 'COMMON' : 'PER_LOCATION',
        radiusM: 100,
        locations: hasCommonLocation
          ? [
              {
                name: editConfig.locationName!.trim(),
                latitude: editConfig.locationLatitude,
                longitude: editConfig.locationLongitude,
              },
            ]
          : [],
        blockOutsideTime: true,
      };
    }
    if (editConfig.method === 'GitHub' && editRuleDetail?.methodDetails?.github) {
      method.github = {
        repoUrl: editRuleDetail.methodDetails.github.repo_url ?? '',
        branch: editRuleDetail.methodDetails.github.branch ?? 'main',
      };
    }
    return {
      schedule: {
        endTime,
        checkEndTime: checkEndTime ?? undefined,
        daysOfWeek,
        timezone: 'Asia/Seoul',
      },
      frequency: { unit: 'DAY', requiredCnt: 1 },
      method,
      exemption: { isEnabled: false, limitUnit: 'TOTAL', limitCnt: 0 },
    };
  }, [editConfig, editDays, editRuleDetail, formatTime]);

  const handleSaveEditRule = useCallback(async () => {
    if (editRuleSlot == null || !editConfig) return;
    const needLocationCoords =
      editConfig.method === '위치' &&
      editConfig.locationType === '공통 위치' &&
      (editConfig.locationName?.trim() ?? '') !== '' &&
      (editConfig.locationLatitude == null || editConfig.locationLongitude == null);
    if (needLocationCoords) {
      Alert.alert(
        '안내',
        '공통 위치를 사용할 때는 위치 이름을 입력한 뒤 지도에서 인증 위치를 지정해주세요.',
      );
      return;
    }
    const payload = buildEditPayload();
    if (!payload) return;
    setEditSubmitting(true);
    try {
      await patchVerificationRule(groupId, editRuleSlot, payload);
      await loadData();
      setEditRuleSlot(null);
      setEditConfig(null);
      setEditRuleDetail(null);
    } catch {
      Alert.alert('수정 실패', '규칙 수정에 실패했어요.');
    } finally {
      setEditSubmitting(false);
    }
  }, [editRuleSlot, editConfig, buildEditPayload, groupId, loadData]);

  const openEditTimePicker = useCallback(
    (field: 'todoDeadline' | 'todoComplete' | 'rangeStart' | 'rangeEnd') => {
      if (!editConfig) return;
      setEditTimeField(field);
      setTempTime(editConfig[field]);
      setShowEditTimePicker(true);
    },
    [editConfig],
  );

  const handleEditTimeChange = useCallback((_e: DateTimePickerEvent, date?: Date) => {
    if (!date) return;
    if (Platform.OS === 'android') {
      setEditConfig((prev) => (prev ? { ...prev, [editTimeField]: date } : prev));
      setShowEditTimePicker(false);
      return;
    }
    setTempTime(date);
  }, [editTimeField]);

  const applyEditTime = useCallback(() => {
    setEditConfig((prev) => (prev ? { ...prev, [editTimeField]: tempTime } : prev));
    setShowEditTimePicker(false);
  }, [editTimeField, tempTime]);

  function renderRuleBlock(rule: VerificationRuleRes) {
    const { methodCode, endTime, checkEndTime, methodDetails } = rule;
    const details = methodDetails ?? {};
    const label = METHOD_LABEL[methodCode] ?? methodCode;

    if (methodCode === 'PHOTO') {
      const photo = details.photo ?? {};
      return (
        <View key={`slot-${rule.slot}`} style={styles.ruleBlock}>
          <View style={styles.ruleBlockHeader}>
            <Text style={styles.ruleBlockTitle}>{rule.slot}. {label}</Text>
            {isOwner && onEditRule && (
              <Pressable
                style={styles.editButton}
                onPress={() => openEditRuleModal(rule)}
                hitSlop={8}
              >
                <Image source={editIcon} style={styles.editIcon} resizeMode="contain" />
              </Pressable>
            )}
          </View>
          <View style={styles.ruleRows}>
            <View style={styles.ruleRow}>
              <Text style={styles.ruleLabel}>마감 시각</Text>
              <Text style={styles.ruleValue}>{endTime || '-'}</Text>
            </View>
            <View style={styles.ruleRow}>
              <Text style={styles.ruleLabel}>최소 파일 수</Text>
              <Text style={styles.ruleValue}>
                {photo.min_files != null ? photo.min_files : '-'}
              </Text>
            </View>
            <View style={styles.ruleRow}>
              <Text style={styles.ruleLabel}>최대 파일 수</Text>
              <Text style={styles.ruleValue}>
                {photo.max_files != null ? photo.max_files : '-'}
              </Text>
            </View>
            <View style={styles.ruleRow}>
              <Text style={styles.ruleLabel}>최대 파일 크기</Text>
              <Text style={styles.ruleValue}>
                {photo.max_size != null ? `${photo.max_size}MB` : '-'}
              </Text>
            </View>
            <View style={[styles.ruleRow, styles.ruleRowLast]}>
              <Text style={styles.ruleLabel}>허용 확장자</Text>
              <Text style={styles.ruleValue}>
                {Array.isArray(photo.allowed_extensions) && photo.allowed_extensions.length > 0
                  ? photo.allowed_extensions.join(', ')
                  : '-'}
              </Text>
            </View>
          </View>
        </View>
      );
    }

    if (methodCode === 'CHECKLIST') {
      return (
        <View key={`slot-${rule.slot}`} style={styles.ruleBlock}>
          <View style={styles.ruleBlockHeader}>
            <Text style={styles.ruleBlockTitle}>{rule.slot}. {label}</Text>
            {isOwner && onEditRule && (
              <Pressable
                style={styles.editButton}
                onPress={() => openEditRuleModal(rule)}
                hitSlop={8}
              >
                <Image source={editIcon} style={styles.editIcon} resizeMode="contain" />
              </Pressable>
            )}
          </View>
          <View style={styles.ruleRows}>
            <View style={styles.ruleRow}>
              <Text style={styles.ruleLabel}>작성 마감 시각</Text>
              <Text style={styles.ruleValue}>{endTime || '-'}</Text>
            </View>
            <View style={[styles.ruleRow, styles.ruleRowLast]}>
              <Text style={styles.ruleLabel}>인증 마감 시각</Text>
              <Text style={styles.ruleValue}>{checkEndTime || '-'}</Text>
            </View>
          </View>
        </View>
      );
    }

    if (methodCode === 'GITHUB') {
      const github = details.github ?? {};
      return (
        <View key={`slot-${rule.slot}`} style={styles.ruleBlock}>
          <View style={styles.ruleBlockHeader}>
            <Text style={styles.ruleBlockTitle}>{rule.slot}. {label}</Text>
            {isOwner && onEditRule && (
              <Pressable
                style={styles.editButton}
                onPress={() => openEditRuleModal(rule)}
                hitSlop={8}
              >
                <Image source={editIcon} style={styles.editIcon} resizeMode="contain" />
              </Pressable>
            )}
          </View>
          <View style={styles.ruleRows}>
            <View style={styles.ruleRow}>
              <Text style={styles.ruleLabel}>마감 시각</Text>
              <Text style={styles.ruleValue}>{endTime || '-'}</Text>
            </View>
            <View style={styles.ruleRow}>
              <Text style={styles.ruleLabel}>레포 명</Text>
              <Text style={styles.ruleValue} numberOfLines={1}>
                {github.repo_url ?? '-'}
              </Text>
            </View>
            <View style={[styles.ruleRow, styles.ruleRowLast]}>
              <Text style={styles.ruleLabel}>브랜치 명</Text>
              <Text style={styles.ruleValue}>{github.branch ?? '-'}</Text>
            </View>
          </View>
        </View>
      );
    }

    if (methodCode === 'GPS') {
      const gps = details.gps ?? {};
      const locations = Array.isArray(gps.locations) ? gps.locations : [];
      const radiusMode = (gps as { radius_mode?: string }).radius_mode?.toUpperCase();
      const isCommon = radiusMode === 'COMMON' || (radiusMode !== 'PER_LOCATION' && locations.length > 0);
      const subLabel = isCommon ? '위치 - 공통 위치' : '위치 - 개인 위치';
      const myLocations = myGpsLocationsBySlot[rule.slot] ?? [];

      if (isCommon) {
        const loc = locations[0];
        const locationName = loc?.name ?? '-';
        return (
          <View key={`slot-${rule.slot}`} style={styles.ruleBlock}>
            <View style={styles.ruleBlockHeader}>
              <Text style={styles.ruleBlockTitle}>{rule.slot}. {subLabel}</Text>
              {isOwner && onEditRule && (
                <Pressable
                  style={styles.editButton}
                  onPress={() => openEditRuleModal(rule)}
                  hitSlop={8}
                >
                  <Image source={editIcon} style={styles.editIcon} resizeMode="contain" />
                </Pressable>
              )}
            </View>
            <View style={styles.ruleRows}>
              <View style={styles.ruleRow}>
                <Text style={styles.ruleLabel}>마감 시각</Text>
                <Text style={styles.ruleValue}>{endTime || '-'}</Text>
              </View>
              <View style={[styles.ruleRow, styles.ruleRowLast]}>
                <Text style={styles.ruleLabel}>공통 위치</Text>
                <Text style={styles.ruleValue}>{locationName}</Text>
              </View>
            </View>
            <VerificationLocationMap locations={locations} />
          </View>
        );
      }

      const openAddLocationModal = () => {
        setAddLocationSlot(rule.slot);
        setAddLocationName('');
        setAddLocationLat(null);
        setAddLocationLng(null);
      };

      const locationNameDisplay =
        myLocations.length === 0
          ? null
          : myLocations.map((l) => l.name || '이름 없음').join(', ');
      const myLocationsAsPoints: LocationPoint[] = myLocations.map((l) => ({
        name: l.name,
        latitude: l.latitude,
        longitude: l.longitude,
      }));

      return (
        <View key={`slot-${rule.slot}`} style={styles.ruleBlock}>
          <View style={styles.ruleBlockHeader}>
            <Text style={styles.ruleBlockTitle}>{rule.slot}. {subLabel}</Text>
            {isOwner && onEditRule && (
              <Pressable
                style={styles.editButton}
                onPress={() => openEditRuleModal(rule)}
                hitSlop={8}
              >
                <Image source={editIcon} style={styles.editIcon} resizeMode="contain" />
              </Pressable>
            )}
          </View>
          <View style={styles.ruleRows}>
            <View style={styles.ruleRow}>
              <Text style={styles.ruleLabel}>마감 시각</Text>
              <Text style={styles.ruleValue}>{endTime || '-'}</Text>
            </View>
            <View style={[styles.ruleRow, styles.ruleRowLast]}>
              <Text style={styles.ruleLabel}>개인 위치</Text>
              <View style={styles.ruleValueWrap}>
                {myLocations.length === 0 ? (
                  <Pressable style={styles.addLocationButton} onPress={openAddLocationModal}>
                    <Text style={styles.addLocationButtonText}>내 위치 등록</Text>
                  </Pressable>
                ) : (
                  <Text style={styles.ruleValue}>{locationNameDisplay}</Text>
                )}
              </View>
            </View>
          </View>
          {myLocations.length > 0 ? (
            <VerificationLocationMap locations={myLocationsAsPoints} />
          ) : null}
        </View>
      );
    }

    return (
      <View key={`slot-${rule.slot}`} style={styles.ruleBlock}>
        <View style={styles.ruleBlockHeader}>
          <Text style={styles.ruleBlockTitle}>{rule.slot}. {label}</Text>
          {isOwner && onEditRule && (
            <Pressable
              style={styles.editButton}
              onPress={() => openEditRuleModal(rule)}
              hitSlop={8}
            >
              <Image source={editIcon} style={styles.editIcon} resizeMode="contain" />
            </Pressable>
          )}
        </View>
        <View style={styles.ruleRows}>
          <View style={[styles.ruleRow, styles.ruleRowLast]}>
            <Text style={styles.ruleLabel}>마감 시각</Text>
            <Text style={styles.ruleValue}>{endTime || '-'}</Text>
          </View>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Pressable onPress={onBack} style={styles.backButton} hitSlop={12}>
            <Image source={backIcon} style={styles.backIcon} resizeMode="contain" />
          </Pressable>
        </View>
        <View style={styles.card}>
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loadingText}>상세 규칙 불러오는 중…</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable onPress={onBack} style={styles.backButton} hitSlop={12}>
          <Image source={backIcon} style={styles.backIcon} resizeMode="contain" />
        </Pressable>
      </View>
      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <View style={styles.cardTitleLeft}>
            <Text style={styles.cardTitle}>상세 규칙</Text>
          </View>
          <Text style={styles.hostName} numberOfLines={1}>
            {hostName}
          </Text>
        </View>
        <Text style={styles.disclaimer}>
          규칙 위반 시 방장의 권한으로 퇴장 당할 수 있습니다.
        </Text>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : rules.length === 0 ? (
          <Text style={styles.emptyText}>등록된 인증 규칙이 없습니다.</Text>
        ) : (
          <View style={styles.ruleBlocks}>
            {rules.map(renderRuleBlock)}
          </View>
        )}
      </View>

      <Modal
        visible={addLocationSlot != null}
        transparent
        animationType="fade"
        onRequestClose={() => setAddLocationSlot(null)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setAddLocationSlot(null)}
        >
          <Pressable style={styles.modalBox} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>내 위치 등록</Text>
            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>위치 이름</Text>
              <TextInput
                style={styles.modalInput}
                value={addLocationName}
                onChangeText={setAddLocationName}
                placeholder="예) 집, 도서관"
                placeholderTextColor="#B0B0B0"
              />
            </View>
            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>지도를 탭하여 위치를 지정하세요</Text>
              <AddLocationMap
                latitude={addLocationLat}
                longitude={addLocationLng}
                onCoordsChange={(lat, lng) => {
                  setAddLocationLat(lat);
                  setAddLocationLng(lng);
                }}
              />
            </View>
            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => setAddLocationSlot(null)}
              >
                <Text style={styles.modalButtonText}>취소</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.modalButtonPrimary]}
                disabled={
                  !addLocationName.trim() ||
                  addLocationLat == null ||
                  addLocationLng == null ||
                  addLocationSubmitting
                }
                onPress={async () => {
                  if (addLocationSlot == null || addLocationLat == null || addLocationLng == null) return;
                  const name = addLocationName.trim();
                  if (!name) return;
                  setAddLocationSubmitting(true);
                  try {
                    await addGpsLocation(groupId, addLocationSlot, {
                      name,
                      latitude: addLocationLat,
                      longitude: addLocationLng,
                    });
                    await loadMyGpsLocationsForSlot(addLocationSlot);
                    setAddLocationSlot(null);
                    setAddLocationName('');
                    setAddLocationLat(null);
                    setAddLocationLng(null);
                  } catch {
                    Alert.alert('등록 실패', '위치 등록에 실패했어요.');
                  } finally {
                    setAddLocationSubmitting(false);
                  }
                }}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>
                  {addLocationSubmitting ? '등록 중…' : '등록'}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={editRuleSlot != null && editConfig != null}
        transparent
        animationType="fade"
        onRequestClose={() => { setEditRuleSlot(null); setEditConfig(null); setEditRuleDetail(null); }}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => { setEditRuleSlot(null); setEditConfig(null); setEditRuleDetail(null); }}
        >
          <Pressable
            style={[styles.modalBox, styles.editRuleModalBox]}
            onPress={(e) => e.stopPropagation()}
          >
            <ScrollView
              style={styles.editRuleScroll}
              contentContainerStyle={styles.editRuleScrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.modalTitle}>
                규칙 수정 (슬롯 {editRuleSlot})
              </Text>
              {editConfig && (
                <>
                  <View style={styles.editRuleSection}>
                    <Text style={styles.editRuleSectionTitle}>인증 방식</Text>
                    <View style={styles.editRuleChipRow}>
                      {(['사진', '위치', 'TODO', 'GitHub'] as const).map((method) => {
                        const isActive = editConfig.method === method;
                        return (
                          <Pressable
                            key={method}
                            style={[styles.editRuleChip, isActive && styles.editRuleChipActive]}
                            onPress={() => setEditConfig((prev) => (prev ? { ...prev, method } : prev))}
                          >
                            <Text
                              style={[
                                styles.editRuleChipText,
                                isActive && styles.editRuleChipTextActive,
                              ]}
                            >
                              {method}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                  <View style={styles.editRuleSection}>
                    <Text style={styles.editRuleSectionTitle}>
                      {editConfig.method === '위치' ? '인증 위치' : '인증 시간'}
                    </Text>
                    <AuthTimeControls
                      config={editConfig}
                      configKey="primary"
                      formatTime={formatTime}
                      onOpenTimePicker={(field) => openEditTimePicker(field)}
                      onLocationTypeChange={(_key, type) =>
                        setEditConfig((prev) => (prev ? { ...prev, locationType: type } : prev))
                      }
                      onLocationNameChange={(_key, name) =>
                        setEditConfig((prev) => (prev ? { ...prev, locationName: name } : prev))
                      }
                      onLocationCoordsChange={(_key, latitude, longitude) =>
                        setEditConfig((prev) =>
                          prev ? { ...prev, locationLatitude: latitude, locationLongitude: longitude } : prev,
                        )
                      }
                    />
                  </View>
                  <View style={styles.editRuleSection}>
                    <WeekdayPicker value={editDays} onChange={setEditDays} />
                  </View>
                </>
              )}
              <View style={styles.modalActions}>
                <Pressable
                  style={[styles.modalButton, styles.modalButtonSecondary]}
                  onPress={() => {
                    setEditRuleSlot(null);
                    setEditConfig(null);
                    setEditRuleDetail(null);
                  }}
                >
                  <Text style={styles.modalButtonText}>취소</Text>
                </Pressable>
                <Pressable
                  style={[styles.modalButton, styles.modalButtonPrimary]}
                  onPress={handleSaveEditRule}
                  disabled={editSubmitting}
                >
                  <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>
                    {editSubmitting ? '저장 중…' : '저장'}
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      <TimePickerModal
        visible={showEditTimePicker}
        title={
          editTimeField === 'todoDeadline'
            ? '작성마감 시간'
            : editTimeField === 'todoComplete'
              ? '완료시간'
              : editTimeField === 'rangeStart'
                ? '인증시간'
                : '마감 시간'
        }
        selectedTime={editConfig?.[editTimeField] ?? tempTime}
        tempTime={tempTime}
        onChange={handleEditTimeChange}
        onApply={applyEditTime}
        onClose={() => setShowEditTimePicker(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    paddingVertical: 8,
    paddingRight: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  editButton: {
    padding: 4,
  },
  editIcon: {
    width: 22,
    height: 22,
    tintColor: colors.textSecondary,
  },
  hostName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    maxWidth: 120,
  },
  disclaimer: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 20,
  },
  loadingWrap: {
    paddingVertical: 28,
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: 14,
    color: colors.textSecondary,
    paddingVertical: 12,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    paddingVertical: 12,
  },
  ruleBlocks: {
    gap: 20,
  },
  ruleBlock: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  ruleBlockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  ruleBlockTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
  },
  ruleRows: {
    gap: 0,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  ruleRowLast: {
    borderBottomWidth: 0,
  },
  ruleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    width: 110,
  },
  ruleValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    flex: 1,
  },
  ruleValueWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mapWrap: {
    marginTop: 12,
    width: '100%',
    height: 140,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
    position: 'relative',
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
  zoomButtonBottom: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  zoomButtonFirst: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  zoomButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 22,
  },
  addLocationButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: colors.primary,
    borderRadius: 18,
  },
  addLocationButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  modalField: {
    marginBottom: 12,
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.textPrimary,
  },
  modalMapWrap: {
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
    marginTop: 8,
    position: 'relative',
  },
  modalMap: {
    width: '100%',
    height: '100%',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: colors.primary,
  },
  modalButtonSecondary: {
    backgroundColor: '#EFEFEF',
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  modalButtonTextPrimary: {
    color: '#FFFFFF',
  },
  editRuleModalBox: {
    maxHeight: '90%',
    width: '100%',
  },
  editRuleScroll: {
    maxHeight: 480,
  },
  editRuleScrollContent: {
    paddingBottom: 24,
  },
  editRuleSection: {
    marginTop: 20,
  },
  editRuleSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  editRuleChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  editRuleChip: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 9,
    backgroundColor: '#FFFFFF',
  },
  editRuleChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  editRuleChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  editRuleChipTextActive: {
    color: '#FFFFFF',
  },
});

export default StudyDetailRulesView;
