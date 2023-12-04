import styled from "styled-components";

export const Paragraph = styled.p<{
  $color?: string;
  $fontSize?: string;
  $fontWeight?: number;
}>`
  color: ${({ $color }) => ($color ? $color : "var(--color-grey-600")};
  font-size: ${({ $fontSize }) => ($fontSize ? $fontSize : "1.4rem")};
  font-weight: ${({ $fontWeight }) => ($fontWeight ? $fontWeight : 400)};
`;
