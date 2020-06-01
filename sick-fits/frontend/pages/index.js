import { useRouter } from 'next/router'

import Items from '../components/Items'

function Home(props) {
  const { query } = useRouter()

  return (
    <div>
      <Items page={parseInt(query.page) || 1} />
    </div>
  )
}

export default Home
