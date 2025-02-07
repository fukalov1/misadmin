export default function isAgent ({ next, currentUser }){
  // console.log('is middleware type user ', currentUser.role);

  // console.log('middleware agent ', currentUser.roles,  currentUser.roles.filter((item) => item.id === 1), currentUser.roles.filter((item) => item.id === 4).length);

  if (currentUser.roles.filter((item) => item.id === 4)) {
    return next()
  }
  else {
    return next({ path: "/dashboard" })
  }
}
