import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image, ScrollView, Alert, } from 'react-native';
import { BADGE_IMAGE_MAP } from '../../../constants/icons';
import { createBadge, updateBadge } from '../../../api/badges';

const AdminBadgeWriteScreen = ({ editData, onClose }: any) => {
  const [name, setName] = useState(editData?.name || '');
  const [description, setDescription] = useState(editData?.description || '');
  // DB의 imageUrl 필드에 'badge_1' 같은 키값을 저장함
  const [selectedKey, setSelectedKey] = useState(editData?.imageUrl || 'badge_1');

  const handleSubmit = async () => {
    const payload = { name, description, imageUrl: selectedKey };
    try {
      if (editData) {
        await updateBadge(editData.badgeId, payload);
      } else {
        await createBadge(payload);
      }
      onClose(true); // 성공 시 리스트 새로고침
    } catch (e) {
      Alert.alert('오류', '저장 실패');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>뱃지 이름</Text>
      <TextInput value={name} onChangeText={setName} style={styles.input} />

      <Text style={styles.label}>뱃지 설명</Text>
      <TextInput value={description} onChangeText={setDescription} style={styles.input} />

      <Text style={styles.label}>이미지 선택 (로컬 에셋)</Text>
      <View style={styles.imageGrid}>
        {Object.keys(BADGE_IMAGE_MAP).map((key) => (
          <Pressable 
            key={key} 
            onPress={() => setSelectedKey(key)}
            style={[styles.imageItem, selectedKey === key && styles.selectedItem]}
          >
            <Image source={BADGE_IMAGE_MAP[key]} style={styles.previewImage} />
            <Text style={styles.imageText}>{key}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable onPress={handleSubmit} style={styles.saveBtn}>
        <Text style={styles.saveBtnText}>저장하기</Text>
      </Pressable>
      <Pressable onPress={() => onClose(false)} style={styles.cancelBtn}>
        <Text>취소</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#FFF' },
  label: { fontWeight: 'bold', marginTop: 15, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#DDD', padding: 10, borderRadius: 5 },
  imageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 },
  imageItem: { padding: 5, borderWidth: 2, borderColor: 'transparent', alignItems: 'center' },
  selectedItem: { borderColor: '#77E48C', borderRadius: 10 },
  previewImage: { width: 50, height: 50, resizeMode: 'contain' },
  imageText: { fontSize: 10, color: '#666' },
  saveBtn: { backgroundColor: '#77E48C', padding: 15, borderRadius: 10, marginTop: 30, alignItems: 'center' },
  saveBtnText: { color: '#FFF', fontWeight: 'bold' },
  cancelBtn: { marginTop: 15, alignItems: 'center' }
});

export default AdminBadgeWriteScreen;