import { useRouter } from 'next/router'

import UpdateItem from '../components/UpdateItem'

const Sell = (props) => {
  const { query } = useRouter()

  return <UpdateItem id={query.id} />
}

export default Sell
