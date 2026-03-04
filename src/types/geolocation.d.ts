declare module '@react-native-community/geolocation' {
  interface GeoPosition {
    coords: {
      latitude: number;
      longitude: number;
      altitude: number | null;
      accuracy: number;
      altitudeAccuracy: number | null;
      heading: number | null;
      speed: number | null;
    };
    timestamp: number;
  }

  interface GeoOptions {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
  }

  const Geolocation: {
    getCurrentPosition: (
      success: (position: GeoPosition) => void,
      error: (error: { code: number; message: string }) => void,
      options?: GeoOptions,
    ) => void;
  };

  export default Geolocation;
}
