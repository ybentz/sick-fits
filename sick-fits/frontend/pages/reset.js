import { useRouter } from 'next/router'

import ResetPassword from '../components/ResetPassword'

const Reset = (props) => {
  const { query } = useRouter()

  return (
    <div>
      <ResetPassword resetToken={query.resetToken} email={query.email} />
    </div>
  )
}

export default Reset
