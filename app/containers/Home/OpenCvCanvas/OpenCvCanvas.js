import React, { useEffect, useRef, useState } from 'react';
import { useOpenCv } from 'opencv-react';
import PropTypes from 'prop-types';

import { Canvas } from './styled';
import { matFromUrl, drawScaledMat } from '../utils';

export default function OpenCvCanvas({ width = 640, height = 360 }) {
  const { cv, loaded } = useOpenCv();
  const canvasRef = useRef();
  const [time, setTime] = useState();

  useEffect(() => {
    if (!cv || !loaded || !canvasRef.current) {
      return;
    }

    (async () => {
      try {
        // eslint-disable-next-line
        const src = await matFromUrl(cv, require('../drawing.jpg'));
        const ctx = canvasRef.current.getContext('2d');
        const startTime = Date.now();

        const dst = new cv.Mat();
        src.convertTo(dst, cv.CV_8U);
        cv.cvtColor(dst, dst, cv.COLOR_RGB2HLS);
        /*
        const hls = new cv.MatVector();
        cv.split(dst, hls);
        const sat = hls.get(2);
        const lum = hls.get(1);

        const sati = new cv.Mat();
        cv.bitwise_not(sat, sati);

        const scale = 1;
        const scalar = new cv.Scalar(scale);
        const ones = new cv.Mat(sat.rows, sat.cols, cv.CV_8U, scalar);
        const sat2 = sati.mul(ones, 0.7);
        const lum2 = lum.mul(ones, 0.3);
        const hs = new cv.Mat();
        cv.add(sat2, lum2, hs);
*/
        const final = new cv.Mat();
        dst.convertTo(final, cv.CV_8U);
        cv.cvtColor(final, final, cv.COLOR_RGB2RGBA);

        setTime(Date.now() - startTime);

        drawScaledMat(ctx, final);
      } catch (err) {
        console.log('error', err);
      }
    })();
  }, [cv, loaded, canvasRef, width, height]);

  return (
    <article>
      <div>
        {!loaded ? 'Loading...' : ''}
        {cv ? '' : 'error'}
      </div>
      <div>{time} msecs</div>
      <Canvas ref={canvasRef} {...{ width, height }} />
    </article>
  );
}

OpenCvCanvas.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};
