import React from 'react';
import RentReceipt from './RentReceipt';

const RentReceiptBatch = React.forwardRef(({ dataList }, ref) => {
  if (!dataList || dataList.length === 0) return null;

  return (
    <div ref={ref} className="print-source bg-white">
      {dataList.map((item, index) => (
        <div key={item.payment.id || index}>
          
          <RentReceipt data={item} />
          
          {index < dataList.length - 1 && (
            <div className="py-2 flex items-center justify-center">
               <div className="w-full border-b border-dashed border-gray-300 relative">
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-[10px] text-gray-400">
                    CORTE AQUI
                  </span>
               </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
});

RentReceiptBatch.displayName = 'RentReceiptBatch';
export default RentReceiptBatch;