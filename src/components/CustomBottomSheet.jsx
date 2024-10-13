import React, { forwardRef, useImperativeHandle } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useRef } from 'react';

const CustomBottomSheet = forwardRef(({ snapPoints, children }, ref) => {
  const bottomSheetRef = useRef(null);

  useImperativeHandle(ref, () => ({
    open: () => bottomSheetRef.current?.snapToIndex(0),
    close: () => bottomSheetRef.current?.close(),
  }));

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      index={-1}
    >
      <BottomSheetView>
        {children}
      </BottomSheetView>
    </BottomSheet>
  );
});

export default CustomBottomSheet;
