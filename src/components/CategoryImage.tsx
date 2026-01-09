import React, { useMemo } from 'react';
import { Image, ImageSourcePropType, StyleSheet } from 'react-native';

const ICON_HEIGHT = 94;

function MascotImage({ source }: { source: ImageSourcePropType }) {
  const ratio = useMemo(() => {
    const { width, height } = Image.resolveAssetSource(source);
    return width / height;
  }, [source]);

  return (
    <Image
      source={source}
      resizeMode="contain"
      style={[styles.mascotImage, { aspectRatio: ratio }]}
    />
  );
}

const styles = StyleSheet.create({
  mascotImage: {
    height: ICON_HEIGHT, 
  },
});

export default MascotImage;