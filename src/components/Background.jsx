import styled from "styled-components"

const Background = styled.div`
  background: url("cheers.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-color: #000000;
  background-size: cover;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media only screen and (max-width: 520px) {
    justify-content: safe flex-start;
  }
`

export default Background
