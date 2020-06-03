import { ApolloProvider } from 'react-apollo'
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
