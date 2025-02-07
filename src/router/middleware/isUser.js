export default function isUser ({ next, currentUser }){

  // console.log('middleware user ', currentUser.roles,  currentUser.roles.filter((item) => item.id === 1), currentUser.roles.filter((item) => item.id === 4).length);
  if (currentUser.roles.filter((item) => item.id === 1)) {
    return next()
  }
  else {
    return next({ path: "/dashboard" })
  }
}

