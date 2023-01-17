import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nasdaqData: null,
  nasdaqDataArray: [],
  nasdaqLastDataArray: [],
  currNasdaqIndx: 0,
  isHover: false,
  loading: null
}

const parsePrice = (value) => {
  return parseFloat(value.replace(/,/g, ''))
}

