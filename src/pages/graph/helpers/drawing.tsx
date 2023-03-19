import { MutableRefObject, useContext } from 'react';
import GraphContext from '../GraphContext';
import { Action } from '../hooks/useHistoryState';

//for border room for drawing
export const OFFSET = 50;

//drawing functions
export const handleStartPoint = (
  event: any,
  id: string,
  startNode: MutableRefObject<string>,
  setIsDrawing: (val: boolean) => void,
  drawingMode: boolean
) => {
  console.log('starting');
  startNode.current = id;
  setIsDrawing(true);
};

export type Coord = {
  x: number;
  y: number;
};
export const handleDrawing = (
  event: any,
  points: Coord[],
  setPoints: (val: Coord[]) => void
) => {
  setPoints([...points, { x: event.clientX, y: event.clientY }]);
};

export const handleEndPoint = (
  event: any,
  id: string,
  endNode: MutableRefObject<string>,
  setIsDrawing: (val: boolean) => void,
  setPoints: (val: any) => void,
  setDrawingMode: (val: boolean) => void
) => {
  setPoints([]);
  endNode.current = id;

  setIsDrawing(false);
};

export const isCircle = (coords: Coord[]) => {
  let xAvg = 0;
  let yAvg = 0;
  for (const coord in coords) {
    xAvg += coords[coord].x;
    yAvg += coords[coord].y;
  }
  xAvg = xAvg / coords.length;
  yAvg = yAvg / coords.length;
  let avgDist = 0;
  for (const coord in coords) {
    let dx = coords[coord].x - xAvg;
    let dy = coords[coord].y - yAvg;
    avgDist += Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
  }
  avgDist = avgDist / coords.length;
  const min = avgDist * 0.8;
  const max = avgDist * 1.2;
  let countWithin = 0;
  for (const coord in coords) {
    let dx = coords[coord].x - xAvg;
    let dy = coords[coord].y - yAvg;
    let distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    if (distance >= min && distance <= max) {
      countWithin = countWithin + 1;
    }
  }
  let startPoint = coords[0];
  let endPoint = coords[coords.length - 1];
  // const m1 = (startPoint.y * -1 - yAvg) / (startPoint.x - xAvg);
  // const m2 = (endPoint.y * -1 - yAvg) / (endPoint.x - xAvg);
  console.log('startPoint ' + JSON.stringify(startPoint));
  console.log('endPoint ' + JSON.stringify(endPoint));
  console.log('center x:' + xAvg + ' y:' + yAvg);
  // console.log('slope from startpoint ' + m1);
  // console.log('slope from endpoint ' + m2);

  // console.log('angle ' + m1 + ' ' + m2);
  // const angle = Math.atan(m2 - m1 / (1 + m1 * m2));
  // console.log('angle ' + angle * (180 / Math.PI));

  const angle = calculateAngle(startPoint, { x: xAvg, y: yAvg }, endPoint);
  return {
    // circle: countWithin / coords.length >= 0.5,
    circle: Math.abs(angle) < 90,
    center: [xAvg, yAvg],
    size: avgDist,
  };
};

export const calculateAngle = (
  startPoint: Coord,
  middlePoint: Coord,
  endPoint: Coord
) => {
  const dotProduct =
    (startPoint.x - middlePoint.x) * (endPoint.x - middlePoint.x) +
    (middlePoint.y - startPoint.y) * (middlePoint.y - endPoint.y);
  let len1 = Math.sqrt(
    Math.pow(startPoint.x - middlePoint.x, 2) +
      Math.pow(startPoint.y - middlePoint.y, 2)
  );
  let len2 = Math.sqrt(
    Math.pow(endPoint.x - middlePoint.x, 2) +
      Math.pow(endPoint.y - middlePoint.y, 2)
  );

  const angle = Math.acos(dotProduct / (len1 * len2));
  return (angle * 180) / Math.PI;
};

export const isArrow = (coords: Coord[]) => {
  const startPoint = coords[0];
  const endPoint = coords[coords.length - 1];
  const middlePoint = coords[Math.floor(coords.length / 2)];
  console.log('coordinates of triangle: ');
  console.log('start ' + JSON.stringify(startPoint));
  console.log('middle ' + JSON.stringify(middlePoint));
  console.log('end ' + JSON.stringify(endPoint));
  const angle = calculateAngle(startPoint, middlePoint, endPoint);
  console.log('angle ' + angle);
  if (angle > 160) {
    return false;
  }
  const angle1 = calculateAngle(middlePoint, startPoint, endPoint);
  const angle2 = calculateAngle(middlePoint, endPoint, startPoint);

  if (angle1 < 90 && angle2 < 90) {
    console.log('Arrow!');
    return true;
  }
};

export const handleDrawingEnd = (
  event: any,
  setIsDrawing: (val: any) => void,
  points: Coord[],
  setPoints: (val: Coord[]) => void,
  nodes: any,
  setNodes: (val: any) => void,
  setDrawingMode: (val: boolean) => void,
  addAction: (val: Action) => void
) => {
  setIsDrawing(false);
  const { circle, center, size } = isCircle(points);
  console.log('is circle ' + circle);
  const ids = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
  ];
  if (circle) {
    let newNodes = { ...nodes };
    let dimension = Math.sqrt(Math.pow(size, 2) / 2) * 2;
    let id = ids[Object.keys(nodes).length + 1];
    newNodes[id] = {
      id: id,
      graphNode: {
        index: 0,
        x: center[0] - 200 / 2,
        y: center[1] - 75 / 2,
        // size: [dimension, dimension],
        size: [200, 75],
      },
    };
    setNodes(newNodes);
    addAction({
      undo: { id: id, value: null, type: 'ADD' },
      redo: { id: id, value: newNodes[id], type: 'ADD' },
    });
  } else {
    isArrow(points);
  }
  setPoints([]);
};

export const handleDrawingHotkey = (
  event: any,
  drawingMode: boolean,
  setDrawingMode: (val: boolean) => void
) => {
  if (event.code == 'KeyD') {
    setDrawingMode(!drawingMode);
  }
};

//When a circle is clicked
//Circle stuff not being used at the moment
// export const handleMouseDownCircle = (
//   event: any,
//   setIsDrawing: (val: boolean) => void,
//   setCanDrag: (val: boolean) => void,
//   lines: any[],
//   setLineAll: (lines: any[]) => void
// ) => {
//   setIsDrawing(true);
//   setCanDrag(false);
//   const currentCoord = { x: event.clientX, y: event.clientY };
//   setLineAll([...lines, { start: currentCoord, end: currentCoord }]);
// };

// //When mouse is released not on any circle
// const handleWrongEndpoint = (
//   setCanDrag: (val: boolean) => void,
//   lines: any[],
//   setLineAll: (lines: any[]) => void,
//   circleRefs: any[]
// ) => {
//   console.log('wrong endpoint!');
//   setLineAll(lines.pop());
//   document.removeEventListener('mousemove', (event) =>
//     handleDrawing(event, lines, setLineAll)
//   );
//   document.removeEventListener('mouseup', (event) =>
//     handleEndPoint(event, setCanDrag, lines, setLineAll, circleRefs)
//   );
//   setCanDrag(true);
// };

// //On mouse move to draw the line (not doing anything rn)
// export const handleDrawing = (
//   event: any,
//   lines: any[],
//   setLineAll: (lines: any[]) => void
// ) => {
//   console.log('drawing');
//   const currentCoord = { x: event.clientX, y: event.clientY };
//   if (lines.length == 0) {
//     return;
//   }
//   const nextLines = lines.map((e: any, i: number) => {
//     if (i === lines.length - 1) {
//       return { start: e.start, end: currentCoord };
//     } else {
//       return e;
//     }
//   });

//   setLineAll(nextLines);
// };

// //When mouse is released on another circle
// export const handleEndPoint = (
//   event: any,
//   setCanDrag: (val: boolean) => void,
//   lines: any[],
//   setLineAll: (lines: any[]) => void,
//   circleRefs: any[]
// ) => {
//   console.log('correct target!');
//   // const currentCoord = { x: event.clientX, y: event.clientY };
//   const currentCoord = { x: event.clientX, y: event.clientY };
//   if (lines.length == 0) {
//     return;
//   }
//   const nextLines = lines.map((e: any, i: number) => {
//     if (i === lines.length - 1) {
//       return { start: e.start, end: currentCoord };
//       // return { start: circleRefs[0], end: circleRefs[1] };
//     } else {
//       return e;
//     }
//   });

//   setLineAll(nextLines);
//   document.removeEventListener('mousemove', (event) =>
//     handleDrawing(event, lines, setLineAll)
//   );
//   document.removeEventListener('mouseup', (event) =>
//     handleWrongEndpoint(setCanDrag, lines, setLineAll, circleRefs)
//   );
//   setCanDrag(true);
//   for (const ref in circleRefs) {
//     (circleRefs[ref].current as any).removeEventListener(
//       'mouseup',
//       handleEndPoint
//     );
//   }
// };
