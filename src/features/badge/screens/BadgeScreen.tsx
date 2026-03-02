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
      if (res.data?.data) {
        setBadges(res.data.data.badges);
      }
    } catch (error) {
      Alert.alert('오류', '뱃지 정보를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBadges(); }, []);

  const handleEquip = async (badgeId: number, alreadyEquipped: boolean) => {
if (alreadyEquipped) return;
    try {
      await equipBadge(badgeId); 
      Alert.alert('성공', '뱃지가 장착되었습니다.');
      fetchBadges(); 
    } catch (error) {
      Alert.alert('오류', '뱃지 장착에 실패했습니다.');
    }
  };

  const renderBadge = ({ item }: { item: MyBadgeItem }) => (
    <Pressable 
      style={[styles.badgeCard, item.isEquipped && styles.equippedCard]}
      onPress={() => handleEquip(item.badgeId, item.isEquipped)}
    >
<View style={styles.imageContainer}>
        <Image 
          source={BADGE_IMAGE_MAP[item.imageUrl] || BADGE_IMAGE_MAP['default']} 
          style={[styles.badgeImage, !item.isEquipped && styles.lockedBadge]} 
        />
        {item.isEquipped && <View style={styles.equipTag}><Text style={styles.equipTagText}>장착됨</Text></View>}
      </View>
      <Text style={styles.badgeName}>{item.name}</Text>
      <Text style={styles.badgeDesc}>{item.description}</Text>
    </Pressable>
  );

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
  listContent: { paddingBottom: 30 },
  badgeCard: { 
    flex: 1/3, 
    alignItems: 'center', 
    marginBottom: 25, 
    padding: 10,
    borderRadius: 12 
  },
  equippedCard: { backgroundColor: '#F0FFF4' },
  imageContainer: { width: 80, height: 80, marginBottom: 10, position: 'relative' },
  badgeImage: { width: '100%', height: '100%', resizeMode: 'contain' },
  lockedBadge: { opacity: 0.6 },
  equipTag: { 
    position: 'absolute', bottom: -5, right: -5, 
    backgroundColor: '#77E48C', borderRadius: 10, 
    paddingHorizontal: 6, paddingVertical: 2 
  },
  equipTagText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  badgeName: { fontSize: 13, fontWeight: '700', color: '#333', textAlign: 'center' },
  badgeDesc: { fontSize: 10, color: '#999', textAlign: 'center', marginTop: 4 },
});

export default BadgeScreen;