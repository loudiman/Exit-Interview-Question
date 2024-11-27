const mainRuntime = require(`./runtimes/main/main-runtime`)
const apiRuntime = require(`./runtimes/api/api-runtime`)


apiRuntime.listen(2020, () => {
  console.log("Server is running")
})