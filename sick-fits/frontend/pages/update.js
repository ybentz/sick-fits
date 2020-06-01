import { useRouter } from 'next/router'

import UpdateItem from '../components/UpdateItem'

function Update(props) {
  const { query } = useRouter()

  return <UpdateItem id={query.id} />
}

export default Update
