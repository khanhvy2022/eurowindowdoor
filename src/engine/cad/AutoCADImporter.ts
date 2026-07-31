// @ts-nocheck
import { CadEntity } from '@/types/planner/cad';
import { DoorLibraryItem } from '@/types/planner/doorLibrary';

/**
 * AutoCAD Importer Utility
 * Converts parametric door and window properties into structured AutoCAD 2D drawing entities.
 * Generates lines, arcs, circles, and texts with layers, colors, and line types.
 */
export function generate2DCadEntities(
  item: DoorLibraryItem,
  width: number, // in mm
  height: number, // in mm
  options: {
    isOpen?: boolean;
    openAngle?: number; // 0 to 1
    hingeSide?: 'left' | 'right';
    openDirection?: 'inward' | 'outward';
    tracks?: number;
    isDouble?: boolean;
    panelsCount?: number;
    frameColor?: string;
  } = {}
): CadEntity[] {
  const {
    isOpen = false,
    openAngle = 0.8,
    hingeSide = 'left',
    openDirection = 'outward',
    tracks = 2,
    isDouble = false,
    panelsCount = 1,
    frameColor = '#33ff57' // Default green CAD layer color
  } = options;

  const entities: CadEntity[] = [];
  const halfW = width / 2;
  const depth = 120; // standard frame depth in mm
  const halfD = depth / 2;
  
  const layerFrame = 'A-FRAME';
  const layerLeaf = 'A-DOORS';
  const layerSwing = 'A-SWING-DASH';
  const layerGlass = 'A-GLASS';
  const layerText = 'A-ANNOTATION';

  // Helper to push CAD entities
  const addLine = (x1: number, y1: number, x2: number, y2: number, layer: string, color: string) => {
    entities.push({
      id: `line_${Math.random().toString(36).substring(2, 9)}`,
      type: 'LINE',
      layer,
      color,
      x1,
      y1,
      x2,
      y2
    });
  };

  const addArc = (cx: number, cy: number, r: number, startAngle: number, endAngle: number, layer: string, color: string) => {
    entities.push({
      id: `arc_${Math.random().toString(36).substring(2, 9)}`,
      type: 'ARC',
      layer,
      color,
      cx,
      cy,
      r,
      startAngle,
      endAngle
    });
  };

  const addText = (x: number, y: number, text: string, fontSize: number, layer: string, color: string) => {
    entities.push({
      id: `text_${Math.random().toString(36).substring(2, 9)}`,
      type: 'TEXT',
      layer,
      color,
      x,
      y,
      text,
      fontSize
    });
  };

  const addRect = (x1: number, y1: number, x2: number, y2: number, layer: string, color: string) => {
    addLine(x1, y1, x2, y1, layer, color);
    addLine(x2, y1, x2, y2, layer, color);
    addLine(x2, y2, x1, y2, layer, color);
    addLine(x1, y2, x1, y1, layer, color);
  };

  // 1. Draw Outer Frame Box
  addRect(-halfW, -halfD, halfW, halfD, layerFrame, frameColor);

  // Draw jamb offsets (frame thickness lines)
  const profileSystem = item.metadata?.profileSystem || 'EA55';
  const fThick = (profileSystem === 'FA52' || profileSystem === 'GD50') ? 52 : (item.category === 'curtain_wall' ? 52 : 50);
  addLine(-halfW + fThick, -halfD, -halfW + fThick, halfD, layerFrame, frameColor);
  addLine(halfW - fThick, -halfD, halfW - fThick, halfD, layerFrame, frameColor);

  // 2. Generate details based on Category
  const cat = item.category;

  if (cat === 'swing_door' || cat === 'floor_hinge') {
    const isLeft = hingeSide === 'left';
    const leafThickness = 40;
    const isOut = openDirection === 'outward';
    const directionSign = isOut ? -1 : 1;
    const currentAngle = isOpen ? (openAngle * Math.PI / 2) : 0;
    const mullionW = fThick;

    if (tracks === 23) {
      // Swing Door with 2 Side Fixes
      const activeW = isDouble 
        ? Math.min(1600, width - 800) 
        : Math.min(900, width - 400);

      // Draw two vertical mullions at -activeW/2 and activeW/2
      addRect(-activeW / 2 - mullionW / 2, -halfD, -activeW / 2 + mullionW / 2, halfD, layerFrame, frameColor);
      addRect(activeW / 2 - mullionW / 2, -halfD, activeW / 2 + mullionW / 2, halfD, layerFrame, frameColor);

      // Draw fixed glass on outer parts
      addLine(-halfW + fThick, 0, -activeW / 2 - mullionW / 2, 0, layerGlass, '#c0c0c0');
      addLine(activeW / 2 + mullionW / 2, 0, halfW - fThick, 0, layerGlass, '#c0c0c0');

      if (isDouble) {
        // Double doors in the middle bay
        const leafLen = activeW / 2 - mullionW / 2;
        // Left Panel (hinge on left mullion)
        const leftHingeX = -activeW / 2 + mullionW / 2;
        const leftHingeY = directionSign * halfD;
        const leftFinalAngle = directionSign * currentAngle;
        const leftEndX = leftHingeX + leafLen * Math.cos(leftFinalAngle);
        const leftEndY = leftHingeY + leafLen * Math.sin(leftFinalAngle);
        addLine(leftHingeX, leftHingeY, leftEndX, leftEndY, layerLeaf, '#ff4f4f');

        // Right Panel (hinge on right mullion)
        const rightHingeX = activeW / 2 - mullionW / 2;
        const rightHingeY = directionSign * halfD;
        const rightFinalAngle = Math.PI - directionSign * currentAngle;
        const rightEndX = rightHingeX + leafLen * Math.cos(rightFinalAngle);
        const rightEndY = rightHingeY + leafLen * Math.sin(rightFinalAngle);
        addLine(rightHingeX, rightHingeY, rightEndX, rightEndY, layerLeaf, '#ff4f4f');

        if (isOpen) {
          addArc(leftHingeX, leftHingeY, leafLen, Math.min(0, leftFinalAngle), Math.max(0, leftFinalAngle), layerSwing, '#33f0ff');
          addArc(rightHingeX, rightHingeY, leafLen, Math.min(Math.PI, rightFinalAngle), Math.max(Math.PI, rightFinalAngle), layerSwing, '#33f0ff');
        }
      } else {
        // Single door in middle bay
        const leafLen = activeW - mullionW;
        const hingeX = isLeft ? -activeW / 2 + mullionW / 2 : activeW / 2 - mullionW / 2;
        const hingeY = directionSign * halfD;
        const finalAngle = isLeft 
          ? directionSign * currentAngle 
          : Math.PI - directionSign * currentAngle;

        const endX = hingeX + leafLen * Math.cos(finalAngle);
        const endY = hingeY + leafLen * Math.sin(finalAngle);
        addLine(hingeX, hingeY, endX, endY, layerLeaf, '#ff4f4f');

        if (isOpen) {
          const startRad = isLeft ? 0 : Math.PI;
          addArc(hingeX, hingeY, leafLen, Math.min(startRad, finalAngle), Math.max(startRad, finalAngle), layerSwing, '#33f0ff');
        }
      }
    } else if (tracks === 11 || tracks === 14 || [31, 32, 33, 34, 41, 42, 43, 44].includes(tracks)) {
      // Swing Door with 1 Side Fix / Window (or Top + Side Fix / Window)
      const activeW = isDouble 
        ? Math.min(1600, width - 400) 
        : Math.min(900, width - 200);

      // Mullion position x = halfW - activeW
      const mullionX = halfW - activeW;

      // Draw vertical mullion
      addRect(mullionX - mullionW / 2, -halfD, mullionX + mullionW / 2, halfD, layerFrame, frameColor);

      // Draw left side component (Fixed Glass or Window)
      const winL = -halfW + fThick;
      const winR = mullionX - mullionW / 2;

      if ([11, 14, 31, 41].includes(tracks)) {
        // Fixed Glass
        addLine(winL, 0, winR, 0, layerGlass, '#c0c0c0');
      } 
      else if ([32, 42].includes(tracks)) {
        // Awning Window
        const isOut = openDirection === 'outward';
        const projectionY = isOut ? -halfD - 50 : halfD + 50;
        addLine(winL, projectionY, winR, projectionY, layerSwing, '#33f0ff');
        addLine(winL, -halfD, winL, projectionY, layerSwing, '#33f0ff');
        addLine(winR, -halfD, winR, projectionY, layerSwing, '#33f0ff');
      }
      else if ([33, 43].includes(tracks)) {
        // 2-Leaf Casement Window
        const winCenter = (winL + winR) / 2;
        // Draw center window mullion
        addRect(winCenter - mullionW / 2, -halfD, winCenter + mullionW / 2, halfD, layerFrame, frameColor);

        const leafLen = (winCenter - mullionW / 2) - winL;

        // Left Panel (hinge left)
        const leftHingeX = winL;
        const leftHingeY = directionSign * halfD;
        const leftFinalAngle = directionSign * currentAngle;
        const leftEndX = leftHingeX + leafLen * Math.cos(leftFinalAngle);
        const leftEndY = leftHingeY + leafLen * Math.sin(leftFinalAngle);
        addLine(leftHingeX, leftHingeY, leftEndX, leftEndY, layerLeaf, '#ff4f4f');

        // Right Panel (hinge right)
        const rightHingeX = winR;
        const rightHingeY = directionSign * halfD;
        const rightFinalAngle = Math.PI - directionSign * currentAngle;
        const rightEndX = rightHingeX + leafLen * Math.cos(rightFinalAngle);
        const rightEndY = rightHingeY + leafLen * Math.sin(rightFinalAngle);
        addLine(rightHingeX, rightHingeY, rightEndX, rightEndY, layerLeaf, '#ff4f4f');

        if (isOpen) {
          addArc(leftHingeX, leftHingeY, leafLen, Math.min(0, leftFinalAngle), Math.max(0, leftFinalAngle), layerSwing, '#33f0ff');
          addArc(rightHingeX, rightHingeY, leafLen, Math.min(Math.PI, rightFinalAngle), Math.max(Math.PI, rightFinalAngle), layerSwing, '#33f0ff');
        }
      }
      else if ([34, 44].includes(tracks)) {
        // 2-Leaf Sliding Window
        const winCenter = (winL + winR) / 2;
        const pWidth = (winR - winL) / 2 + 15;
        const innerSashY = -15;
        const outerSashY = 15;

        // Panel 1 (Left, Outer track)
        addRect(winL, outerSashY - 10, winL + pWidth, outerSashY + 10, layerLeaf, '#ff4f4f');
        addLine(winL + 10, outerSashY, winL + pWidth - 10, outerSashY, layerGlass, '#c0c0c0');

        // Panel 2 (Right, Inner track)
        addRect(winR - pWidth, innerSashY - 10, winR, innerSashY + 10, layerLeaf, '#ff4f4f');
        addLine(winR - pWidth + 10, innerSashY, winR - 10, innerSashY, layerGlass, '#c0c0c0');

        // Draw sliding direction chevrons
        if (isOpen) {
          const arrowOffset = (winR - winL) / 8;
          addLine(winCenter - arrowOffset, outerSashY, winCenter - arrowOffset + 20, outerSashY + 5, layerSwing, '#33f0ff');
          addLine(winCenter - arrowOffset, outerSashY, winCenter - arrowOffset + 20, outerSashY - 5, layerSwing, '#33f0ff');
          
          addLine(winCenter + arrowOffset, innerSashY, winCenter + arrowOffset - 20, innerSashY + 5, layerSwing, '#33f0ff');
          addLine(winCenter + arrowOffset, innerSashY, winCenter + arrowOffset - 20, innerSashY - 5, layerSwing, '#33f0ff');
        }
      }

      // Right side active sash(es)
      if (isDouble) {
        // Double doors in the right bay (from mullionX to halfW)
        const leafLen = activeW / 2 - mullionW / 2;
        const leftHingeX = mullionX + mullionW / 2;
        const leftHingeY = directionSign * halfD;
        const leftFinalAngle = directionSign * currentAngle;
        const leftEndX = leftHingeX + leafLen * Math.cos(leftFinalAngle);
        const leftEndY = leftHingeY + leafLen * Math.sin(leftFinalAngle);
        addLine(leftHingeX, leftHingeY, leftEndX, leftEndY, layerLeaf, '#ff4f4f');

        const rightHingeX = halfW - fThick;
        const rightHingeY = directionSign * halfD;
        const rightFinalAngle = Math.PI - directionSign * currentAngle;
        const rightEndX = rightHingeX + leafLen * Math.cos(rightFinalAngle);
        const rightEndY = rightHingeY + leafLen * Math.sin(rightFinalAngle);
        addLine(rightHingeX, rightHingeY, rightEndX, rightEndY, layerLeaf, '#ff4f4f');

        if (isOpen) {
          addArc(leftHingeX, leftHingeY, leafLen, Math.min(0, leftFinalAngle), Math.max(0, leftFinalAngle), layerSwing, '#33f0ff');
          addArc(rightHingeX, rightHingeY, leafLen, Math.min(Math.PI, rightFinalAngle), Math.max(Math.PI, rightFinalAngle), layerSwing, '#33f0ff');
        }
      } else {
        // Single door in the right bay
        const leafLen = activeW - fThick - mullionW / 2;
        const hingeX = isLeft ? mullionX + mullionW / 2 : halfW - fThick;
        const hingeY = directionSign * halfD;
        const finalAngle = isLeft 
          ? directionSign * currentAngle 
          : Math.PI - directionSign * currentAngle;

        const endX = hingeX + leafLen * Math.cos(finalAngle);
        const endY = hingeY + leafLen * Math.sin(finalAngle);
        addLine(hingeX, hingeY, endX, endY, layerLeaf, '#ff4f4f');

        if (isOpen) {
          const startRad = isLeft ? 0 : Math.PI;
          addArc(hingeX, hingeY, leafLen, Math.min(startRad, finalAngle), Math.max(startRad, finalAngle), layerSwing, '#33f0ff');
        }
      }
    } else if (!isDouble) {
      // Single Swing Door
      const hingeX = isLeft ? -halfW + fThick : halfW - fThick;
      const hingeY = directionSign * halfD;
      const finalAngle = isLeft 
        ? directionSign * currentAngle 
        : Math.PI - directionSign * currentAngle;

      const leafLen = width - fThick * 2;
      const endX = hingeX + leafLen * Math.cos(finalAngle);
      const endY = hingeY + leafLen * Math.sin(finalAngle);

      addLine(hingeX, hingeY, endX, endY, layerLeaf, '#ff4f4f');
      if (isOpen) {
        const startRad = isLeft ? 0 : Math.PI;
        addArc(hingeX, hingeY, leafLen, Math.min(startRad, finalAngle), Math.max(startRad, finalAngle), layerSwing, '#33f0ff');
      }
    } else {
      // Double Swing Door
      const leafLen = (width - fThick * 2) / 2;
      
      // Left Panel
      const leftHingeX = -halfW + fThick;
      const leftHingeY = directionSign * halfD;
      const leftFinalAngle = directionSign * currentAngle;
      const leftEndX = leftHingeX + leafLen * Math.cos(leftFinalAngle);
      const leftEndY = leftHingeY + leafLen * Math.sin(leftFinalAngle);
      addLine(leftHingeX, leftHingeY, leftEndX, leftEndY, layerLeaf, '#ff4f4f');

      // Right Panel
      const rightHingeX = halfW - fThick;
      const rightHingeY = directionSign * halfD;
      const rightFinalAngle = Math.PI - directionSign * currentAngle;
      const rightEndX = rightHingeX + leafLen * Math.cos(rightFinalAngle);
      const rightEndY = rightHingeY + leafLen * Math.sin(rightFinalAngle);
      addLine(rightHingeX, rightHingeY, rightEndX, rightEndY, layerLeaf, '#ff4f4f');

      if (isOpen) {
        addArc(leftHingeX, leftHingeY, leafLen, Math.min(0, leftFinalAngle), Math.max(0, leftFinalAngle), layerSwing, '#33f0ff');
        addArc(rightHingeX, rightHingeY, leafLen, Math.min(Math.PI, rightFinalAngle), Math.max(Math.PI, rightFinalAngle), layerSwing, '#33f0ff');
      }
    }
  } 
  else if (cat === 'sliding_door' || cat === 'sliding_window') {
    // Sliding Door: Two or more panels parallel to wall axis (staggered)
    const pCount = options.panelsCount || 
      ((item.name.includes('4 cánh') || item.name.includes('4 Cánh') || item.sourceFile.includes('4 CANH') || item.sourceFile.includes('4-panel') || (item.metadata as any)?.panelsCount === 4) ? 4 : 
      ((item.name.includes('3 cánh') || item.name.includes('3 Cánh') || item.sourceFile.includes('3 CANH') || item.sourceFile.includes('3-panel') || (item.metadata as any)?.panelsCount === 3) ? 3 : 2));

    const innerSashY = -15;
    const outerSashY = 15;

    if (pCount === 4) {
      const pWidth = (width - fThick * 2) / 4;

      // Panel 1 (Leftmost, Outer track)
      addRect(-halfW + fThick, outerSashY - 10, -halfW + fThick + pWidth, outerSashY + 10, layerLeaf, '#ff4f4f');
      addLine(-halfW + fThick + 10, outerSashY, -halfW + fThick + pWidth - 10, outerSashY, layerGlass, '#c0c0c0');

      // Panel 4 (Rightmost, Outer track)
      addRect(halfW - fThick - pWidth, outerSashY - 10, halfW - fThick, outerSashY + 10, layerLeaf, '#ff4f4f');
      addLine(halfW - fThick - pWidth + 10, outerSashY, halfW - fThick - 10, outerSashY, layerGlass, '#c0c0c0');

      // Panel 2 (Inner-left, Inner track)
      addRect(-halfW + fThick + pWidth, innerSashY - 10, -halfW + fThick + 2 * pWidth, innerSashY + 10, layerLeaf, '#ff4f4f');
      addLine(-halfW + fThick + pWidth + 10, innerSashY, -halfW + fThick + 2 * pWidth - 10, innerSashY, layerGlass, '#c0c0c0');

      // Panel 3 (Inner-right, Inner track)
      addRect(halfW - fThick - 2 * pWidth, innerSashY - 10, halfW - fThick - pWidth, innerSashY + 10, layerLeaf, '#ff4f4f');
      addLine(halfW - fThick - 2 * pWidth + 10, innerSashY, halfW - fThick - pWidth - 10, innerSashY, layerGlass, '#c0c0c0');

      // Direction arrows (inner panels slide outwards)
      if (isOpen) {
        addLine(-20, innerSashY, -100, innerSashY, layerSwing, '#33f0ff');
        addLine(-100, innerSashY, -90, innerSashY + 5, layerSwing, '#33f0ff');
        addLine(-100, innerSashY, -90, innerSashY - 5, layerSwing, '#33f0ff');

        addLine(20, innerSashY, 100, innerSashY, layerSwing, '#33f0ff');
        addLine(100, innerSashY, 90, innerSashY + 5, layerSwing, '#33f0ff');
        addLine(100, innerSashY, 90, innerSashY - 5, layerSwing, '#33f0ff');
      }
    } 
    else if (pCount === 3) {
      const pWidth = (width - fThick * 2) / 3;

      // 3-track sliding (ray 1, ray 2, ray 3)
      // Panel 1 (leftmost, track 1)
      addRect(-halfW + fThick, outerSashY + 10 - 10, -halfW + fThick + pWidth, outerSashY + 10 + 10, layerLeaf, '#ff4f4f');
      addLine(-halfW + fThick + 10, outerSashY + 10, -halfW + fThick + pWidth - 10, outerSashY + 10, layerGlass, '#c0c0c0');

      // Panel 2 (middle, track 2)
      addRect(-halfW + fThick + pWidth, outerSashY - 10, -halfW + fThick + 2 * pWidth, outerSashY + 10, layerLeaf, '#ff4f4f');
      addLine(-halfW + fThick + pWidth + 10, outerSashY, -halfW + fThick + 2 * pWidth - 10, outerSashY, layerGlass, '#c0c0c0');

      // Panel 3 (rightmost, track 3)
      addRect(halfW - fThick - pWidth, innerSashY - 10, halfW - fThick, innerSashY + 10, layerLeaf, '#ff4f4f');
      addLine(halfW - fThick - pWidth + 10, innerSashY, halfW - fThick - 10, innerSashY, layerGlass, '#c0c0c0');

      // Direction arrows (middle and right panels slide left)
      if (isOpen) {
        // Arrow for panel 2
        addLine(-halfW + fThick + 1.5 * pWidth + 20, outerSashY, -halfW + fThick + 1.5 * pWidth - 40, outerSashY, layerSwing, '#33f0ff');
        addLine(-halfW + fThick + 1.5 * pWidth - 40, outerSashY, -halfW + fThick + 1.5 * pWidth - 30, outerSashY + 5, layerSwing, '#33f0ff');
        addLine(-halfW + fThick + 1.5 * pWidth - 40, outerSashY, -halfW + fThick + 1.5 * pWidth - 30, outerSashY - 5, layerSwing, '#33f0ff');

        // Arrow for panel 3
        addLine(halfW - fThick - 0.5 * pWidth + 20, innerSashY, halfW - fThick - 0.5 * pWidth - 40, innerSashY, layerSwing, '#33f0ff');
        addLine(halfW - fThick - 0.5 * pWidth - 40, innerSashY, halfW - fThick - 0.5 * pWidth - 30, innerSashY + 5, layerSwing, '#33f0ff');
        addLine(halfW - fThick - 0.5 * pWidth - 40, innerSashY, halfW - fThick - 0.5 * pWidth - 30, innerSashY - 5, layerSwing, '#33f0ff');
      }
    } 
    else {
      const pWidth = (width - fThick * 2) / 2;

      // Panel 1 (Left, Outer track)
      addRect(-halfW + fThick, outerSashY - 10, -halfW + fThick + pWidth, outerSashY + 10, layerLeaf, '#ff4f4f');
      addLine(-halfW + fThick + 10, outerSashY, -halfW + fThick + pWidth - 10, outerSashY, layerGlass, '#c0c0c0');

      // Panel 2 (Right, Inner track)
      addRect(halfW - fThick - pWidth, innerSashY - 10, halfW - fThick, innerSashY + 10, layerLeaf, '#ff4f4f');
      addLine(halfW - fThick - pWidth + 10, innerSashY, halfW - fThick - 10, innerSashY, layerGlass, '#c0c0c0');

      // Direction arrows
      if (isOpen) {
        addLine(-50, outerSashY, -10, outerSashY, layerSwing, '#33f0ff');
        addLine(-10, outerSashY, -20, outerSashY + 5, layerSwing, '#33f0ff');
        addLine(-10, outerSashY, -20, outerSashY - 5, layerSwing, '#33f0ff');

        addLine(50, innerSashY, 10, innerSashY, layerSwing, '#33f0ff');
        addLine(10, innerSashY, 20, innerSashY + 5, layerSwing, '#33f0ff');
        addLine(10, innerSashY, 20, innerSashY - 5, layerSwing, '#33f0ff');
      }
    }
  } 
  else if (cat === 'folding_door') {
    // Folding Door: accordion-style sashes folding to one side
    const pCount = panelsCount || 3;
    const pWidth = (width - fThick * 2) / pCount;
    
    // Draw folded sashes accordion lines
    let currentX = -halfW + fThick;
    const foldAngle = isOpen ? Math.PI / 4 : 0; // 45 degrees folded

    for (let p = 0; p < pCount; p++) {
      const isFoldUp = p % 2 === 0;
      const angle = isFoldUp ? foldAngle : -foldAngle;
      
      const nextX = currentX + pWidth * Math.cos(angle);
      const nextY = p === 0 ? 0 : (isFoldUp ? pWidth * Math.sin(angle) : 0);

      addLine(currentX, p === 0 ? 0 : (isFoldUp ? 0 : pWidth * Math.sin(-angle)), nextX, nextY, layerLeaf, '#ff4f4f');
      currentX = nextX;
    }
  } 
  else if (cat === 'casement_window') {
    // Casement Window: Similar to swing door but shorter frame depth
    const isLeft = hingeSide === 'left';
    const numPanels = tracks === 3 ? 3 : (isDouble ? 2 : 1);
    const directionSign = openDirection === 'outward' ? -1 : 1;
    const currentAngle = isOpen ? (openAngle * Math.PI / 3) : 0; // window opens less (60 deg max)

    if (tracks === 23) {
      // 2 Sashes + 2 Side Fixes
      const mullionW = fThick;
      
      // Draw mullions
      addRect(-width / 4 - mullionW / 2, -halfD, -width / 4 + mullionW / 2, halfD, layerFrame, frameColor);
      addRect(width / 4 - mullionW / 2, -halfD, width / 4 + mullionW / 2, halfD, layerFrame, frameColor);
      
      // Draw fixed glass
      addLine(-halfW + fThick, 0, -width / 4 - mullionW / 2, 0, layerGlass, '#c0c0c0');
      addLine(width / 4 + mullionW / 2, 0, halfW - fThick, 0, layerGlass, '#c0c0c0');
      
      const leafLen = width / 4 - mullionW / 2;
      
      // Left Panel (hinge left)
      const leftHingeX = -width / 4 + mullionW / 2;
      const leftHingeY = directionSign * halfD;
      const leftFinalAngle = directionSign * currentAngle;
      const leftEndX = leftHingeX + leafLen * Math.cos(leftFinalAngle);
      const leftEndY = leftHingeY + leafLen * Math.sin(leftFinalAngle);
      addLine(leftHingeX, leftHingeY, leftEndX, leftEndY, layerLeaf, '#ff4f4f');
      
      // Right Panel (hinge right)
      const rightHingeX = width / 4 - mullionW / 2;
      const rightHingeY = directionSign * halfD;
      const rightFinalAngle = Math.PI - directionSign * currentAngle;
      const rightEndX = rightHingeX + leafLen * Math.cos(rightFinalAngle);
      const rightEndY = rightHingeY + leafLen * Math.sin(rightFinalAngle);
      addLine(rightHingeX, rightHingeY, rightEndX, rightEndY, layerLeaf, '#ff4f4f');
      
      if (isOpen) {
        const leftStartRad = 0;
        addArc(leftHingeX, leftHingeY, leafLen, Math.min(leftStartRad, leftFinalAngle), Math.max(leftStartRad, leftFinalAngle), layerSwing, '#33f0ff');
        
        const rightStartRad = Math.PI;
        addArc(rightHingeX, rightHingeY, leafLen, Math.min(rightStartRad, rightFinalAngle), Math.max(rightStartRad, rightFinalAngle), layerSwing, '#33f0ff');
      }
    } else if (tracks === 11) {
      // 1 Sash + 1 Side Fix
      const mullionW = fThick;
      
      // Center Mullion
      addRect(-mullionW / 2, -halfD, mullionW / 2, halfD, layerFrame, frameColor);
      
      // Left side fixed glass
      addLine(-halfW + fThick, 0, -mullionW / 2, 0, layerGlass, '#c0c0c0');
      
      // Right side active sash
      const leafLen = halfW - fThick - mullionW / 2;
      
      const hingeX = isLeft ? mullionW / 2 : halfW - fThick;
      const hingeY = directionSign * halfD;
      const finalAngle = isLeft 
        ? directionSign * currentAngle 
        : Math.PI - directionSign * currentAngle;
      
      const endX = hingeX + leafLen * Math.cos(finalAngle);
      const endY = hingeY + leafLen * Math.sin(finalAngle);
      addLine(hingeX, hingeY, endX, endY, layerLeaf, '#ff4f4f');
      
      if (isOpen) {
        const startRad = isLeft ? 0 : Math.PI;
        addArc(hingeX, hingeY, leafLen, Math.min(startRad, finalAngle), Math.max(startRad, finalAngle), layerSwing, '#33f0ff');
      }
    } else if (numPanels === 1) {
      const hingeX = isLeft ? -halfW + fThick : halfW - fThick;
      const hingeY = directionSign * halfD;
      const leafLen = width - fThick * 2;
      const finalAngle = isLeft 
        ? directionSign * currentAngle 
        : Math.PI - directionSign * currentAngle;
      const endX = hingeX + leafLen * Math.cos(finalAngle);
      const endY = hingeY + leafLen * Math.sin(finalAngle);
      addLine(hingeX, hingeY, endX, endY, layerLeaf, '#ff4f4f');
      if (isOpen) {
        const startRad = isLeft ? 0 : Math.PI;
        addArc(hingeX, hingeY, leafLen, Math.min(startRad, finalAngle), Math.max(startRad, finalAngle), layerSwing, '#33f0ff');
      }
    } 
    else if (numPanels === 2) {
      const leafLen = (width - fThick * 2) / 2;
      // Left sash (hinge left)
      const leftHingeX = -halfW + fThick;
      const leftHingeY = directionSign * halfD;
      const leftFinalAngle = directionSign * currentAngle;
      const leftEndX = leftHingeX + leafLen * Math.cos(leftFinalAngle);
      const leftEndY = leftHingeY + leafLen * Math.sin(leftFinalAngle);
      addLine(leftHingeX, leftHingeY, leftEndX, leftEndY, layerLeaf, '#ff4f4f');
      // Right sash (hinge right)
      const rightHingeX = halfW - fThick;
      const rightHingeY = directionSign * halfD;
      const rightFinalAngle = Math.PI - directionSign * currentAngle;
      const rightEndX = rightHingeX + leafLen * Math.cos(rightFinalAngle);
      const rightEndY = rightHingeY + leafLen * Math.sin(rightFinalAngle);
      addLine(rightHingeX, rightHingeY, rightEndX, rightEndY, layerLeaf, '#ff4f4f');
      if (isOpen) {
        // Left Swing Path
        const leftStartRad = 0;
        addArc(leftHingeX, leftHingeY, leafLen, Math.min(leftStartRad, leftFinalAngle), Math.max(leftStartRad, leftFinalAngle), layerSwing, '#33f0ff');
        // Right Swing Path
        const rightStartRad = Math.PI;
        addArc(rightHingeX, rightHingeY, leafLen, Math.min(rightStartRad, rightFinalAngle), Math.max(rightStartRad, rightFinalAngle), layerSwing, '#33f0ff');
      }
    }
    else {
      // --- 3-Leaf Casement Window (L - R - R) ---
      const mullionW = fThick;
      const clearW = width - fThick * 2;
      const pWidth = (clearW - 2 * mullionW) / 3;
      const leftMullionCenter = -halfW + fThick + pWidth + mullionW / 2;
      const rightMullionCenter = halfW - fThick - pWidth - mullionW / 2;
      // Draw vertical mullions in plan view
      addRect(leftMullionCenter - mullionW / 2, -halfD, leftMullionCenter + mullionW / 2, halfD, layerFrame, frameColor);
      addRect(rightMullionCenter - mullionW / 2, -halfD, rightMullionCenter + mullionW / 2, halfD, layerFrame, frameColor);
      // Left Sash (hinge left)
      const leftHingeX = -halfW + fThick;
      const leftHingeY = directionSign * halfD;
      const leftFinalAngle = directionSign * currentAngle;
      const leftEndX = leftHingeX + pWidth * Math.cos(leftFinalAngle);
      const leftEndY = leftHingeY + pWidth * Math.sin(leftFinalAngle);
      addLine(leftHingeX, leftHingeY, leftEndX, leftEndY, layerLeaf, '#ff4f4f');
      // Middle Sash (hinge right, pivoting on right mullion center - mullionW/2)
      const middleHingeX = rightMullionCenter - mullionW / 2;
      const middleHingeY = directionSign * halfD;
      const middleFinalAngle = Math.PI - directionSign * currentAngle;
      const middleEndX = middleHingeX + pWidth * Math.cos(middleFinalAngle);
      const middleEndY = middleHingeY + pWidth * Math.sin(middleFinalAngle);
      addLine(middleHingeX, middleHingeY, middleEndX, middleEndY, layerLeaf, '#ff4f4f');
      // Right Sash (hinge right, pivoting on outer right frame)
      const rightHingeX = halfW - fThick;
      const rightHingeY = directionSign * halfD;
      const rightFinalAngle = Math.PI - directionSign * currentAngle;
      const rightEndX = rightHingeX + pWidth * Math.cos(rightFinalAngle);
      const rightEndY = rightHingeY + pWidth * Math.sin(rightFinalAngle);
      addLine(rightHingeX, rightHingeY, rightEndX, rightEndY, layerLeaf, '#ff4f4f');
      if (isOpen) {
        // Left Swing Path
        const leftStartRad = 0;
        addArc(leftHingeX, leftHingeY, pWidth, Math.min(leftStartRad, leftFinalAngle), Math.max(leftStartRad, leftFinalAngle), layerSwing, '#33f0ff');
        // Middle Swing Path
        const middleStartRad = Math.PI;
        addArc(middleHingeX, middleHingeY, pWidth, Math.min(middleStartRad, middleFinalAngle), Math.max(middleStartRad, middleFinalAngle), layerSwing, '#33f0ff');
        // Right Swing Path
        const rightStartRad = Math.PI;
        addArc(rightHingeX, rightHingeY, pWidth, Math.min(rightStartRad, rightFinalAngle), Math.max(rightStartRad, rightFinalAngle), layerSwing, '#33f0ff');
      }
    }
  } 
  else if (cat === 'awning_window') {
    // Awning Window: Opens outwards from top/bottom. In 2D plan, it is drawn with dashed projection lines.
    const numAwning = (isDouble || tracks === 2) ? 2 : 1;
    const isOut = openDirection === 'outward';
    const projectionY = isOut ? -halfD - 50 : halfD + 50;

    if (numAwning === 1) {
      // Draw dashed projection box on plan representing the opening pane
      addLine(-halfW + fThick, projectionY, halfW - fThick, projectionY, layerSwing, '#33f0ff');
      addLine(-halfW + fThick, -halfD, -halfW + fThick, projectionY, layerSwing, '#33f0ff');
      addLine(halfW - fThick, -halfD, halfW - fThick, projectionY, layerSwing, '#33f0ff');
    } 
    else {
      // --- 2-Sash Awning Window ---
      const mullionW = 69;
      // Draw center mullion
      addRect(-mullionW / 2, -halfD, mullionW / 2, halfD, layerFrame, frameColor);
      addLine(0, -halfD, 0, halfD, layerFrame, frameColor);

      // Left projection
      addLine(-halfW + fThick, projectionY, -mullionW / 2, projectionY, layerSwing, '#33f0ff');
      addLine(-halfW + fThick, -halfD, -halfW + fThick, projectionY, layerSwing, '#33f0ff');
      addLine(-mullionW / 2, -halfD, -mullionW / 2, projectionY, layerSwing, '#33f0ff');

      // Right projection
      addLine(mullionW / 2, projectionY, halfW - fThick, projectionY, layerSwing, '#33f0ff');
      addLine(mullionW / 2, -halfD, mullionW / 2, projectionY, layerSwing, '#33f0ff');
      addLine(halfW - fThick, -halfD, halfW - fThick, projectionY, layerSwing, '#33f0ff');
    }
  } 
  else if (cat === 'fixed_glass' || cat === 'curtain_wall') {
    // Fixed glass/curtain wall partitions in plan view
    const isCurtainWall = cat === 'curtain_wall' || profileSystem === 'FA52' || profileSystem === 'GD50';
    if (isCurtainWall) {
      const mullionW = (profileSystem === 'FA52' || profileSystem === 'GD50') ? 52 : 50;
      const numBays = tracks || 1;
      const step = width / numBays;

      // Draw intermediate mullions
      for (let i = 1; i < numBays; i++) {
        const mx = -width / 2 + i * step;
        addRect(mx - mullionW / 2, -halfD, mx + mullionW / 2, halfD, layerFrame, frameColor);
      }

      // Draw glass panes
      const isGD50 = profileSystem === 'GD50';
      for (let i = 0; i < numBays; i++) {
        const leftBound = isGD50
          ? (i === 0 ? -halfW + 22 : -width / 2 + i * step + 11)
          : (i === 0 ? -halfW + fThick : -width / 2 + i * step + mullionW / 2);
        const rightBound = isGD50
          ? (i === numBays - 1 ? halfW - 22 : -width / 2 + (i + 1) * step - 11)
          : (i === numBays - 1 ? halfW - fThick : -width / 2 + (i + 1) * step - mullionW / 2);
        if (leftBound < rightBound) {
          addLine(leftBound, 0, rightBound, 0, layerGlass, '#c0c0c0');
        }
      }
    } else {
      if (tracks === 2) {
        // Shared Frame (Chia đố liền khung)
        const mullionW = 50;
        // Central Mullion
        addRect(-mullionW / 2, -halfD, mullionW / 2, halfD, layerFrame, frameColor);
        
        // Glass Panes
        addLine(-halfW + fThick, 0, -mullionW / 2, 0, layerGlass, '#c0c0c0');
        addLine(mullionW / 2, 0, halfW - fThick, 0, layerGlass, '#c0c0c0');
      } else if (tracks === 3) {
        // Separated Frames (Chia đố tách khung)
        const jointW = 33;
        const subFrameW = 42;
        
        // Central joint
        addRect(-jointW / 2, -halfD, jointW / 2, halfD, layerFrame, frameColor);
        
        // Left Sub-Frame right profile member
        addRect(-jointW / 2 - subFrameW, -halfD, -jointW / 2, halfD, layerFrame, frameColor);
        // Left Sub-Frame left profile member (overlaps outer frame)
        addRect(-halfW + fThick, -halfD, -halfW + fThick + subFrameW, halfD, layerFrame, frameColor);
        
        // Right Sub-Frame left profile member
        addRect(jointW / 2, -halfD, jointW / 2 + subFrameW, halfD, layerFrame, frameColor);
        // Right Sub-Frame right profile member (overlaps outer frame)
        addRect(halfW - fThick - subFrameW, -halfD, halfW - fThick, halfD, layerFrame, frameColor);
        
        // Glass Panes
        addLine(-halfW + fThick + subFrameW, 0, -jointW / 2 - subFrameW, 0, layerGlass, '#c0c0c0');
        addLine(jointW / 2 + subFrameW, 0, halfW - fThick - subFrameW, 0, layerGlass, '#c0c0c0');
      } else {
        // Default single pane (tracks === 1)
        addLine(-halfW + fThick, 0, halfW - fThick, 0, layerGlass, '#c0c0c0');
        // Add center line marking
        addLine(-20, -10, 20, 10, layerSwing, '#33f0ff');
      }
    }
  }
  else {
    // Other: Generic representation
    addLine(-halfW, 0, halfW, 0, layerLeaf, '#ff4f4f');
  }

  // 3. Add Annotation Text (Dimensions e.g., W x H)
  addText(0, halfD + 80, `${width} x ${height} mm`, 100, layerText, '#ffffff');

  // Add system tag
  addText(0, -halfD - 85, item.metadata?.profileSystem || 'Eurowindow', 80, layerText, '#ffe033');

  return entities;
}

/**
 * Converts a set of CAD entities into a clean, scalable SVG string.
 * This is used for rendering the AutoCAD drawing on the left side of the Preview panel.
 */
export function renderEntitiesToSvg(entities: CadEntity[], width: number, height: number): string {
  // Calculate dynamic bounding box of entities to ensure everything is visible
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  entities.forEach((ent) => {
    if (ent.type === 'LINE') {
      minX = Math.min(minX, ent.x1 ?? 0, ent.x2 ?? 0);
      maxX = Math.max(maxX, ent.x1 ?? 0, ent.x2 ?? 0);
      minY = Math.min(minY, ent.y1 ?? 0, ent.y2 ?? 0);
      maxY = Math.max(maxY, ent.y1 ?? 0, ent.y2 ?? 0);
    } else if (ent.type === 'ARC' || ent.type === 'CIRCLE') {
      const cx = ent.cx ?? 0;
      const cy = ent.cy ?? 0;
      const r = ent.r ?? 0;
      minX = Math.min(minX, cx - r);
      maxX = Math.max(maxX, cx + r);
      minY = Math.min(minY, cy - r);
      maxY = Math.max(maxY, cy + r);
    } else if (ent.type === 'TEXT') {
      minX = Math.min(minX, (ent.x ?? 0) - 100);
      maxX = Math.max(maxX, (ent.x ?? 0) + 100);
      minY = Math.min(minY, (ent.y ?? 0) - 50);
      maxY = Math.max(maxY, (ent.y ?? 0) + 50);
    } else if (ent.type === 'LWPOLYLINE') {
      if (ent.vertices && ent.vertices.length > 0) {
        ent.vertices.forEach((v) => {
          minX = Math.min(minX, v.x);
          maxX = Math.max(maxX, v.x);
          minY = Math.min(minY, v.y);
          maxY = Math.max(maxY, v.y);
        });
      }
    }
  });

  // Fallback if no entities or invalid bounding box
  if (minX === Infinity || maxX === -Infinity || minY === Infinity || maxY === -Infinity) {
    const margin = 150;
    const viewW = width + margin * 2;
    const viewH = height + margin * 2;
    minX = -viewW / 2;
    minY = -viewH / 2;
    maxX = viewW / 2;
    maxY = viewH / 2;
  }

  const margin = 120; // clean padding around drawing
  const viewX = minX - margin;
  const viewY = minY - margin;
  const viewW = (maxX - minX) + margin * 2;
  const viewH = (maxY - minY) + margin * 2;

  let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewX} ${viewY} ${viewW} ${viewH}" width="100%" height="100%" style="background-color: #0f172a;">`;
  
  // Render grid lines (AutoCAD grid lines) within the computed bounding box
  const gridSpacing = 100;
  svgContent += `<g stroke="#1e293b" stroke-width="0.5">`;
  const startGridX = Math.floor(viewX / gridSpacing) * gridSpacing;
  const endGridX = Math.ceil((viewX + viewW) / gridSpacing) * gridSpacing;
  const startGridY = Math.floor(viewY / gridSpacing) * gridSpacing;
  const endGridY = Math.ceil((viewY + viewH) / gridSpacing) * gridSpacing;

  for (let x = startGridX; x <= endGridX; x += gridSpacing) {
    svgContent += `<line x1="${x}" y1="${viewY}" x2="${x}" y2="${viewY + viewH}" />`;
  }
  for (let y = startGridY; y <= endGridY; y += gridSpacing) {
    svgContent += `<line x1="${viewX}" y1="${y}" x2="${viewX + viewW}" y2="${y}" />`;
  }
  svgContent += `</g>`;

  // Draw entities
  entities.forEach((ent) => {
    const stroke = ent.color || '#ffffff';
    const isDash = ent.layer?.includes('DASH') || ent.layer?.includes('SWING') || ent.layer?.includes('PROJECTION');
    const dashAttr = isDash ? 'stroke-dasharray="4 4"' : '';
    
    // Scale stroke weight by layer importance
    let strokeWidth = 1.5;
    if (ent.layer?.includes('FRAME') || ent.layer?.includes('PROFILE-METAL') || ent.layer?.includes('BOLD')) {
      strokeWidth = 2.5;
    } else if (ent.layer?.includes('CHAMBER') || ent.layer?.includes('HATCH') || ent.layer?.includes('AXIS')) {
      strokeWidth = 0.8;
    }

    if (ent.type === 'LINE') {
      svgContent += `<line x1="${ent.x1}" y1="${ent.y1}" x2="${ent.x2}" y2="${ent.y2}" stroke="${stroke}" stroke-width="${strokeWidth}" ${dashAttr} />`;
    } 
    else if (ent.type === 'ARC') {
      const cx = ent.cx ?? 0;
      const cy = ent.cy ?? 0;
      const r = ent.r ?? 0;
      const startAngle = ent.startAngle ?? 0;
      const endAngle = ent.endAngle ?? 0;

      // Draw SVG arc path using basic trigonometry
      const x1 = cx + r * Math.cos(startAngle);
      const y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle);
      const y2 = cy + r * Math.sin(endAngle);

      const largeArcFlag = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0;
      // In SVG, Y axis points down, so we handle sweep flag
      const sweepFlag = endAngle > startAngle ? 1 : 0;

      svgContent += `<path d="M ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} ${sweepFlag} ${x2} ${y2}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" ${dashAttr} />`;
    } 
    else if (ent.type === 'CIRCLE') {
      svgContent += `<circle cx="${ent.cx ?? 0}" cy="${ent.cy ?? 0}" r="${ent.r ?? 0}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" ${dashAttr} />`;
    }
    else if (ent.type === 'LWPOLYLINE') {
      if (ent.vertices && ent.vertices.length > 0) {
        const pointsStr = ent.vertices.map(v => `${v.x},${v.y}`).join(' ');
        if (ent.closed) {
          svgContent += `<polygon points="${pointsStr}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" ${dashAttr} />`;
        } else {
          svgContent += `<polyline points="${pointsStr}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" ${dashAttr} />`;
        }
      }
    }
    else if (ent.type === 'TEXT') {
      const transformAttr = ent.rotation ? ` transform="rotate(${ent.rotation}, ${ent.x ?? 0}, ${ent.y ?? 0})"` : '';
      svgContent += `<text x="${ent.x}" y="${ent.y}" fill="${stroke}" font-size="${ent.fontSize ?? 12}" font-family="monospace" text-anchor="middle" dominant-baseline="middle"${transformAttr}>${ent.text}</text>`;
    }
  });

  svgContent += `</svg>`;
  return svgContent;
}
