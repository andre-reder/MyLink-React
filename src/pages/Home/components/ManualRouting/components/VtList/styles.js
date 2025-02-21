import styled from 'styled-components';

export const VTListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  border: 2px solid #3e94c5;
  border-radius: 16px;
  padding: 8px;

  h4 {
    font-size: 16px;
    font-weight: bold;
    text-align: center;
  }

  > div {
    max-height: 135px;
    overflow-y: auto;

    > div.infoContainer {
      display: flex;
      flex-direction: row;
      /* align-items: center;
      justify-content: center; */

      & + div.infoContainer {
        margin-top: 4px;
      }

      > small.manual {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        span {
          /* background: #afe6ff !important;
          color: #003250 !important; */
          /* font-weight: bold !important; */
            text-transform: uppercase !important;
            /* padding: 4px !important; */
            font-size: 11px !important;
            width: 100% !important;
            /* margin-top: 8px !important; */

            strong {
              font-size: 11px;
            }
          }

          > img.manual {
              margin-right: 16px;
              width: 32px;
              /* height: 70%; */
              /* mix-blend-mode: color-burn; */
              aspect-ratio: 3/3;
              object-fit: contain;
            }
      }
    }
  }
`;
