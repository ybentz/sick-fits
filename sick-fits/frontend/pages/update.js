import React from 'react'
import { useRouter } from 'next/router'

import UpdateItem from '../components/UpdateItem'

function Update() {
  const { query } = useRouter()

  return <UpdateItem id={query.id} />
}

export default Update
