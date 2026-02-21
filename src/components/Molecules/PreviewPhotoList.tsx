import { FC, MouseEventHandler } from "react";
import styled from "styled-components";

import { XCircleIcon } from "@heroicons/react/24/outline";
import { ImgContainer } from "src/components/Atoms/FormInput/FileInput";

// Enhanced image container with better mobile styling
const EnhancedImgContainer = styled(ImgContainer)`
  position: relative;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);

  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }

  /* Delete button positioning */
  button {
    position: absolute;
    top: 0.4rem;
    right: 0.4rem;
    z-index: 2;

    backdrop-filter: blur(4px);
    background-color: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 50%;
    padding: 0.4rem;
    margin: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow-sm);

    &:hover {
      background: var(--color-danger-light);
      svg {
        color: var(--color-danger-base);
      }
    }

    &:active {
      transform: scale(0.95);
    }

    /* Mobile: Larger touch target */
    @media (max-width: 768px) {
      top: 0.6rem;
      right: 0.6rem;
      padding: 0.6rem;

      svg {
        width: 2.8rem !important;
        height: 2.8rem !important;
      }
    }

    @media (max-width: 480px) {
      top: 0.8rem;
      right: 0.8rem;
      padding: 0.8rem;
    }

    @media (prefers-reduced-motion: reduce) {
      transition:
        background-color 0.2s ease,
        box-shadow 0.2s ease;

      &:hover {
        transform: none;
      }

      &:active {
        transform: none;
      }
    }
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: box-shadow 0.2s ease;

    &:hover {
      transform: none;

      img {
        transform: none;
      }
    }
  }
`;

const PreviewPhotoList: FC<{
  data: Array<{ id: string; src: string }>;
  onDiscardPhoto: MouseEventHandler<HTMLButtonElement>;
}> = ({ data, onDiscardPhoto }) => {
  if (data.length === 0) return null;

  return (
    <>
      {data.map((item) => (
        <EnhancedImgContainer key={item.id}>
          <button
            name={item.id}
            onClick={(e) => {
              if (onDiscardPhoto) onDiscardPhoto(e);
            }}
            type="button"
            value={item.id}
            aria-label={`Remove photo ${item.id}`}
          >
            <XCircleIcon
              height={24}
              width={24}
              color="var(--color-grey-800)"
              fill="var(--color-zinc-100)"
              strokeOpacity={0.5}
            />
          </button>

          <img
            src={item.src}
            alt={`Preview ${item.id}`}
            height={160}
            width={240}
            style={{ objectFit: "cover" }}
            loading="lazy"
          />
        </EnhancedImgContainer>
      ))}
    </>
  );
};

export default PreviewPhotoList;
