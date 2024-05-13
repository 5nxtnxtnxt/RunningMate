'use client';

import { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { DrawLineRecoil, MapRecoil } from '@atoms';

declare global {
  interface Window {
    kakao: any;
  }
}

interface ClickLatLng {
  La: number;
  Ma: number;
}

interface KakaoLatLng {
  (lat: number, lng: number): void;
}

export default function Map() {
  // let lineRef = useRef<any>(null);
  // let dotsRef = useRef<any>([]);
  const [{ drawFlag, paths }, setDrawLine] = useRecoilState(DrawLineRecoil);
  //const { centerLat, centerLng } = useRecoilValue(MapRecoil);
  //const resetMapRecoil = useResetRecoilState(MapRecoil);
  const kakaoRef = useRef<any>();
  const mapRef = useRef<any>();
  const eventRef = useRef<(mouseEvent: { latLng: ClickLatLng }) => void>();

  useEffect(() => {
    const KakaoMaps = window.kakao.maps;
    kakaoRef.current = KakaoMaps;
    KakaoMaps.load(() => {
      const container = document.getElementById('map');
      const options = {
        center: new KakaoMaps.LatLng(0, 0),
        level: 3,
      };

      const map = new KakaoMaps.Map(container, options);
      mapRef.current = map;

      navigator.geolocation.getCurrentPosition((position) => {
        map.setCenter(
          new KakaoMaps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          )
        );
      });
      // changeMapCenterRef.current = (lat: number, lng: number) =>
      //   map.setCenter(new KakaoMaps.LatLng(lat, lng));

      // makeMapMarkerRef.current = (lat: number, lng: number) => {
      //   const marker = new KakaoMaps.Marker({
      //     position: new KakaoMaps.LatLng(lat, lng),
      //   });
      //   marker.setMap(map);
      // };
    });
  }, []);

  useEffect(() => {
    const kakaoMaps = kakaoRef.current;
    const map = mapRef.current;

    if (!map || !kakaoMaps) return;

    if (drawFlag) {
      const clickEvent = (mouseEvent: { latLng: ClickLatLng }) => {
        console.log(JSON.stringify(drawFlag));
      };

      kakaoMaps.event.addListener(map, 'click', clickEvent);
      eventRef.current = clickEvent;
      return;
    }
    kakaoMaps.event.removeListener(map, 'click', eventRef.current);
  }, [drawFlag]);

  // useEffect(() => {
  //   const KakaoMaps = window.kakao.maps;

  //   const deleteDrawLine = () => {
  //     if (lineRef.current) {
  //       lineRef.current.setMap(null);
  //       lineRef.current = null;
  //     }
  //   };

  //   const deleteLineDot = () => {
  //     dotsRef.current.forEach((dot: any) => {
  //       if (dot.dot) dot.dot.setMap(null);
  //       if (dot.distance) dot.distance.setMap(null);
  //     });
  //     dotsRef.current = [];
  //   };

  //   const displayLineDot = (position: ClickLatLng, distance: number) => {
  //     const dotOverlay = new KakaoMaps.CustomOverlay({
  //       content: '<span class="dot"></span>',
  //       position: position,
  //       zIndex: 1,
  //     });
  //     dotOverlay.setMap(KakaoMaps);

  //     let distanceOverlay = new KakaoMaps.CustomOverlay({
  //       position: position,
  //       yAnchor: 1,
  //       zIndex: 2,
  //     });
  //     if (distance > 0) {
  //       distanceOverlay = new KakaoMaps.CustomOverlay({
  //         content:
  //           '<div class="dotOverlay">거리 <span class="number">' +
  //           distance +
  //           '</span>m</div>',
  //         position: position,
  //         yAnchor: 1,
  //         zIndex: 2,
  //       });
  //       distanceOverlay.setMap(KakaoMaps);
  //     }
  //     dotsRef.current.push({ dot: dotOverlay, distance: distanceOverlay });
  //   };

  //   const checkingDrawFlag = () => {
  //     if (!drawFlag) {
  //       drawStartRef.current = false;
  //       drawFlagRef.current = false;
  //       deleteDrawLine();
  //       deleteLineDot();
  //       return true;
  //     }
  //     return false;
  //   };

  //   if (drawFlag) drawFlagRef.current = true;
  //   else {
  //     drawStartRef.current = false;
  //     drawFlagRef.current = false;
  //     deleteDrawLine();
  //     deleteLineDot();
  //     return;
  //   }

  // }, [drawFlag]);

  // useEffect(() => {
  //   if (centerLat === 0) return;
  //   changeMapCenterRef.current!(centerLat, centerLng);
  //   makeMapMarkerRef.current!(centerLat, centerLng);
  //   resetMapRecoil();
  // }, [centerLat]);

  return <div id="map" className="w-full h-full" />;
}
