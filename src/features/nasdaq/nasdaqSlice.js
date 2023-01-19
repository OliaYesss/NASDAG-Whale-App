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

const nasdaqSlice = createSlice({
  name: 'nasdaq',
  initialState,

  reducers: {
    addNasdaqData: (state, action) => {
      state.nasdaqData = action.payload.nasdaqData
    },
    addNasdaqDataArray: (state, action) => {
      const date = new Date(action.payload.timestamp)
      const lastSalePrice = parsePrice(action.payload.lastSalePrice)

      state.nasdaqDataArray.push({
        y: lastSalePrice,
        x: date.toLocaleTimeString()
      })
    },
    addCurrNasdaqIndx: (state, action) => {
      state.currNasdaqIndx = action.payload.currNasdaqIndx
      state.isHover = action.payload.isHover
    },
    addNasdaqLastDataArray: (state, action) => {
      const data = action.payload.data
      // const date = action.payload.data.timestamp
      // const lastSalePrice = action.payload.data.lastSalePrice

      state.nasdaqDataArray.unshift(...data)
    }
  }
})

export const { addNasdaqData, addNasdaqDataArray, addNasdaqLastDataArray, addCurrNasdaqIndx } = nasdaqSlice.actions
