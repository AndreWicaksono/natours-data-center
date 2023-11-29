import { FC, MouseEventHandler } from "react";

import { XCircleIcon } from "@heroicons/react/24/outline";

import { ImgContainer } from "src/components/Atoms/FileInput";

const PreviewPhotoList: FC<{
  data: Array<{ id: string; src: string }>;
  onDiscardPhoto: MouseEventHandler<HTMLButtonElement>;
}> = ({ data, onDiscardPhoto }) => {
  if (data.length === 0) return null;

  return (
    <>
      {data.map((item) => (
        <ImgContainer key={item.id}>
          <button
            name={item.id}
            onClick={(e) => {
              if (onDiscardPhoto) onDiscardPhoto(e);
            }}
            type="button"
            value={item.id}
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
            height={160}
            width={240}
            style={{ objectFit: "cover" }}
          />
        </ImgContainer>
      ))}
    </>
  );
};

export default PreviewPhotoList;
