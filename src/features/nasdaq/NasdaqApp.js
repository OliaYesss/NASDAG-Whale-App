import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { VisxGraph } from "../../components/VisxGraph";
import { currNasdaqIndxSelector, isHoverSelector, nasdaqDataSelector, nasdaqInitialIndexSelector, nasdaqLastIndxSelector } from "./nasdaqSlice";
import React, { useState } from "react";


export const NasdaqApp = () => {
  const dispatch = useDispatch()
  const nasdaqData = useSelector(nasdaqDataSelector)
  const nasdaqInitialIndex = useSelector(nasdaqInitialIndexSelector)
  const currNasdaqIndx = useSelector(currNasdaqIndxSelector)
  const nasdaqLastIndx = useSelector(nasdaqLastIndxSelector)
  const isHover = useSelector(isHoverSelector)

  const currNasdaqDiff = currNasdaqIndx === 0 ? 0 : (currNasdaqIndx - nasdaqInitialIndex).toFixed(2)
  const lastNasdaqDiff = nasdaqLastIndx === 0 ? 0 : (nasdaqLastIndx - nasdaqInitialIndex).toFixed(2)

  const currNasdaqPercentageDiff = currNasdaqIndx === 0 ? 0 : (currNasdaqDiff * 100 / nasdaqInitialIndex).toFixed(2)
  const lastNasdaqPercentageDiff = nasdaqLastIndx === 0 ? 0 : (lastNasdaqDiff * 100 / nasdaqInitialIndex).toFixed(2)
  

  useEffect(() => {
  }, [])

  return(
    <>
      {/* <div>{nasdaqData.lastSalePrice}</div>
      <div>{nasdaqData.deltaIndicator}</div>
      <div>{nasdaqData.lastTradeTimestamp}</div> */}
      <div className="nasdaq-rates">
        <div className="title">NASDAQ</div>
        <div className="subtitle">Composite</div>
        <div className="nasdaq-indx">{isHover ? currNasdaqIndx : nasdaqLastIndx}</div>
        <div className="nasdaq-diff">{isHover ? currNasdaqDiff : lastNasdaqDiff}({isHover ? currNasdaqPercentageDiff : lastNasdaqPercentageDiff}%)</div>
      </div>
      <div className="graph">
        
      </div>
    </>
  )
}
