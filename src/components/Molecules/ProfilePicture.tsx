import { FC } from "react";
import styled from "styled-components";

import { UserCircleIcon } from "@heroicons/react/24/solid";

const StyledProfilePicture = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: center;
  font-weight: 500;
  font-size: 1.4rem;
  color: var(--color-grey-600);
`;

const Avatar = styled.img`
  display: block;
  height: 3.6rem;
  width: 3.6rem;
  aspect-ratio: 1;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
  outline: 2px solid var(--color-grey-100);
`;

const ProfilePicture: FC<{ imgSrc?: string; textName?: string }> = ({
  imgSrc,
  textName,
}) => {
  return (
    <StyledProfilePicture>
      {imgSrc ? (
        <Avatar
          alt={textName ? `Profile picture of ${textName}` : "Profile Picture"}
          src="default-user.jpg"
        />
      ) : (
        <UserCircleIcon fill="var(--color-zinc-300)" height={36} width={36} />
      )}

      {textName && <span>{textName}</span>}
    </StyledProfilePicture>
  );
};

export default ProfilePicture;
