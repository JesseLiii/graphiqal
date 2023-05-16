import React, { useContext, useState } from 'react';
import IconCircleButton from '../../molecules/IconCircleButton';
import { Dropdown, ItemProps } from '../Dropdown';
import ViewContext, { ViewContextInterface } from '../../context/ViewContext';
import { createGraphView } from '../../../backend/functions/graph/createGraphView';
import Graph2 from '../../../packages/graph/Graph';

export const Tabs: React.FC<{ children: any }> = ({ children }) => {
  const { windowVar, username, nodeId, setMainViewTabs, mainViewTabs } =
    useContext(ViewContext) as ViewContextInterface;
  const [showDropdown, setShowDropdown] = useState(false);

  const items: ItemProps[] = [
    {
      text: 'Empty graph',
      onPress: () => {
        createGraphView(username, nodeId);
      },
    },
    { text: 'Duplicate graph', onPress: () => null },
  ];
  return (
    <div className='flex flex-row bg-blue-50 w-full items-center align-middle'>
      {children}
      <div className='ml-[0.5rem]'>
        <IconCircleButton
          circle={false}
          src='plus'
          onClick={() => setShowDropdown(!showDropdown)}
        />
        {showDropdown && (
          <Dropdown
            items={items}
            list
            activeIndex={-1}
            windowVar={windowVar}
            showDropdown={showDropdown}
            setShowDropdown={setShowDropdown}
          />
        )}
      </div>
    </div>
  );
};
