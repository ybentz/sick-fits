import React from 'react'
import { useRouter } from 'next/router'

import SingleItem from '../components/SingleItem'

function Item() {
  const { query } = useRouter()

  return (
    <div>
      <SingleItem id={query.id} />
    </div>
  )
}

export default Item
