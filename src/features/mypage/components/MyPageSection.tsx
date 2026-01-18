import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

type MyPageSectionRow = {
  left: string;
  right?: string;
};

type MyPageSectionProps = {
  title: string;
  rows: MyPageSectionRow[];
};

function MyPageSection({ title, rows }: MyPageSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      {rows.map((row, index) => (
        <View key={`${row.left}-${index}`} style={styles.row}>
          <Text style={styles.item}>{row.left}</Text>
          {row.right ? (
            <Text style={styles.itemRight}>{row.right}</Text>
          ) : (
            <View style={styles.rightPlaceholder} />
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  title: {
    fontSize: 21,
    fontWeight: '800',
    color: "#373737",
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  item: {
    width: '50%',
    fontSize: 16,
    color: "#373737",
    lineHeight: 22,
  },
  itemRight: {
    width: '50%',
    fontSize: 16,
    color: "#373737",
    textAlign: 'left',
    paddingLeft: 16,
    lineHeight: 22,
  },
  rightPlaceholder: {
    width: '50%',
    paddingLeft: 16,
  },
});

export default MyPageSection;
