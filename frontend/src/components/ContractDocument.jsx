import React, { forwardRef } from 'react';

const formatDate = (dateStr) => {
  if (!dateStr) return '___/___/_____';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
};

const formatMoney = (val) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
};

const ContractDocument = forwardRef(({ lease }, ref) => {
  if (!lease) return null;

  const { tenant, property } = lease;

  const pageStyle = {
    width: '210mm',
    minHeight: '297mm',
    padding: '20mm',
    margin: '0 auto',
    backgroundColor: 'white',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    fontSize: '11pt', 
    fontFamily: '"Times New Roman", Times, serif',
    lineHeight: '1.3', 
    color: '#000',
    outline: 'none' 
  };

  {/* Dados com Fallback para Edição Manual */}
  const locador = {
    nome: lease.landlordName || '[NOME DO LOCADOR]',
    nacionalidade: '[NACIONALIDADE]',
    estadoCivil: '[ESTADO CIVIL]',
    profissao: '[PROFISSÃO]',
    rg: '[RG DO LOCADOR]',
    cpf: '[CPF DO LOCADOR]',
    endereco: '[ENDEREÇO COMPLETO DO LOCADOR]'
  };

  const locatario = {
    nome: tenant?.fullName?.toUpperCase() || '[NOME DO LOCATÁRIO]',
    nacionalidade: tenant?.nationality || '[NACIONALIDADE]',
    estadoCivil: tenant?.maritalStatus ? tenant.maritalStatus.toLowerCase() : '[ESTADO CIVIL]',
    profissao: tenant?.profession || '[PROFISSÃO]',
    rg: tenant?.rg || '[RG]',
    cpf: tenant?.cpf || '[CPF]',
    endereco: tenant ? `${tenant.cityName || ''}-${tenant.stateCode || ''}` : '[ENDEREÇO ANTERIOR]'
  };

  const fiador = {
    nome: '[NOME DO FIADOR - OPCIONAL]',
    nacionalidade: '[NACIONALIDADE]',
    estadoCivil: '[ESTADO CIVIL]',
    profissao: '[PROFISSÃO]',
    rg: '[RG]',
    cpf: '[CPF]',
    endereco: '[ENDEREÇO COMPLETO]'
  };

  return (
    <div className="print-container bg-gray-200 p-8 overflow-auto h-full flex justify-center">
      
      {/* Área Editável - Papel A4 */}
      <div 
        ref={ref} 
        style={pageStyle} 
        className="print-content focus:ring-2 focus:ring-blue-300 transition-shadow"
        contentEditable={true}
        suppressContentEditableWarning={true}
      >
        
        {/* TÍTULO */}
        <h1 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase', fontSize: '14pt' }}>
          CONTRATO DE LOCAÇÃO RESIDENCIAL
        </h1>

        {/* RESUMO */}
        <div style={{ border: '1px solid #000', padding: '5px 10px', marginBottom: '15px', fontSize: '10pt' }}>
          <p><strong>DADOS GERAIS:</strong></p>
          <p><strong>Prazo de locação:</strong> 30 (trinta) meses</p>
          <p><strong>Início:</strong> {formatDate(lease.startDate)} &nbsp;&nbsp; <strong>Término:</strong> {formatDate(lease.endDate)}</p>
          <p><strong>Objeto:</strong> IMÓVEL RESIDENCIAL</p>
        </div>

        {/* QUALIFICAÇÃO */}
        <div style={{ marginBottom: '15px', textAlign: 'justify' }}>
          <p style={{ marginBottom: '10px' }}>
            <strong>LOCADOR(A):</strong> {locador.nome}, {locador.nacionalidade}, {locador.estadoCivil}, {locador.profissao}, 
            portador do RG nº {locador.rg} e CPF nº {locador.cpf}, residente e domiciliado em {locador.endereco}.
          </p>
          <p style={{ marginBottom: '10px' }}>
            <strong>LOCATÁRIO(A):</strong> {locatario.nome}, {locatario.nacionalidade}, {locatario.estadoCivil}, {locatario.profissao}, 
            portador do RG nº {locatario.rg} e CPF nº {locatario.cpf}.
          </p>
          <p style={{ marginBottom: '10px' }}>
            <strong>FIADOR(A):</strong> {fiador.nome}, {fiador.nacionalidade}, {fiador.estadoCivil}, {fiador.profissao}, 
            portador do RG nº {fiador.rg} e CPF nº {fiador.cpf}, residente em {fiador.endereco}.
          </p>
        </div>

        {/* CLÁUSULAS */}
        <h3 style={{ fontWeight: 'bold', marginTop: '10px', textTransform: 'uppercase' }}>Cláusula 1ª. DO OBJETO</h3>
        <p style={{ textAlign: 'justify', marginBottom: '10px' }}>
          O objeto deste contrato de locação é o imóvel residencial situado no endereço: <strong>{property?.address}, {property?.addressComplement}, {property?.neighborhood}, {property?.cityName}-{property?.stateCode}</strong>.
        </p>

        <h3 style={{ fontWeight: 'bold', marginTop: '10px', textTransform: 'uppercase' }}>Cláusula 2ª. DO VALOR E FORMA DE PAGAMENTO</h3>
        <p style={{ textAlign: 'justify', marginBottom: '10px' }}>
          O valor do aluguel será de <strong>{formatMoney(lease.baseRentValue)}</strong>, a ser pago mensalmente, com vencimento no dia <strong>{lease.paymentDueDay}</strong> de cada mês.
          <br/>
          O pagamento deverá ser efetuado através de PIX para a chave <strong>[INSERIR CHAVE PIX]</strong>, ou mediante depósito na conta bancária de titularidade do LOCADOR.
        </p>

        <h3 style={{ fontWeight: 'bold', marginTop: '10px', textTransform: 'uppercase' }}>Cláusula 3ª. DO REAJUSTE</h3>
        <p style={{ textAlign: 'justify', marginBottom: '10px' }}>
          3ª (a). O valor locativo será reajustado anualmente, mediante aplicação do maior índice dentre IPCA, IGP-M ou INCC; na ausência destes, será adotado o índice oficial de inflação definido pelo Governo Federal (Art. 18, Lei nº 8.245/91).
        </p>

        <h3 style={{ fontWeight: 'bold', marginTop: '10px', textTransform: 'uppercase' }}>Cláusula 4ª. DO INADIMPLEMENTO E COBRANÇA</h3>
        <p style={{ textAlign: 'justify', marginBottom: '10px' }}>
          4.(a). Em caso de atraso no pagamento, incidirá multa de 10% (dez por cento) sobre o valor devido, além de juros de mora de 1% (um por cento) ao mês e correção monetária até o efetivo pagamento.
        </p>

        <h3 style={{ fontWeight: 'bold', marginTop: '10px', textTransform: 'uppercase' }}>Cláusula 5ª – DA DURAÇÃO E RESCISÃO</h3>
        <p style={{ textAlign: 'justify', marginBottom: '10px' }}>
          5.(a). A presente locação é ajustada pelo prazo de 30 (trinta) meses, contados a partir da data de início.
          <br/>
          5.(c). Após o decurso mínimo de 12 (doze) meses de vigência contratual, o LOCADOR poderá solicitar a desocupação mediante notificação com 30 dias de antecedência.
          <br/>
          5.(e). Em caso de rescisão pelo LOCATÁRIO antes do prazo final, este pagará multa compensatória proporcional de 3 (três) aluguéis vigentes.
        </p>

        <h3 style={{ fontWeight: 'bold', marginTop: '10px', textTransform: 'uppercase' }}>Cláusula 9ª - DO DEPÓSITO DE MANUTENÇÃO (PINTURA)</h3>
        {lease.paintingFeeValue > 0 ? (
            <p style={{ textAlign: 'justify', marginBottom: '10px' }}>
                O(a) LOCATÁRIO(a) pagará ao LOCADOR o valor de <strong>{formatMoney(lease.paintingFeeValue)}</strong> a título de taxa de pintura/manutenção.
            </p>
        ) : (
            <p style={{ textAlign: 'justify', marginBottom: '10px' }}>[NÃO APLICÁVEL - APAGAR SE NECESSÁRIO]</p>
        )}

        <h3 style={{ fontWeight: 'bold', marginTop: '10px', textTransform: 'uppercase' }}>Cláusula 10ª – DAS OBRIGAÇÕES DE CONSERVAÇÃO</h3>
        <p style={{ textAlign: 'justify', marginBottom: '10px' }}>
          O(a) LOCATÁRIO(a) declara ter recebido o imóvel em perfeito estado de conservação, uso e funcionamento, comprometendo-se a mantê-lo nas mesmas condições.
        </p>

        <h3 style={{ fontWeight: 'bold', marginTop: '10px', textTransform: 'uppercase' }}>Cláusula 14ª – DA DESTINAÇÃO DO IMÓVEL</h3>
        <p style={{ textAlign: 'justify', marginBottom: '10px' }}>
          A locação destina-se exclusivamente à finalidade residencial, sendo vedado o uso comercial ou sublocação.
        </p>

        <h3 style={{ fontWeight: 'bold', marginTop: '10px', textTransform: 'uppercase' }}>Cláusula 21ª – DO FORO DE ELEIÇÃO</h3>
        <p style={{ textAlign: 'justify', marginBottom: '10px' }}>
          Fica eleito o foro da comarca de <strong>{property?.cityName || '[CIDADE]'}</strong> para dirimir quaisquer controvérsias decorrentes deste contrato.
        </p>

        <h3 style={{ fontWeight: 'bold', marginTop: '10px', textTransform: 'uppercase' }}>Cláusula 22ª – DA ACEITAÇÃO E ASSINATURA</h3>
        <p style={{ textAlign: 'justify', marginBottom: '20px' }}>
          E, por estarem assim justos e acordados, assinam o presente instrumento em 3 (três) vias de igual teor e forma, juntamente com 2 (duas) testemunhas.
        </p>

        <p style={{ textAlign: 'center', marginBottom: '40px' }}>
          {property?.cityName || '[CIDADE]'}, ____ de _______________ de 20____.
        </p>

        {/* ASSINATURAS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', marginTop: '20px' }}>
          
          {/* Locador */}
          <div>
            <div style={{ borderTop: '1px solid #000', width: '70%', margin: '0 auto 5px auto' }}></div>
            <div style={{ textAlign: 'center', fontWeight: 'bold' }}>{locador.nome.toUpperCase()}</div>
            <div style={{ textAlign: 'center', fontSize: '9pt' }}>Locador(a) | CPF: {locador.cpf}</div>
          </div>

          {/* Locatário */}
          <div>
            <div style={{ borderTop: '1px solid #000', width: '70%', margin: '0 auto 5px auto' }}></div>
            <div style={{ textAlign: 'center', fontWeight: 'bold' }}>{locatario.nome}</div>
            <div style={{ textAlign: 'center', fontSize: '9pt' }}>Locatário(a) | CPF: {locatario.cpf}</div>
          </div>

          {/* Fiador */}
          <div>
            <div style={{ borderTop: '1px solid #000', width: '70%', margin: '0 auto 5px auto' }}></div>
            <div style={{ textAlign: 'center', fontWeight: 'bold' }}>{fiador.nome}</div>
            <div style={{ textAlign: 'center', fontSize: '9pt' }}>Fiador(a) | CPF: {fiador.cpf}</div>
          </div>

          {/* Testemunhas */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
             <div style={{ width: '45%' }}>
                <div style={{ borderTop: '1px solid #000', width: '100%', marginBottom: '5px' }}></div>
                <div style={{ fontSize: '9pt' }}>Testemunha 1:</div>
                <div style={{ fontSize: '9pt' }}>CPF:</div>
             </div>
             <div style={{ width: '45%' }}>
                <div style={{ borderTop: '1px solid #000', width: '100%', marginBottom: '5px' }}></div>
                <div style={{ fontSize: '9pt' }}>Testemunha 2:</div>
                <div style={{ fontSize: '9pt' }}>CPF:</div>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
});

ContractDocument.displayName = 'ContractDocument';
export default ContractDocument;