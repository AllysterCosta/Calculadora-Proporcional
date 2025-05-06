// Atualizar o ano no rodapé
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('anoAtual').textContent = new Date().getFullYear();


  // Ajustando a data 
  var diaHojeInput = document.getElementById('dataCancelamentoHoje');
  var diaHojeBloqueio = document.getElementById('dataBloqueio');
  var diaTrocaPlano = document.getElementById('dataTrocaPlanoHoje');
  var diaTrocaVencimento = document.getElementById('dataTrocaVencimentoHoje');
  var dataMultaCancelamento = document.getElementById('dataMultaCancelamento');
  //posinputs
  var Hoje = new Date();
  var anoHoje = Hoje.getFullYear();
  var mesHoje = String(Hoje.getMonth() + 1).padStart(2, '0');
  var HojeDia = String(Hoje.getDate()).padStart(2, '0');
  var dataAtual = `${anoHoje}-${mesHoje}-${HojeDia}`;

  diaHojeInput.value = dataAtual;
  diaHojeBloqueio.value = dataAtual;
  diaTrocaPlano.value = dataAtual;
  diaTrocaVencimento.value = dataAtual;
  dataMultaCancelamento.value = dataAtual;
});

// Função para calcular quantos dias tem no mês
function diasNoMes(data) {
  const ano = data.getFullYear();
  const mes = data.getMonth() + 1;
  return new Date(ano, mes, 0).getDate();
}

// Cálculo do formulário 1 (Cancelamento)
document.getElementById('CancelamentoForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const valorPlano = parseFloat(document.getElementById('valorPlano1').value);
  const mesReferencia = new Date(document.getElementById('mesReferencia1').valueAsDate);
  const dataFaturamento = new Date(document.getElementById('dataCancelamentoHoje').value);
  const diasSemInternet = parseInt(document.getElementById('diasSemInternet1').value);
  // ajustando a data para o dia correto.
  dataFaturamento.setDate(dataFaturamento.getDate() + 1);
  mesReferencia.setDate(mesReferencia.getDate() + 1);
  // verificar se os valores são numeros
  if (isNaN(valorPlano) || isNaN(diasSemInternet) || isNaN(mesReferencia.getTime()) || isNaN(dataFaturamento.getTime())) {
    alert('Preencha todos os campos corretamente.');
    return;
  }
  // calcular quantos dias tem naquele mês.
  const totalDiasMes = diasNoMes(mesReferencia);
  // Calcular dias usados considerando o intervalo de datas
  let diasUsados = Math.abs(dataFaturamento.getTime() - mesReferencia.getTime()) + 1;
  let diasUsadosDiff = Math.ceil(diasUsados / (1000 * 3600 * 24));
  diasUsados = diasUsadosDiff;
  if (diasUsados < 0) diasUsados = 0;

  // Descontar dias sem internet
  let diasValidos = diasUsados - diasSemInternet;
  if (diasValidos < 0) diasValidos = 0;

  // Calcular valor proporcional
  const valorDia = valorPlano / totalDiasMes;
  const valorProporcional = (valorDia * diasValidos).toFixed(2);

  // Mostrar o resultado
  document.getElementById('resultado1').innerHTML = `
      <div class="alert alert-success" role="alert">
        <p><strong>A quantidade de dias utilizado foi: ${diasValidos}</strong></p>
        <strong>Valor proporcional do cancelamento:</strong> R$ ${valorProporcional}
      </div>
    `;
});

//====================================================================================================================
// Cálculo do formulário 2 (Bloqueio Temporário)
document.getElementById('bloqueioTemporario').addEventListener('submit', function (event) {
  event.preventDefault();

  const valorPlano = parseFloat(document.getElementById('valorPlano2').value);
  const mesReferencia = new Date(document.getElementById('mesReferencia2').value);
  const dataFaturamento = new Date(document.getElementById('dataBloqueio').value);
  const diasSemInternet = parseInt(document.getElementById('diasSemInternet2').value);
  // ajustando a data para o dia correto.
  dataFaturamento.setDate(dataFaturamento.getDate() + 1);
  mesReferencia.setDate(mesReferencia.getDate() + 1);
  // verificar se os valores são numeros
  if (isNaN(valorPlano) || isNaN(diasSemInternet) || isNaN(mesReferencia.getTime()) || isNaN(dataFaturamento.getTime())) {
    alert('Preencha todos os campos corretamente.');
    return;
  }
  // calcular quantos dias tem naquele mês.
  const totalDiasMes = diasNoMes(mesReferencia);
  // Calcular dias usados considerando o intervalo de datas
  let diasUsados = Math.abs(dataFaturamento.getTime() - mesReferencia.getTime()) + 1;
  let diasUsadosDiff = Math.ceil(diasUsados / (1000 * 3600 * 24));
  diasUsados = diasUsadosDiff;
  if (diasUsados < 0) diasUsados = 0;

  // Descontar dias sem internet
  let diasValidos = diasUsados - diasSemInternet;
  if (diasValidos < 0) diasValidos = 0;

  // Calcular valor proporcional
  const valorDia = valorPlano / totalDiasMes;
  const valorProporcional = (valorDia * diasValidos).toFixed(2);

  // Mostrar o resultado
  document.getElementById('resultado2').innerHTML = `
      <div class="alert alert-info" role="alert">
        <p><strong>A quantidade de dias usados foi: ${diasValidos}</strong></p>
        <strong>Valor proporcional do bloqueio temporário:</strong> R$ ${valorProporcional}
      </div>
    `;
});

//==========================================================================================
/* Calcular troca de plano */
async function adicionar2DiasUteis(dataInicial) {
  const feriados = await fetch('datas/feriados.json')
    .then(response => response.json())
    .catch(() => {
      console.warn('Não foi possível carregar os feriados. Prosseguindo sem eles.');
      return [];
    });

  let data = new Date(dataInicial);
  let diasUteisAdicionados = 0;

  while (diasUteisAdicionados < 3) {
    data.setDate(data.getDate() + 1);
    const diaSemana = data.getDay();
    const dataFormatada = data.toISOString().split('T')[0];

    if (diaSemana !== 0 && diaSemana !== 6 && !feriados.includes(dataFormatada)) {
      diasUteisAdicionados++;
    }
  }

  return data;
}
//===================================================================================================
async function calcularTrocaPlano(event) {
  event?.preventDefault();

  const valorPlano1 = parseFloat(document.getElementById('valorPlano1tab3').value.replace(',', '.'));
  const valorPlano2 = parseFloat(document.getElementById('valorPlano2tab3').value.replace(',', '.'));
  const dataVencimento = new Date(document.getElementById('dataVencimento').value);
  const dataUltimoFaturamento = new Date(document.getElementById('dataTrocaPlanoHoje').value);
  const dataSolicitacao = new Date(document.getElementById('dataTrocaPlanoHoje').value); // Novo campo obrigatório

  if (
    isNaN(valorPlano1) || isNaN(valorPlano2) ||
    isNaN(dataVencimento.getTime()) || isNaN(dataUltimoFaturamento.getTime()) ||
    isNaN(dataSolicitacao.getTime())
  ) {
    alert('Preencha todos os campos corretamente.');
    return;
  }

  // Nova data efetiva da troca: 2 dias úteis após a solicitação
  const dataEfetivaTroca = await adicionar2DiasUteis(dataSolicitacao);
  //console.log('[DEBUG] Data efetiva da troca:', dataEfetivaTroca.toLocaleDateString('pt-BR'));

  const vencimentoDia = dataVencimento.getDate();
  const ano = dataVencimento.getFullYear();
  const mes = dataVencimento.getMonth();

  var diasMesVencimento = new Date(ano, mes + 1, 0).getDate();

  // Período do plano atual: de data de vencimento até o dia anterior à troca
  const dataFimPlano1 = new Date(dataEfetivaTroca);
  dataFimPlano1.setDate(dataFimPlano1.getDate() - 1);

  let diasPlano1 = Math.ceil((dataFimPlano1 - dataVencimento) / (1000 * 60 * 60 * 24));
  diasPlano1 = diasPlano1 > 0 ? diasPlano1 : 0;

  // Período do novo plano: de data da troca até próximo vencimento
  var proximoVencimento = new Date(ano, mes + 1, vencimentoDia + 1);
  var diasPlano2 = Math.floor((proximoVencimento - dataEfetivaTroca) / (1000 * 60 * 60 * 24)) + 1;
  //console.log('Proximo vencimento', proximoVencimento.toLocaleDateString('pt-BR'))

  if (diasPlano1 <= 0 || diasPlano2 <= 0) {
    console.log('Dias 1', diasPlano1, 'Dias 2', diasPlano2)
    proximoVencimento = new Date(ano, mes + 1, vencimentoDia + 1);
    diasMesVencimento = new Date(proximoVencimento.getFullYear(), proximoVencimento.getMonth() + 1, 0).getDate();
    diasPlano2 = Math.floor((proximoVencimento - dataEfetivaTroca) / (1000 * 60 * 60 * 24)) + 1;
  }

  const valorProporcionalPlano1 = (valorPlano1 / diasMesVencimento) * diasPlano1;
  const valorProporcionalPlano2 = (valorPlano2 / diasMesVencimento) * diasPlano2;
  const valorTotal = valorProporcionalPlano1 + valorProporcionalPlano2;

  document.getElementById('resultadoTrocaPlano').innerHTML = `
    <div class="alert alert-success">
      <p><strong>Valor proporcional do plano atual:</strong> R$ ${valorProporcionalPlano1.toFixed(2)}</p>
      <p><strong>Valor proporcional do novo plano:</strong> R$ ${valorProporcionalPlano2.toFixed(2)}</p>
      <p><strong>Data efetiva da troca:</strong> ${dataEfetivaTroca.toLocaleDateString('pt-BR')}</p>
      <p><strong>Próximo vencimento:</strong> ${proximoVencimento.toLocaleDateString('pt-BR')}</p>
      <hr>
      <h5><strong>Valor Total da Fatura:</strong> R$ ${valorTotal.toFixed(2)}</h5>
    </div>
  `;
}

//========================================================================================================
document.getElementById('formTrocaVencimento').addEventListener('submit', calcularMudancaVencimento);
async function calcularMudancaVencimento(event) {
  event?.preventDefault();

  const valorPlano = parseFloat(document.getElementById('valorPlanoTab4').value.replace(',', '.'));
  const dataVencimentoAtual = new Date(document.getElementById('dataVencimentoAtual').value);
  const novaDataVencimento = parseInt(document.getElementById('novaDataVencimento').value);
  const dataUltimoFaturamento = new Date(document.getElementById('dataTrocaVencimentoHoje').value);

  if (isNaN(valorPlano) || isNaN(dataVencimentoAtual.getTime()) || isNaN(novaDataVencimento) || isNaN(dataUltimoFaturamento.getTime())) {
    alert('Preencha todos os campos corretamente.');
    return;
  }

  // Buscar feriados e calcular data efetiva
  const feriados = await fetch('datas/feriados.json').then(res => res.json()).catch(() => []);
  const dataEfetiva = await adicionar2DiasUteis(dataUltimoFaturamento, feriados);

  // Novo vencimento é no mês seguinte
  const novoVencimento = new Date(dataVencimentoAtual);
  novoVencimento.setMonth(novoVencimento.getMonth() + 1);
  novoVencimento.setDate(novaDataVencimento);
  console.log('[DEBUG] O novo vencimento é: ', novoVencimento);

  // Período é de vencimento atual até um dia antes do novo vencimento
  const fimPeriodo = new Date(novoVencimento);
  fimPeriodo.setDate(fimPeriodo.getDate() - 1);
  console.log('[DEBUG] O periodo de faturamento final é ', fimPeriodo);

  const diasMes = new Date(dataVencimentoAtual.getFullYear(), dataVencimentoAtual.getMonth() + 1, 0).getDate();
  const diffDias = Math.floor((fimPeriodo - dataVencimentoAtual) / (1000 * 60 * 60 * 24));
  console.log('[DEBUG] A quantidade é ', diffDias, 'dias');

  const valorProporcional = (valorPlano / diasMes) * diffDias;

  // Exibir resultado
  document.getElementById('resultadoMudancaVencimento').innerHTML = `
    <div class="alert alert-info">
      <p><strong>Valor proporcional da fatura:</strong> R$ ${valorProporcional.toFixed(2)}</p>
      <p><strong>Data efetiva da mudança:</strong> ${dataEfetiva.toLocaleDateString('pt-BR')}</p>
      <p><strong>Novo vencimento:</strong> ${novoVencimento.toLocaleDateString('pt-BR')}</p>
    </div>
  `;
}
//======================================================================================================
function calcularMultaCancelamento(event) {
  event.preventDefault();

  const inicioContrato = new Date(document.getElementById('dataInicioContrato').value);
  const cancelamento = new Date(document.getElementById('dataMultaCancelamento').value);
  const resultadoDiv = document.getElementById('resultadoMultaCancelamento');
  const houveBloqueio = parseInt(document.getElementById('BloqueioMultaCancelamento').value);

  if (isNaN(inicioContrato.getTime()) || isNaN(cancelamento.getTime())) {
    resultadoDiv.innerHTML = `<div class="alert alert-danger">Preencha todas as datas corretamente.</div>`;
    return;
  }

  // Define a data final da fidelidade (mesmo dia e mês, +1 ano)
  const fimFidelidade = new Date(inicioContrato);
  console.log('Valor de bloqueio', houveBloqueio);
  if (houveBloqueio >= 1) {
    const fimFidelidadeComBloqueio = new Date(inicioContrato);
    fimFidelidadeComBloqueio.setDate(fimFidelidadeComBloqueio.getDate() + 1);
    fimFidelidadeComBloqueio.setMonth(fimFidelidadeComBloqueio.getMonth() + houveBloqueio);
    fimFidelidadeComBloqueio.setFullYear(fimFidelidadeComBloqueio.getFullYear() + 1);
    fimFidelidade.setDate(fimFidelidadeComBloqueio.getDate());
    fimFidelidade.setMonth(fimFidelidadeComBloqueio.getMonth());
    fimFidelidade.setFullYear(fimFidelidadeComBloqueio.getFullYear());
  }
  if (houveBloqueio <= 0) {
    console.log('Sem Bloqueio');
    fimFidelidade.setFullYear(fimFidelidade.getFullYear() + 1);
    fimFidelidade.setDate(fimFidelidade.getDate() + 1);
  }

  // Se já passou da fidelidade, sem multa
  if (cancelamento >= fimFidelidade) {
    resultadoDiv.innerHTML = `<div class="alert alert-success">Nenhuma multa aplicável. Contrato já cumprido.</div>`;
    return;
  }

  // Se ainda está dentro do prazo, calcula meses restantes
  let anos = fimFidelidade.getFullYear() - cancelamento.getFullYear();
  let meses = fimFidelidade.getMonth() - cancelamento.getMonth();
  let dias = fimFidelidade.getDate() - cancelamento.getDate();

  let mesesRestantes = anos * 12 + meses;
  if (dias > 0) {
    mesesRestantes += 1; // arredonda pra cima se ainda não chegou no mesmo dia
  }

  // Garante mínimo de 1 mês, mesmo se as datas forem iguais
  if (mesesRestantes <= 0) {
    resultadoDiv.innerHTML = `<div class="alert alert-success">Nenhuma multa aplicável. Contrato já cumprido.</div>`;
    return;
  }

  const multaBase = 600;
  const multaPorMes = multaBase / 12;
  const valorMulta = multaPorMes * mesesRestantes;

  resultadoDiv.innerHTML = `
    <div class="alert alert-warning">
      <p><strong>Data final da fidelidade:</strong> ${fimFidelidade.toLocaleDateString('pt-BR')}</p>
      <p><strong>Meses restantes:</strong> ${mesesRestantes}</p>
      <p><strong>Valor da multa:</strong> R$ ${valorMulta.toFixed(2)}</p>
    </div>
  `;
}
