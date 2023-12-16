import { FC } from "react";
import styled from "styled-components";

import { UserCircleIcon } from "@heroicons/react/24/solid";

const StyledProfilePicture = styled.div<{
  $flex?: { justifyContent: "center" | "flex-end" | "flex-start" | string };
}>`
  display: flex;
  gap: 1.2rem;
  align-items: center;
  justify-content: ${({ $flex }) =>
    $flex && $flex.justifyContent ? $flex.justifyContent : "flex-start"};
  font-weight: 500;
  font-size: 1.4rem;
  color: var(--color-grey-600);
`;

const Avatar = styled.img`
  display: block;
  aspect-ratio: 1;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
  outline: 2px solid var(--color-grey-100);
`;

const ProfilePicture: FC<{
  flex?: { justifyContent: "center" | "flex-end" | "flex-start" | string };
  imgSize?: { height: number; width: number };
  imgSrc?: string;
  textName?: string;
}> = ({ flex, imgSize = { height: 40, width: 40 }, imgSrc, textName }) => {
  return (
    <StyledProfilePicture $flex={flex}>
      {imgSrc ? (
        <Avatar
          alt={textName ? `Profile picture of ${textName}` : "Profile Picture"}
          src={imgSrc}
          height={imgSize.height}
          width={imgSize.width}
        />
      ) : (
        <UserCircleIcon
          fill="var(--color-zinc-300)"
          height={imgSize.height}
          width={imgSize.width}
        />
      )}

      {textName && <span>{textName}</span>}
    </StyledProfilePicture>
  );
};

export default ProfilePicture;
