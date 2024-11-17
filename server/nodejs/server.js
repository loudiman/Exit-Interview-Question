const mainRuntime = require("./runtimes/main")


mainRuntime.listen(80, () => {
  console.log("server running")
})
