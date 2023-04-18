import { createStore, combineReducers, applyMiddleware } from "redux"
import logger from "redux-logger"
import { nasdaqDataReducer } from "./features/nasdaq/nasdaqSlice"

const reducer = combineReducers({
  nasdaq: nasdaqDataReducer
})

export const store = createStore(reducer, applyMiddleware(logger))