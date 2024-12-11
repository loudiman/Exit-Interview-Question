const main = require(`./main-runtime`)
const api = require(`./api-runtime`)


api.listen(2020, () => {
  console.log("Server is running")
})

main.listen(2021, () =>{
  console.log("Resource Server is running")
})