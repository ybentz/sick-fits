import styled from 'styled-components'

const CartStyles = styled.div`
  padding: 20px;
  position: relative;
  background: white;
  position: fixed;
  height: 100%;
  top: 0;
  right: 0;
  width: 40%;
  min-width: 500px;
  bottom: 0;
  transform: translateX(100%);
  transition: all 0.3s;
  box-shadow: 0 0 10px 3px rgba(0, 0, 0, 0.2);
  z-index: 5;
  display: flex;
  flex-direction: column;
  ${(props) => props.open && `transform: translateX(0);`};
  overflow: auto;
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    overflow: scroll;
  }
`

const CartHeader = styled.div`
  border-bottom: 5px solid ${(props) => props.theme.black};
  margin-bottom: 2rem;
  padding-bottom: 2rem;
`

const CartFooter = styled.div`
  border-top: 10px double ${(props) => props.theme.black};
  margin-top: 2rem;
  padding-top: 2rem;
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  margin-top: auto;
  width: 100%;
  font-size: 3rem;
  font-weight: 900;
  p {
    margin: 0;
  }
`

export default CartStyles
export { CartHeader, CartFooter }
