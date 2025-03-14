function middlewarePipeline (context, middleware, index, currentUser) {
  const nextMiddleware = middleware[index]
  if(!nextMiddleware){
    return context.next
  }
  return () => {
    const nextPipeline = middlewarePipeline(
      context, middleware, index + 1
    )
    nextMiddleware({ ...context, next: nextPipeline, currentUser })
  }
}
export default middlewarePipeline
