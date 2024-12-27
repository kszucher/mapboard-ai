import { FC } from 'react';
import { Logo } from './appBar/Logo.tsx';
import { MapSelector } from './appBar/MapSelector.tsx';
import { ConfigMouse } from './appBar/ConfigMouse.tsx';
import { NodeInsert } from './appBar/NodeInsert.tsx';
import { NodeRedo } from './appBar/NodeRedo.tsx';
import { NodeUndo } from './appBar/NodeUndo.tsx';
import { UserAccount } from './appBar/UserAccount.tsx';
import { ConfigView } from './appBar/ConfigView.tsx';

export const AppBar: FC = () => {
  return (
    <div className="dark:bg-zinc-800 bg-zinc-50 dark:border-neutral-700 fixed top-0 left-0 w-screen h-[40px] z-50">
      <Logo />

      <MapSelector />

      <div className="fixed flex right-1 gap-6 h-[40px]">
        <div className="flex items-center gap-1">
          <NodeInsert />
        </div>

        <div className="flex flex-row items-center gap-1">
          <NodeUndo />
          <NodeRedo />
        </div>

        <div className="flex flex-row items-center gap-1">
          <ConfigMouse />
          <ConfigView />
          <UserAccount />
        </div>
      </div>
    </div>
  );
};
