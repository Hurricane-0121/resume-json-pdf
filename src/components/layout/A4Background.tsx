import { ReactNode } from "react";
interface A4BackgroundProps {
  page: number;
  children: ReactNode;
}

const A4Background: React.FC<A4BackgroundProps> = ({ page, children }) => {
  return (
    <div
      className={`print-remove-styles flex flex-col items-center bg-white overflow-auto overflow-x-hidden 
         ${page > 1 ? "max-sm:-mt-[625px]" : ""}`}
    >
      <div
        className={`export-page print-remove-styles mb-6 max-sm:scale-[0.4] bg-white shadow-sm ${
          page > 1 ? "" : "max-sm:-mt-56"
        }`}
        // style={{
        //   height: '297mm',
        //   transform: 'translateZ(0)',
        //   backgroundColor: '#243433'
        // }}
      >
        {children}
      </div>
    </div>
  );
};

export default A4Background;