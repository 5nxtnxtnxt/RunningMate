'use client';

import { useRef, useState } from 'react';
import { useSetRecoilState, useRecoilState } from 'recoil';
import { DrawLineRecoil, MapRecoil } from '@atoms';

export default function MapMenu() {
  const [{ drawFlag }, setDrawLine] = useRecoilState(DrawLineRecoil);
  let [lat, lng] = [-1, 1];
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     lat = position.coords.latitude;
  //     lng = position.coords.longitude;
  //     alert(lat);
  //   });
  return (
    <div>
      <h2>drawFlag {JSON.stringify(drawFlag)}</h2>
      <h2>
        {lat}
        {lng}
      </h2>
      <button
        onClick={() =>
          setDrawLine((prev) => ({ ...prev, drawFlag: !drawFlag }))
        }
      >
        flip
      </button>
    </div>
  );
}
