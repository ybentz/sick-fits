import React, { useState } from 'react'
import { useQuery, useMutation } from 'react-apollo'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'

import Error from './ErrorMessage'
import Table from './styles/Table'
import SickButton from './styles/SickButton'

const validPermissions = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE',
]

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation UPDATE_PERMISSIONS_MUTATION(
    $permissions: [Permission]
    $userId: ID!
  ) {
    updatePermissions(permissions: $permissions, userId: $userId) {
      id
      permissions
      name
      email
    }
  }
`

const ALL_USERS_QUERY = gql`
  query {
    users {
      id
      name
      email
      permissions
    }
  }
`

function Permissions(props) {
  const { data, error, loading } = useQuery(ALL_USERS_QUERY)

  if (loading) return <p>Loading...</p>
  if (!data?.users) return <p>Nothing to show here!</p>
  return (
    <div>
      <Error error={error} />
      <div>
        <h2>Manage Permissions</h2>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              {validPermissions.map((permission) => (
                <th key={permission}>{permission}</th>
              ))}
              <th>🤦‍♂️</th>
            </tr>
          </thead>
          <tbody>
            {data.users.map((user) => (
              <UserPermissions user={user} key={user.id} />
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  )
}

function UserPermissions({ user }) {
  const [permissions, setPermissions] = useState(user.permissions)
  const [updatePermissions, { loading, error }] = useMutation(
    UPDATE_PERMISSIONS_MUTATION,
    {
      variables: {
        permissions,
        userId: user.id,
      },
    }
  )

  function handlePermissionChange(event) {
    const checkbox = event.target
    let updatedPermissions = [...permissions]
    if (checkbox.checked) {
      updatedPermissions.push(checkbox.value)
    } else {
      updatedPermissions = updatedPermissions.filter(
        (permission) => permission !== checkbox.value
      )
    }
    setPermissions(updatedPermissions)
  }

  return (
    <>
      {error && (
        <tr>
          <td colSpan="8">
            <Error error={error} />
          </td>
        </tr>
      )}
      <tr>
        <td>{user.name}</td>
        <td>{user.email}</td>
        {validPermissions.map((permission) => (
          <td key={permission}>
            <label htmlFor={`${user.id}-permission-${permission}`}>
              <input
                id={`${user.id}-permission-${permission}`}
                type="checkbox"
                checked={permissions.includes(permission)}
                value={permission}
                onChange={handlePermissionChange}
              />
            </label>
          </td>
        ))}
        <td>
          <SickButton
            type="button"
            disabled={loading}
            onClick={updatePermissions}
          >
            Updat{loading ? 'ing' : 'e'}
          </SickButton>
        </td>
      </tr>
    </>
  )
}

UserPermissions.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    permissions: PropTypes.array,
  }).isRequired,
}

export default Permissions
