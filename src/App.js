import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { NasdaqApp } from './features/nasdaq/NasdaqApp'
import './App.css';
import { useDispatch, useSelector } from "react-redux";
import { addNasdaqData, nasdaqDataSelector, nasdaqDataArraySelector, addNasdaqDataArray, addNasdaqLastDataArray, nasdaqLastDataArraySelector } from "./features/nasdaq/nasdaqSlice";
import { ChakraProvider } from '@chakra-ui/react'
import { VisxGraph } from "./components/VisxGraph";
import { LoadingPage } from './components/LoadingPage';
import { fetchLastNasdaq } from './features/nasdaq/fetchLastNasdaq';

function App() {
  const dispatch = useDispatch()
  const nasdaqData = useSelector(nasdaqDataSelector)
  const nasdaqDataArray = useSelector(nasdaqDataArraySelector)
  const nasdaqLastDataArray = useSelector(nasdaqLastDataArraySelector)
  
  const lastNasdaqData = () => {
    fetchLastNasdaq()
    .then(response => {
      dispatch(addNasdaqLastDataArray({
        data: response.data.map(e => {return {y: e.lastSalePrice, x: new Date(e.timestamp).toLocaleTimeString()}}),
        // timestamp: response.data.map(e => {return {timestamp: e.timestamp}})
      }))
      // response.data.forEach(e => {console.log(`LastSalePrice: ${e.lastSalePrice}`)})
    })
  }

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const socket = io(`http://localhost:3333`)
    
    socket.on('nasdaq', data => {
      dispatch(addNasdaqData({
        nasdaqData: data
      }))

      if (data && data.lastSalePrice) {
        dispatch(addNasdaqDataArray({
          lastSalePrice: data.lastSalePrice,
          timestamp: data.timestamp
        }))
      }
    })

    const timeout = setTimeout(() => {
      lastNasdaqData()
      console.log(nasdaqLastDataArray)
      setLoading(false)
    }, 3000)
   

    return () => {
      socket.close()
      clearTimeout(timeout)
    }
  }, [])

  return (
    <ChakraProvider>
    <div>
      <div className='App'>
        { nasdaqDataArray && nasdaqDataArray.length  && !loading ? (
          <div className="chat-container">
            <NasdaqApp />
          </div>
        ) : (
          <LoadingPage />
        )}
        </div>
    </div>
    </ChakraProvider>
  );
}

export default App;