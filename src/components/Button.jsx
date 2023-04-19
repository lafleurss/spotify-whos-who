import styled from "styled-components"

const Button = styled.button`
  background: rgb(182, 67, 29);
  width: ${({ width }) => width};
  height: 50px;
  border-radius: 15px;
  font-size: 1.3em;
  box-shadow: 2px 2px 2px 2px#333;
  cursor: pointer;
  margin: 25px;
`

export default Button