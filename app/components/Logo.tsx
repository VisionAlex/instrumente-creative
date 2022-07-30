import React from "react";
import Img from "./Img";

export const Logo: React.FC = () => {
    return (
        <div className="cursor-pointer">
            <Img src="/assets/logo.webp" alt="logo" width={78} height={78} />
        </div>
    );
};
