const mainRuntime = require(`./main-runtime`)
const apiRuntime = require(`./api-runtime`)


apiRuntime.listen(2020, () => {
  console.log("Server is running")
})

mainRuntime.listen(2021, () =>{
  console.log("Resource Server is running")
})