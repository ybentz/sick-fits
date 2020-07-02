import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from '@apollo/react-hooks'
// import dynamic from 'next/dynamic'

import Page from '../components/Page'
import withData from '../lib/withData'

function App({ Component, apollo, pageProps }) {
  return (
    <ApolloProvider client={apollo}>
      <Page>
        <Component {...pageProps} />
      </Page>
    </ApolloProvider>
  )
}

// Accessibility tool - outputs to devtools console on dev only and client-side only.
if (process.env.NODE_ENV !== 'production' && process.browser) {
  // This doesn't work, looks like it's because of how react-axe is exported, no point in fighting it
  // const axe = dynamic(() => import('react-axe'), { ssr: false })
  const axe = require('react-axe')
  axe(React, ReactDOM, 1000)
}

// needed for next.js to be able to SSR. video #15 ~9:00
// App.getInitialProps = async ({ Component, ctx }) => {
//   let pageProps = {}
//   if (Component.getInitialProps) {
//     pageProps = await Component.getInitialProps(ctx)
//   }
//   // this exposes the query to the user
//   pageProps.query = ctx.query
//   return { pageProps }
// }

export default withData(App)
