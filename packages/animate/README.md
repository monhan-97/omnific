# @omnific/animate

WAAPI-based mini animate utilities for Omnific packages.

## `useAnimate`

```ts
import { useAnimate } from '@omnific/animate'
import { useEffect } from 'react'

const [scope, animate] = useAnimate<HTMLDivElement>()

useEffect(() => {
  if (!scope.current) return
  // resolves on complete; rejects with AbortError on stop/cancel
  animate(scope.current, { opacity: 1, width: 120 }, { duration: 0.3 })
}, [animate, scope])

return <div ref={scope} />
```
