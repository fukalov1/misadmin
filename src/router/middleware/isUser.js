export default function isUser ({ next, currentUser }){
  console.log('is middleware type user ', currentUser.role);

  if (currentUser.role === 1) {
    return next()
  }
  else {
    return next({ path: "/dashboard" })
  }
}
