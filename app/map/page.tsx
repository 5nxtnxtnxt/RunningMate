'use client';

import { useRef } from 'react';
import { HeadBar, Map, Navigation } from '@components';
import { Button } from '@shadcn';

export default function Home() {
  const mode = useRef(false);
  const changeMode = () => {
    mode.current = !mode.current;
  };
  return (
    <>
      <HeadBar />
      <main className="mainPart w-full h-full">
        <Map mode={mode} />
        <Button className="fixed z-50" onClick={changeMode}>
          test
        </Button>
      </main>
      <Navigation />
    </>
  );
}
