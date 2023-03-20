import styled, { css } from 'styled-components';

export const ModalStyles = styled.div`

        div.modal-header {
            color: ${({ theme }) => theme.colors.gray[900]} !important;
            background: ${({ theme }) => theme.colors.background} !important;
        }

        div.modal-body {
          color: ${({ theme }) => theme.colors.gray[900]} !important;
          background: ${({ theme }) => theme.colors.background} !important;
          padding: 24px;
          max-height: 500px;
          min-height: ${({ minHeight }) => minHeight || 'unset'};
          overflow: ${({ overflow }) => overflow || 'auto'};

          ${({ centeredBody }) => centeredBody && css`
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            `}

          footer {
            strong {
              font-size: 12px;
            }
          }
        }

        div.modal-footer {
          color: ${({ theme }) => theme.colors.gray[900]} !important;
          background: ${({ theme }) => theme.colors.background} !important;

          button.btn-primary {
            color: ${({ theme }) => theme.colors.lighterBackground};
            font-weight: bold;
            background: ${({ theme }) => theme.colors.primary.main};
            border: none;
            &:hover {
              background: ${({ theme }) => theme.colors.primary.light};
            }
            &:focus {
              box-shadow: none !important;
              border: none !important;
            }
          }
        }
`;
