import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, Text, View, SafeAreaView, FlatList, 
  Image, Pressable, ActivityIndicator, Alert 
} from 'react-native';
import { getMyBadges, equipBadge } from '../../../api/badges';
import { MyBadgeItem } from '../../../types/badge';
import { BADGE_IMAGE_MAP } from '../../../constants/icons';

const BadgeScreen = ({ onClose }: { onClose: () => void }) => {
  const [badges, setBadges] = useState<MyBadgeItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBadges = async () => {
    try {
      setLoading(true);
      const res = await getMyBadges();
      if (res.data?.data?.badges) {
        // ✅ 1. 데이터 정렬: 장착된 뱃지(isEquipped)를 맨 앞으로
        const sortedData = [...res.data.data.badges].sort((a, b) => {
          const aEquipped = a.isEquipped || (a as any).equipped;
          const bEquipped = b.isEquipped || (b as any).equipped;
          return aEquipped === bEquipped ? 0 : aEquipped ? -1 : 1;
        });
        setBadges(sortedData);
      }
    } catch (error) {
      Alert.alert('오류', '뱃지 정보를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBadges(); }, []);

  const handleEquip = async (badgeUserId: number, alreadyEquipped: boolean) => {
    if (alreadyEquipped) return;
    try {
      await equipBadge(badgeUserId); //
      Alert.alert('성공', '뱃지가 장착되었습니다.');
      fetchBadges(); // 장착 후 리스트 새로고침 및 재정렬
    } catch (error) {
      console.error('장착 에러 상세:', error);
      Alert.alert('오류', '뱃지 장착에 실패했습니다.');
    }
  };

  const renderBadge = ({ item }: { item: MyBadgeItem }) => {
    // ✅ 2. 변수명 안전하게 처리 (서버 응답에 맞춰 체크)
    const isEquipped = item.isEquipped || (item as any).equipped;

    return (
      <Pressable 
        // ✅ 3. 장착 시에만 equippedCard 스타일 적용 (흰 배경 + 그림자)
        style={[styles.badgeCard, isEquipped && styles.equippedCard]}
        onPress={() => {
          if (item.badgeUserId) {
            handleEquip(item.badgeUserId, isEquipped);
          } else {
            // 데이터 정합성 문제 발생 시 로그 확인용
            console.log("ID 누락 데이터:", item);
            Alert.alert('오류', '뱃지 정보가 올바르지 않습니다.');
          }
        }}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={BADGE_IMAGE_MAP[item.imageUrl] || BADGE_IMAGE_MAP['default']} 
            // ✅ 4. 미장착 시에만 lockedBadge 스타일 (흐리게) 적용
            style={[styles.badgeImage, !isEquipped && styles.lockedBadge]} 
          />
          {isEquipped && <View style={styles.equipTag} />}
        </View>
        <Text style={[styles.badgeName, { opacity: isEquipped ? 1 : 0.7 }]}>{item.name}</Text>
        <Text style={[styles.badgeDesc, { opacity: isEquipped ? 1 : 0.5 }]}>{item.description}</Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onClose} style={styles.backBtn}>
          <Text style={styles.backText}>〈 뱃지</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>나의 뱃지</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#77E48C" style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={badges}
            renderItem={renderBadge}
            keyExtractor={(item) => item.badgeId.toString()}
            numColumns={3}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { paddingHorizontal: 20, paddingVertical: 15 },
  backBtn: { padding: 5 },
  backText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  content: { flex: 1, paddingHorizontal: 20 },
  title: { fontSize: 22, fontWeight: '800', marginVertical: 20, color: '#333' },

  listContent: { 
    paddingBottom: 30,
    backgroundColor: '#F8FBF9', // 약간의 배경색을 주어 흰색 카드와 대비시킴
    borderRadius: 16,
    padding: 10,
  },
  
  badgeCard: { 
    flex: 1/3, 
    alignItems: 'center', 
    marginBottom: 20, 
    paddingVertical: 15,
    borderRadius: 12,
  },
  
  // ✅ 장착된 뱃지 카드: 배경을 흰색으로 하고 테두리와 그림자로 밝게 강조
  equippedCard: { 
    backgroundColor: '#FFFFFF', 
    borderWidth: 1,
    borderColor: '#77E48C',
    shadowColor: "#77E48C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  }, 
  
  imageContainer: { 
    width: 80, 
    height: 80, 
    marginBottom: 10, 
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
  },
  badgeImage: { width: '100%', height: '100%', resizeMode: 'contain' },
  
  // ✅ 미장착 뱃지 이미지: grayscale 에러 방지를 위해 opacity만 사용
  lockedBadge: { 
    opacity: 0.3, 
  },
  
  equipTag: { 
    position: 'absolute', 
    bottom: 2, 
    right: 2, 
    backgroundColor: '#77E48C', 
    borderRadius: 10, 
    width: 14,
    height: 14,
    borderWidth: 2,
    borderColor: '#FFF'
  },
  
  badgeName: { fontSize: 13, fontWeight: '700', color: '#333', textAlign: 'center' },
  badgeDesc: { fontSize: 10, color: '#999', textAlign: 'center', marginTop: 4, paddingHorizontal: 5 },
});

export default BadgeScreen;