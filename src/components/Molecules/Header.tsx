import styled from "styled-components";

import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/solid";

import Menus from "src/components/Molecules/Menus";
import ProfilePicture from "src/components/Molecules/ProfilePicture";

const StyledHeader = styled.header`
  background-color: var(--color-grey-0);
  padding: 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-grey-200);
  box-shadow: var(--shadow-md);

  display: flex;
  gap: 2.4rem;
  align-items: center;
  justify-content: flex-end;
`;

function Header() {
  return (
    <StyledHeader>
      <Menus>
        <Menus.Menu>
          <Menus.Toggle id={"btn-user"} $icon={{ $height: 3.6, $width: 3.6 }}>
            <ProfilePicture textName="Administrator" />
          </Menus.Toggle>

          <Menus.List id={"btn-user"}>
            <div>
              <Menus.Button
                icon={<UserIcon height={16} width={16} />}
                onClick={() => null}
                disabled={false}
              >
                <span>Profile</span>
              </Menus.Button>

              <Menus.Button
                icon={<ArrowRightOnRectangleIcon height={16} width={16} />}
                onClick={() => null}
                disabled={false}
              >
                <span>Log out</span>
              </Menus.Button>
            </div>
          </Menus.List>
        </Menus.Menu>
      </Menus>
    </StyledHeader>
  );
}

export default Header;
