import styled from "styled-components";

import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "@tanstack/react-router";

import Menus from "src/components/Molecules/Menus";
import ProfilePicture from "src/components/Molecules/ProfilePicture";

import { requestLogout } from "src/API/REST/POST/Auth";
import { cookieKey } from "src/Global/Constants";
import { useAuthContext } from "src/hooks/useAuthContext";
import useClientCookie from "src/hooks/useClientCookie";

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
  const { deleteCookie, getCookie } = useClientCookie();
  const { authContext } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async (token: string): Promise<void> => {
    if (token) {
      const response = await requestLogout(token);

      if (response.toString().startsWith("2")) {
        deleteCookie({ cookieKey, path: "/" });
        navigate({ replace: true, to: "/login" });
      }
    }
  };

  return (
    <StyledHeader>
      <Menus>
        <Menus.Menu>
          <Menus.Toggle id={"btn-user"} $icon={{ $height: 3.6, $width: 3.6 }}>
            <ProfilePicture
              imgSrc={
                authContext.photo.location
                  ? `${
                      import.meta.env.VITE_URL_SERVER
                    }/storage/v1/object/public/${authContext.photo.location}`
                  : ""
              }
              textName={`${authContext.firstName || ""} ${
                authContext.lastName || ""
              }`}
            />
          </Menus.Toggle>

          <Menus.List id={"btn-user"}>
            <div>
              <Menus.Button
                icon={<UserIcon height={16} width={16} />}
                onClick={(e) => {
                  e.preventDefault();

                  navigate({ to: "/account" });
                }}
                disabled={false}
              >
                <span>Account</span>
              </Menus.Button>

              <Menus.Button
                icon={<ArrowRightOnRectangleIcon height={16} width={16} />}
                onClick={(e) => {
                  e.preventDefault();

                  handleLogout(getCookie(cookieKey) ?? "");
                }}
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
