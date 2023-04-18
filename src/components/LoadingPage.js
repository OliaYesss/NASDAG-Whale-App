import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";

import waves1x from './img/waves_layers@1x.png'
import waves2x from './img/waves_layers@2x.png'
import sun1x from './img/sun@1x.png'
import sun2x from './img/sun@2x.png'
// import whale1x from './img/whale_layers@1x.png'
// import whale2x from './img/whale_layers@2x.png'
import drops1x from './img/drops1x.png'
import drops2x from './img/drops2x.png'
import whale1x from './img/whale1x.png'
import whale2x from './img/whale2x.png'

export const LoadingPage = () => {
  return (
    <div className='loading-screen'>
      <div className='loading-screen-wrapper'>
        <img className='sun-img' srcSet={`${sun2x} 2x`} src={sun1x} />
        <div className='whale-wave-wrapper'>
          <div className='whale-drops-wrapper'>
            <div className='drops-sprite-img' />
            <img className='whale-img' srcSet={`${whale2x} 2x`} src={whale1x} />
          </div>
          <img className='wave-img' srcSet={`${waves2x} 2x`} src={waves1x} />
        </div>
      </div>
    </div>
  )
}