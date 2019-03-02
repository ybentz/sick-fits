import ResetPassword from '../components/ResetPassword';

const Reset = props => (
  <div>
    <ResetPassword
      resetToken={props.query.resetToken}
      email={props.query.email}
    />
  </div>
);

export default Reset;
