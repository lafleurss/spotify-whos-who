import styled from "styled-components"

const Content = styled.div`
  position: absolute;
  /* margin-top: 5%; */
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media only screen and (max-width: 520px) {
    /* margin-top: 0; */
    justify-content: safe flex-start;
  }
`

export default Content