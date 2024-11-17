export default function isUser ({ next, currentUser }){

  if (currentUser.roles.filter((item) => item.id === 1)) {
    return next()
  }
  else {
    return next({ path: "/dashboard" })
  }
}

