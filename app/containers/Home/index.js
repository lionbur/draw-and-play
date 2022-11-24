import React from 'react';
import { OpenCvProvider } from 'opencv-react';

import OpenCvCanvas from './OpenCvCanvas';

export default function Home() {
  return (
    <app>
      <OpenCvProvider>
        <OpenCvCanvas />
      </OpenCvProvider>
    </app>
  );
}
