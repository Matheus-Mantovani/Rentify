import React, { useEffect } from 'react';

const RentReceipt = React.forwardRef(({ data, onReadyToPrint }, ref) => {
  // --- Helpers ---
  const formatMoney = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'decimal', minimumFractionDigits: 2 }).format(val || 0);
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  // Helper to calculate "Installment X / Total"
  const getInstallmentText = (lease, payment) => {
    if (!lease || !payment) return '-';
    
    const start = new Date(lease.startDate);
    const end = new Date(lease.endDate);
    const totalMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    
    const currentInstallment = (payment.referenceYear - start.getFullYear()) * 12 + (payment.referenceMonth - (start.getMonth() + 1)) + 1;

    if (currentInstallment <= 0) return `${payment.referenceMonth}/${String(payment.referenceYear).slice(-2)}`;

    return `${currentInstallment} / ${Math.max(totalMonths, currentInstallment)}`; 
  };

  // --- Data Preparation ---
  const payment = data?.payment;
  const lease = data?.lease;
  const property = lease?.property;
  const tenant = lease?.tenant;

  const refText = getInstallmentText(lease, payment);
  
  const dueDay = lease?.paymentDueDay || 10;
  const currentMonthDate = new Date(payment?.referenceYear, payment?.referenceMonth - 1, dueDay);
  const prevMonthDate = new Date(payment?.referenceYear, payment?.referenceMonth - 2, dueDay);
  const periodStart = formatDate(prevMonthDate);
  const periodEnd = formatDate(currentMonthDate);

  const valRent = lease?.baseRentValue || 0;
  const valCondo = property?.condoFee || 0; 
  const valTax = property?.propertyTaxValue ? (property.propertyTaxValue / 12) : 0; 
  const valTotal = payment?.amountPaid || 0;
  
  const amountInWords = (lease?.baseRentValue === payment?.amountPaid && lease?.rentValueInWords) 
    ? lease.rentValueInWords 
    : `(Valor numérico: ${formatMoney(valTotal)} reais)`;

  useEffect(() => {
    if (data && onReadyToPrint) onReadyToPrint();
  }, [data, onReadyToPrint]);

  return (
    <div ref={ref} className="p-6 font-sans text-black bg-white print-source w-full max-w-[1000px] mx-auto text-lg">
      
      {!data ? (
        <div className="text-center p-10">Carregando...</div>
      ) : (
        <div className="border-2 border-black flex h-[255px]"> 
          
          {/* --- LEFT COLUMN (65%) --- */}
          <div className="w-[65%] flex flex-col border-r border-black">
            
            {/* Header Box */}
            <div className="border-b border-black p-1 bg-gray-100 text-center h-[50px] flex flex-col justify-center">
              <h1 className="font-bold text-lg uppercase">Recibo de Aluguel e Rateio de Despesas</h1>
              <div className="font-bold text-lg">{refText}</div>
            </div>

            {/* Due Date & Period Row */}
            <div className="border-b border-black flex h-[40px]">
                <div className="w-1/2 border-r border-black p-1 flex items-center justify-center text-lg">
                    <span className="font-bold mr-1">Vencimento:</span> dia {dueDay}
                </div>
                <div className="w-1/2 p-1 flex flex-col items-center justify-center leading-tight">
                    <span className="text-[14px]">correspondente ao periodo:</span>
                    <span className="font-bold text-lg">{periodStart} à {periodEnd}</span>
                </div>
            </div>

            {/* "Received From" Field */}
            <div className="border-b border-black p-2 flex flex-col justify-end h-[55px]">
              <div className="flex items-end gap-2 w-full">
                <span className="font-bold whitespace-nowrap">Recebi de:</span>
                <span className="font-bold uppercase border-b border-dotted border-gray-400 flex-grow text-center pb-0.5 truncate text-base">
                  {tenant?.fullName}
                </span>
              </div>
            </div>

            {/* "Amount In Words" Field */}
            <div className="border-b border-black p-2 flex flex-col justify-end h-[55px]">
              <div className="flex items-end gap-2 w-full">
                <span className="font-bold whitespace-nowrap">A importância de:</span>
                <span className="italic border-b border-dotted border-gray-400 flex-grow text-center pb-0.5 text-lg leading-tight truncate">
                  {amountInWords}
                </span>
              </div>
            </div>

            {/* Property Info */}
            <div className="p-2 flex flex-col justify-center h-[55px]">
              <div className="flex items-end gap-2 w-full">
                <span className="font-bold text-lg whitespace-nowrap mb-0.5">Referente ao Aluguel e despesas:</span>
                <div className="flex-grow border-b border-dotted border-gray-400 pb-0.5 text-center text-lg flex justify-between px-1">
                   <span className="truncate max-w-[220px]">{property?.address?.split(',')[0]}</span> 
                   <span>{property?.addressComplement || `Nº ${property?.address?.split(',')[1] || ''}`}</span>
                </div>
              </div>
            </div>

          </div>

          {/* --- RIGHT COLUMN (35%) --- */}
          <div className="w-[35%] flex flex-col justify-between">
            
            <div className="flex-grow pt-2">
                <div className="text-lg">
                    <div className="flex justify-between items-center px-3 h-[28px] border-b border-gray-200">
                        <span>Aluguel</span>
                        <div className="font-bold">R$ {formatMoney(valRent)}</div>
                    </div>
                    <div className="flex justify-between items-center px-3 h-[28px] border-b border-gray-200">
                        <span>Rateio despesas</span>
                        <div className="font-bold">R$ {formatMoney(valCondo)}</div>
                    </div>
                    <div className="flex justify-between items-center px-3 h-[28px] border-b border-gray-200">
                        <span>Imposto/Taxas</span>
                        <div className="font-bold">R$ {formatMoney(valTax)}</div>
                    </div>
                    
                    <div className="flex justify-between items-center px-3 h-[28px] border-b border-black">
                        <span>Multa/Juros</span>
                        <div className="font-bold">
                            {payment?.lateFees > 0 ? `R$ ${formatMoney(payment.lateFees)}` : '-'}
                        </div>
                    </div>
                </div>

                {/* Total Box */}
                <div className="bg-gray-100 flex justify-between items-center font-bold px-3 h-[40px] border-b border-black mt-2">
                    <span className="text-lg uppercase">Total Pago</span>
                    <div className="text-base">R$ {formatMoney(valTotal)}</div>
                </div>
            </div>

            {/* Landlord Signature Area */}
            <div className="p-2 flex items-end justify-center h-[60px]">
                <div className="text-center w-full">
                    <div className="border-b border-black mb-1 mx-4"></div>
                    <span className="font-bold text-[10px] uppercase block truncate px-2">
                        {lease?.landlordName || 'LOCADOR'}
                    </span>
                </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <div className="mt-1 text-right text-[9px] text-gray-300 font-sans leading-none pr-1">
        Rentify System
      </div>
    </div>
  );
});

RentReceipt.displayName = 'RentReceipt';
export default RentReceipt;