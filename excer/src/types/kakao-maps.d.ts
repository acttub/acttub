// 카카오맵 JS SDK 의 최소 필요한 타입만 선언.
// 공식 타이핑 패키지가 없어 자체 정의. 더 정확한 타입이 필요해지면 점진 확장.

declare global {
  interface Window {
    kakao?: KakaoNamespace;
  }
}

export interface KakaoNamespace {
  maps: {
    load: (cb: () => void) => void;
    Map: new (
      container: HTMLElement,
      options: {
        center: KakaoLatLng;
        level: number;
      }
    ) => KakaoMap;
    LatLng: new (lat: number, lng: number) => KakaoLatLng;
    Marker: new (options: {
      position: KakaoLatLng;
      map?: KakaoMap;
      image?: KakaoMarkerImage;
      title?: string;
    }) => KakaoMarker;
    MarkerImage: new (
      src: string,
      size: KakaoSize,
      options?: { offset?: KakaoPoint }
    ) => KakaoMarkerImage;
    Size: new (w: number, h: number) => KakaoSize;
    Point: new (x: number, y: number) => KakaoPoint;
    CustomOverlay: new (options: {
      position: KakaoLatLng;
      content: string | HTMLElement;
      yAnchor?: number;
      xAnchor?: number;
      map?: KakaoMap;
    }) => KakaoCustomOverlay;
    event: {
      addListener: (target: unknown, type: string, handler: () => void) => void;
    };
  };
}

export interface KakaoLatLng {
  getLat(): number;
  getLng(): number;
}

export interface KakaoMap {
  setCenter(latlng: KakaoLatLng): void;
  setLevel(level: number): void;
  getLevel(): number;
  getCenter(): KakaoLatLng;
  relayout(): void;
}

export type KakaoMarker = object;
export type KakaoMarkerImage = object;
export type KakaoSize = object;
export type KakaoPoint = object;

export interface KakaoCustomOverlay {
  setMap(map: KakaoMap | null): void;
}

export {};
