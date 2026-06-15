import React from "react";
import { MdChevronRight } from "react-icons/md";

interface BreadcrumbProps {
  paths: string[];
  activePath: string;
}

export const Breadcrumbs: React.FC<BreadcrumbProps> = ({
  paths,
  activePath,
}) => {
  return (
    <nav className="flex items-center gap-2 mb-8 flex-wrap font-poppins">
      {paths.map((path, index) => (
        <React.Fragment key={index}>
          <span className="text-[#727272] text-[24px] font-medium whitespace-nowrap">
            {path}
          </span>
          <MdChevronRight className="text-[#727272] text-2xl" />
        </React.Fragment>
      ))}
      <span className="text-[#FF7050] text-[24px] font-medium">
        {activePath}
      </span>
    </nav>
  );
};
