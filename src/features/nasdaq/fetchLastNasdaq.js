export const fetchLastNasdaq = () => {
  const endpoint = 'http://localhost:3333/all-nasdaq'

  return fetch(endpoint)
  .then(response => {
    if (response.ok) {
      return response.json()
    }
    throw new Error('Request failed')
  })
  // .then(response => {
  //   return response.data
  // })
}