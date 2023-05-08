import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
// import SplitPane, {
// 	Divider,
// 	SplitPaneBottom,
// 	SplitPaneLeft,
// 	SplitPaneRight,
// 	SplitPaneTop,
// } from '../../src/components/organisms/split-pane/SplitPane';
// import Document from '../../src/pages/document/Document';

import { useRouter } from 'next/router';
import ShelfEditor from '../../packages/shelf-editor/ShelfEditor';
import SplitPane, {
  Divider,
  SplitPaneBottom,
  SplitPaneLeft,
  SplitPaneRight,
  SplitPaneTop,
} from '../../components/organisms/split-pane/SplitPane';
import EditorComponent from '../../packages/editor/EditorComponent';
import { getDocument } from '../../backend/functions/getDocument';
import TextButton from '../../components/molecules/TextButton';
import useSWR from 'swr';
import { fetcher } from '../../backend/driver/fetcher';
import DocumentSideTabs, {
  SideTabPropsDoc,
} from '../../components/organisms/Tabs/DocumentSideTabs';

const SplitPaneWrapper: React.FC<{ viewId: string }> = ({ viewId }) => {
  const router = useRouter();
  const { username, nodeId } = router.query;
  const [nodeData, setnodeData] = useState();

  // const { data, error } = useSWR(id ? `/api/user/${id}` : null, fetcher)

  // useEffect(() => {
  // 	if (!router.isReady) return;
  // 	// get Node
  // 	getDocument(nodeId as string, username as string);
  // }, [router.isReady]);

  const [sideTabs, setSideTabs] = useState<SideTabPropsDoc[]>([
    {
      label: 'Connections',
      viewType: 'connections',
    },
    {
      label: 'Content',
      viewType: 'content',
    },
    {
      label: 'Shelf',
      viewType: 'shelf',
    },
  ]);

  const [currTab, setCurrTab] = useState(0);

  return (
    <DndProvider backend={HTML5Backend}>
      <SplitPane className='split-pane-row'>
        <SplitPaneLeft>
          <EditorComponent textIn={'Showing content of ' + nodeId} />
        </SplitPaneLeft>
        <Divider className='separator-col' />
        <SplitPaneRight>
          <DocumentSideTabs
            tabs={sideTabs}
            setTabs={setSideTabs}
            currTab={currTab}
            setCurrTab={setCurrTab}
          />
          {sideTabs[currTab].viewType == 'connections' && (
            <EditorComponent textIn={'connections'} />
          )}
          {sideTabs[currTab].viewType == 'content' && (
            <EditorComponent textIn={'content'} />
          )}
          {sideTabs[currTab].viewType == 'shelf' && <ShelfEditor />}
        </SplitPaneRight>
      </SplitPane>
    </DndProvider>
  );
};
export default SplitPaneWrapper;
