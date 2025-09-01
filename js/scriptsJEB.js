document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('anoAtual').textContent = new Date().getFullYear();


    // Ajustando a data 
    var diaHojeInputJEB = document.getElementById('dataCancelamentoHojeJEB');
    var diaHojeBloqueioJEB = document.getElementById('dataBloqueioJEB');
    var diaTrocaPlanoJEB = document.getElementById('dataTrocaPlanoHojeJEB');
    var diaTrocaVencimentoJEB = document.getElementById('dataTrocaVencimentoHojeJEB');
    var dataMultaCancelamentoJEB = document.getElementById('dataMultaCancelamentoJEB');
    //posinputs
    var HojeJEB = new Date();
    var anoHojeJEB = HojeJEB.getFullYear();
    var mesHojeJEB = String(HojeJEB.getMonth() + 1).padStart(2, '0');
    var HojeDiaJEB = String(HojeJEB.getDate()).padStart(2, '0');
    var dataAtualJEB = `${anoHojeJEB}-${mesHojeJEB}-${HojeDiaJEB}`;

    diaHojeInputJEB.value = dataAtualJEB;
    diaHojeBloqueioJEB.value = dataAtualJEB;
    diaTrocaPlanoJEB.value = dataAtualJEB;
    diaTrocaVencimentoJEB.value = dataAtualJEB;
    dataMultaCancelamentoJEB.value = dataAtualJEB;
});

// Função para calcular quantos dias tem no mês
function diasNoMesJEB(data) {
    const anoJEB = data.getFullYear();
    const mesJEB = data.getMonth() + 1;
    return new Date(anoJEB, mesJEB, 0).getDate();
}
/* =================================================================================================================== */
/* Calculo de cancelamento JEB */

//Processo de cancelamento
// Verificando se houve bloqueio
const houveBloqueioJEB = document.getElementById('BloqueioMultaCancelamentoJEB');
let SimHouveBloqueioJEB = houveBloqueioJEB.value;
houveBloqueioJEB.addEventListener('change', function () {
    const currentValue = houveBloqueioJEB.value;
    if (SimHouveBloqueioJEB !== currentValue) {
        //console.log('Valor mudou');
    }
    houveBloqueioJEB.value = currentValue
    //console.log('Bloqueio de ', houveBloqueio.value, 'Meses')
})
// Cálculo do formulário 1 (Cancelamento)
document.getElementById('CancelamentoFormJEB').addEventListener('submit', function (event) {
    event.preventDefault();

    const valorPlanoJEB = parseFloat(document.getElementById('valorPlanoJEB').value);
    const mesReferenciaJEB = new Date(document.getElementById('mesReferenciaJEB').valueAsDate);
    const dataFaturamentoJEB = new Date(document.getElementById('dataCancelamentoHojeJEB').value);
    const diasSemInternetJEB = parseInt(document.getElementById('diasSemInternetJEB').value);

    const inicioContratoJEB = new Date(document.getElementById('dataInicioContratoJEB').value);

    // ajustando a data para o dia correto.
    dataFaturamentoJEB.setDate(dataFaturamentoJEB.getDate() + 1);
    mesReferenciaJEB.setDate(mesReferenciaJEB.getDate() + 1);
    // verificar se os valores são numeros
    if (isNaN(valorPlanoJEB) || isNaN(diasSemInternetJEB) || isNaN(mesReferenciaJEB.getTime()) || isNaN(dataFaturamentoJEB.getTime())) {
        alert('Preencha todos os campos corretamente.');
        return;
    }
    // calcular quantos dias tem naquele mês.
    const totalDiasMes = diasNoMesJEB(mesReferenciaJEB);
    // Calcular dias usados considerando o intervalo de datas
    let diasUsados = dataFaturamentoJEB.getTime() - mesReferenciaJEB.getTime();
    let diasUsadosDiff = Math.ceil(diasUsados / (1000 * 3600 * 24));
    diasUsados = diasUsadosDiff;
    /* console.log(diasUsados); */
    if (diasUsados < 0) diasUsados = 0;
    if (diasUsados >= 0) diasUsados += 1;

    // Descontar dias sem internet
    let diasValidos = diasUsados - diasSemInternetJEB;
    if (diasValidos < 0) diasValidos = 0;

    // Calcular valor proporcional
    const valorDia = valorPlanoJEB / totalDiasMes;
    const valorProporcional = (valorDia * diasValidos).toFixed(2);

    // Verfica se existe multa de FIDELIDADE
    const existeMultaJEB = document.getElementById('ExisteMultaJEB');
    const ExisteMultaCheckedJEB = existeMultaJEB.checked;

    if (ExisteMultaCheckedJEB) {
        //console.log('Existe multa de cancelamento!')

        if (isNaN(inicioContratoJEB.getTime()) || isNaN(dataFaturamentoJEB.getTime())) {
            resultadoDivJEB.innerHTML = `<div class="alert alert-danger">Preencha todas as datas corretamente.</div>`;
            return;
        }

        // Define a data final da fidelidade (mesmo dia e mês, +1 ano)
        const fimFidelidade = new Date(inicioContratoJEB);
        if (fimFidelidade != null) {
            if (houveBloqueio.value >= 1) {
                //console.log('Houve Bloqueio');
                const fimFidelidadeComBloqueio = new Date(inicioContratoJEB);
                //.log('Data Inicial ', fimFidelidade.toLocaleDateString('pt-BR'))


                fimFidelidadeComBloqueio.setDate(fimFidelidadeComBloqueio.getDate() + 1);
                fimFidelidadeComBloqueio.setMonth(fimFidelidadeComBloqueio.getMonth() + parseInt(houveBloqueio.value));
                fimFidelidadeComBloqueio.setFullYear(fimFidelidadeComBloqueio.getFullYear() + 1);
                //console.log('Fim fidelidade com bloqueio', fimFidelidade.toLocaleDateString('pt-BR'))


                fimFidelidade.setDate(fimFidelidadeComBloqueio.getDate());
                fimFidelidade.setMonth(fimFidelidadeComBloqueio.getMonth());
                fimFidelidade.setFullYear(fimFidelidadeComBloqueio.getFullYear());
                //console.log('Fim da fidelidade é ', fimFidelidade.toLocaleDateString('pt-BR'))


            }
            if (houveBloqueio.value <= 0) {
                fimFidelidade.setFullYear(fimFidelidade.getFullYear() + 1);
                fimFidelidade.setDate(fimFidelidade.getDate() + 1);
                //console.log('O final da fidelidade é ', fimFidelidade.toLocaleDateString('pt-BR'))
            }

            if (dataFaturamentoJEB >= fimFidelidade) {
                console.log('Não existe Multa Passou do periodo')
                // Mostrar o resultado
                document.getElementById('resultadoJEB').innerHTML = `
        <div class="alert alert-success" role="alert">
          <p><strong>A quantidade de dias utilizado foi: ${diasValidos}</strong></p>
          <strong>Valor proporcional do cancelamento:</strong> R$ ${valorProporcional}
        </div>
    `;
            } else {
                // Se ainda está dentro do prazo, calcula meses restantes
                let anos = fimFidelidade.getFullYear() - dataFaturamentoJEB.getFullYear();
                let meses = fimFidelidade.getMonth() - dataFaturamentoJEB.getMonth();
                let dias = fimFidelidade.getDate() - dataFaturamentoJEB.getDate();

                let mesesRestantes = anos * 12 + meses;
                if (dias > 0) {
                    mesesRestantes += 1; // arredonda pra cima se ainda não chegou no mesmo dia
                }

                // Garante mínimo de 1 mês, mesmo se as datas forem iguais
                if (mesesRestantes <= 0) {
                    resultadoJEB.innerHTML = `<div class="alert alert-success">Nenhuma multa aplicável. Contrato já cumprido.</div>`;
                    return;
                }

                const multaBase = 100;

                document.getElementById('resultadoJEB').innerHTML = `
      <div class="alert alert-warning">
        <p><strong>A quantidade de dias utilizado foi: ${diasValidos}</strong></p>
        <strong>Valor proporcional do cancelamento:</strong> R$ ${valorProporcional}
        <hr>
        <p><strong>Data final da fidelidade:</strong> ${fimFidelidade.toLocaleDateString('pt-BR')}</p>
        <p><strong>Meses restantes:</strong> ${mesesRestantes}</p>
        <p><strong>Houve um bloqueio de: </strong> ${houveBloqueio.value} Meses</p>
        <hr>
        <p><strong>Valor da multa:</strong> R$ ${multaBase.toFixed(2)}</p>
      </div>
  `;
            }
        }

    } if (!ExisteMultaCheckedJEB) {
        // Mostrar o resultado
        document.getElementById('resultadoJEB').innerHTML = `
      <div class="alert alert-success" role="alert">
        <p><strong>A quantidade de dias utilizado foi: ${diasValidos}</strong></p>
        <strong>Valor proporcional do cancelamento:</strong> R$ ${valorProporcional}
      </div>
  `;
    }
});
// Aqui será colocado a multa de cancelamento dentro do scopo da aba de cancelamento
function ExisteMultaSim() {
    const existeMultaJEB = document.getElementById('ExisteMultaJEB');
    const CamposMultaJEB = document.getElementById('CamposMultaJEB');
    const ExisteMultaCheckJEB = existeMultaJEB.checked;
    if (ExisteMultaCheckJEB) {
        CamposMultaJEB.style.display = "block";
        //console.log('Existe uma multa contratual.')
    } else {
        CamposMultaJEB.style.display = "none";
        //console.log('Não existe multa')
    };
}