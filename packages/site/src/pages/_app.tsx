import { useRouter } from 'next/router'
import { useRemoteRefresh } from 'next-remote-refresh/hook'

import '../app.css'

export default function App({ Component, pageProps }) {
  const router = useRouter()
  useRemoteRefresh({
    shouldRefresh: (path) => path.includes(router.query.slug),
  })
  return <Component {...pageProps} />
}
