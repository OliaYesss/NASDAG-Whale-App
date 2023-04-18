import React from "react";
import "../App.css"

import {
  AnimatedLineSeries,
  buildChartTheme,
  XYChart,
  Tooltip
} from "@visx/xychart";

import { addCurrNasdaqIndx, currNasdaqIndxSelector } from "../features/nasdaq/nasdaqSlice"

import { useDispatch, useSelector } from "react-redux";
import { nasdaqDataArraySelector, nasdaqLastIndxSelector } from "../features/nasdaq/nasdaqSlice";

const customTheme = buildChartTheme({
  // colors
  backgroundColor: '#DFC0A1', // used by Tooltip, Annotation
  colors: ['#1D2766'], // categorical colors, mapped to series via `dataKey`s
});


const LineChart = (props) => {
  const dispatch = useDispatch()

  const nasdaqDataArray = useSelector(nasdaqDataArraySelector)
  const nasdaqLastIndx = useSelector(nasdaqLastIndxSelector)
  const currNasdaqIndx = useSelector(currNasdaqIndxSelector)


  const data1 = nasdaqDataArray

  const accessors = {
    xAccessor: (d) => d.x,
    yAccessor: (d) => d.y
  }

  const onPointerMove = (snapTooltipToDatumY) => {
    if (currNasdaqIndx !== snapTooltipToDatumY.datum.y) {
      dispatch(addCurrNasdaqIndx({
        currNasdaqIndx: snapTooltipToDatumY.datum.y,
        isHover: true
      }))
    }
  }

  const onPointerOut = () => {
    dispatch(addCurrNasdaqIndx({
      currNasdaqIndx: nasdaqLastIndx,
      isHover: false
    }))
  }

  return (
    <XYChart
      onPointerMove={onPointerMove}
      onPointerOut={onPointerOut}
      height={500}
      width={1000}
      xScale={{ type: "band" }}
      yScale={{ type: "linear", zero: false }} 
      theme={customTheme}
      margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
    >
      <AnimatedLineSeries dataKey="" data={data1} {...accessors} />
      <Tooltip
        snapTooltipToDatumX
        snapTooltipToDatumY
        showVerticalCrosshair
        showSeriesGlyphs
        renderTooltip={({ tooltipData, colorScale }) => (
          <div>
            <div style={{ color: colorScale(tooltipData.nearestDatum.key) }}>
              {tooltipData.nearestDatum.key}
            </div>
            {accessors.xAccessor(tooltipData.nearestDatum.datum)}
          </div>
        )}
      />
    </XYChart>
  );
};


export function VisxGraph(props) {
  return (
    <div className="VisxGraph">
      <LineChart setCurrNasdaqIndx={props.setCurrNasdaqIndx} />
    </div>
  );
}