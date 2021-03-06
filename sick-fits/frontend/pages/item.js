import { useRouter } from 'next/router'

import SingleItem from '../components/SingleItem'

function Item(props) {
  const { query } = useRouter()

  return (
    <div>
      <SingleItem id={query.id} />
    </div>
  )
}

export default Item
