import React from 'react';
import type { PropsWithChildren } from 'react';
import './Stage.css';

const Stage: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    return <div  className="grid-background">{children}</div>;
};

export default Stage;