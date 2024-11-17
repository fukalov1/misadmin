export default function isUser ({ next, currentUser }){
  // console.log('is middleware type user ', currentUser.role);

  if (currentUser.roles.filter((item) => item.id === 2)) {
    return next()
  }
  else {
    return next({ path: "/dashboard" })
  }
}
