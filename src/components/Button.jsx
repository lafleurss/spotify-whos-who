import styled from "styled-components"

const Button = styled.button`
  color: #fff;
  width: ${({ width }) => width};
  height: 60px;
  border-radius: 15px;
  font-size: 1.3em;
  background: #40a4ff;
  box-shadow: 2px 2px 2px 2px#1F1B56;
  cursor: pointer;
  margin: 25px;
  &:hover {
    background: #ff5f1f;
    box-shadow: 2px 2px 2px 2px#6b220f;
  }
`

export default Button
