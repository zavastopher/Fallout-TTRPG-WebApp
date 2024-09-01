import React from "react";

type TitleProps = {
  title: string;
};

export function Title({ title }: TitleProps) {
  return (
    <div className="title">
      <div className="title-box">
        <span>{title}</span>
      </div>
    </div>
  );
}
