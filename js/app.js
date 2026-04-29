document.addEventListener('DOMContentLoaded', () => {

    const CLOUD_FUNCTION_URL = 'https://proxy-ficha-coletiva-327419300290.southamerica-east1.run.app/';
    const LOOKUP_URL = CLOUD_FUNCTION_URL + 'lookup';

    const escolas = [
        "CEEFMTI Afonso Cláudio", "CEEFMTI Elisa Paiva", "EEEF Ivana Casagrande Scabelo", "EEEF Severino Paste",
        "EEEFM Alto Rio Possmoser", "EEEFM Álvaro Castelo", "EEEFM Domingos Perim", "EEEFM Elvira Barros",
        "EEEFM Fazenda Camporês", "EEEFM Fazenda Emílio Schroeder", "EEEFM Fioravante Caliman", "EEEFM Frederico Boldt",
        "EEEFM Gisela Salloker Fayet", "EEEFM Graça Aranha", "EEEFM Joaquim Caetano de Paiva", "EEEFM José Cupertino",
        "EEEFM José Giestas", "EEEFM José Roberto Christo", "EEEFM Leogildo Severiano de Souza", "EEEFM Luiz Jouffroy",
        "EEEFM Maria de Abreu Alvim", "EEEFM Mário Bergamin", "EEEFM Marlene Brandão", "EEEFM Pedra Azul",
        "EEEFM Ponto do Alto", "EEEFM Profª Aldy Soares Merçon Vargas", "EEEFM Prof Hermman Berger", "EEEFM São Jorge",
        "EEEFM São Luís", "EEEFM Teófilo Paulino", "EEEM Francisco Guilherme", "EEEM Mata fria", "EEEM Sobreiro"
    ];

    const diretores = {
        "CEEFMTI Afonso Cláudio": "Allan Dyoni Dehete Many", "CEEFMTI Elisa Paiva": "Rosangela Vargas Davel Pinto",
        "EEEFM Domingos Perim": "Maristela Broedel", "EEEFM Alto Rio Possmoser": "Adriana da Conceição Tesch",
        "EEEFM Álvaro Castelo": "Rose Fabrícia Moretto", "EEEFM Elvira Barros": "Andrea Gomes Klug",
        "EEEFM Fazenda Camporês": "Emerson Ungarato", "EEEFM Fazenda Emílio Schroeder": "Jorge Schneider",
        "EEEFM Fioravante Caliman": "Celina Januário Moreira", "EEEFM Frederico Boldt": "David Felberg",
        "EEEFM Gisela Salloker Fayet": "Maxwel Augusto Neves", "EEEFM Graça Aranha": "Camilo Pauli Dominicini",
        "EEEFM Joaquim Caetano de Paiva": "Miriam Klitzke Seibel", "EEEFM José Cupertino": "Cléria Pagotto Ronchi Zanelato",
        "EEEFM José Giestas": "Gederson Vargas Dazilio", "EEEFM José Roberto Christo": "Andressa Silva Dias",
        "EEEFM Leogildo Severiano de Souza": "Adalberto Carlos Araújo Chaves", "EEEFM Luiz Jouffroy": "Nilza Abel Gumz",
        "EEEFM Maria de Abreu Alvim": "Maria das Graças Fabio Costa", "EEEFM Mário Bergamin": "CELINA JANUÁRIO MOREIRA",
        "EEEFM Marlene Brandão": "Paulynne Ayres Tatagiba Gonçalves", "EEEFM Pedra Azul": "Elizabeth Drumond Ambrósio Filgueiras",
        "EEEFM Ponto do Alto": "Marcelo Ribett", "EEEFM Profª Aldy Soares Merçon Vargas": "Israel Augusto Moreira Borges",
        "EEEFM Prof Hermman Berger": "Eliane Raasch Bicalho", "EEEFM São Jorge": "Jormi Maria da Silva",
        "EEEFM São Luís": "Valdirene Mageski Cordeiro Magri", "EEEFM Teófilo Paulino": "Delfina Schneider Stein",
        "EEEM Francisco Guilherme": "Jonatas André Drescher", "EEEF Ivana Casagrande Scabelo": "Maristela Broedel",
        "EEEF Severino Paste": "Maristela Broedel", "EEEM Mata fria": "Jonatas André Drescher",
        "EEEM Sobreiro": "Jonatas André Drescher"
    };

    const submodalidades = [
        "100 metros", "200 metros", "400 metros", "800 metros",
        "Revezamento 4x100 metros", "Arremesso de peso",
        "Lançamento de disco", "Salto em distância"
    ];

    const selectModalidade = document.getElementById('modalidade');
    const grupoSubmodalidade = document.getElementById('grupo-submodalidade');
    const selectSubmodalidade = document.getElementById('submodalidade');
    const inputData = document.getElementById('data');
    const selectEscola = document.getElementById('escola');
    const inputDiretor = document.getElementById('diretor');
    const listaAlunos = document.getElementById('lista-alunos');
    const btnAdicionar = document.getElementById('btn-adicionar-aluno');
    const form = document.getElementById('form-ficha');
    const statusDiv = document.getElementById('status-mensagem');

    function capitalizarNome(nome) {
        const excecoes = ['da', 'de', 'do', 'das', 'dos', 'e'];
        return nome
            .toLowerCase()
            .split(/\s+/)
            .map((palavra, index) => {
                if (index === 0 || !excecoes.includes(palavra)) {
                    return palavra.charAt(0).toUpperCase() + palavra.slice(1);
                }
                return palavra;
            })
            .join(' ');
    }

    function popularSelect(select, opcoes, textoDefault = 'Selecione...') {
        const optDefault = document.createElement('option');
        optDefault.value = '';
        optDefault.textContent = textoDefault;
        select.appendChild(optDefault);

        opcoes.forEach(op => {
            const opt = document.createElement('option');
            opt.value = op;
            opt.textContent = op;
            select.appendChild(opt);
        });
    }

    popularSelect(selectModalidade, ["Basquete", "Futsal", "Handebol", "Voleibol", "Tênis de Mesa", "Atletismo", "Xadrez"], 'Selecione a modalidade');    popularSelect(selectEscola, escolas, 'Selecione a escola...');
    popularSelect(selectSubmodalidade, submodalidades, 'Selecione a submodalidade');

    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    inputData.value = `${dia}/${mes}/${ano}`;

    selectEscola.addEventListener('change', () => {
        inputDiretor.value = diretores[selectEscola.value] || '';
    });

    selectModalidade.addEventListener('change', () => {
        if (selectModalidade.value === 'Atletismo') {
            grupoSubmodalidade.style.display = 'flex';
        } else {
            grupoSubmodalidade.style.display = 'none';
        }
    });

    function mascaraData(input) {
        let valor = input.value.replace(/\D/g, ''); // remove tudo que não é dígito
        if (valor.length > 8) valor = valor.slice(0, 8);
        let formatado = '';
        if (valor.length > 0) {
            formatado = valor.substring(0, 2);
            if (valor.length >= 3) {
                formatado += '/' + valor.substring(2, 4);
            }
            if (valor.length >= 5) {
                formatado += '/' + valor.substring(4, 8);
            }
        }
        input.value = formatado;
    }

async function buscarDadosAluno(nome, escola, linhaDiv) {
  if (!nome.trim() || !escola) return;
  const idInput = linhaDiv.querySelector('.aluno-identidade');
  const matInput = linhaDiv.querySelector('.aluno-data-matricula');
  const nascInput = linhaDiv.querySelector('.aluno-data-nascimento');

  // Mostra feedback
  idInput.value = 'Buscando...';
  idInput.style.color = '#999';
  matInput.value = '';
  nascInput.value = '';
  try {
    const response = await fetch(LOOKUP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: nome.trim(), escola: escola })
    });
    const result = await response.json();
    if (result.success) {
      idInput.value = result.id;
      idInput.style.color = 'var(--cor-texto)';
      // Preenche datas, se existirem
      if (result.dataNascimento) {
        nascInput.value = result.dataNascimento;
      }
      if (result.dataMatricula) {
        matInput.value = result.dataMatricula;
      }
    } else {
      idInput.value = '';
      idInput.style.color = 'var(--cor-texto)';
      alert('Aluno não encontrado na base de dados.\n\nEnvie o nome completo do aluno e sua matrícula para:\nabarone@sedu.es.gov.br ou fdssilva@sedu.es.gov.br');
    }
  } catch (error) {
    idInput.value = '';
    idInput.style.color = 'var(--cor-texto)';
    console.error('Erro na busca:', error);
    alert('Erro ao buscar dados. Tente novamente.');
  }
}

function criarLinhaAluno(numero) {
    const div = document.createElement('div');
    div.className = 'aluno-linha';
    div.innerHTML = `
        <div class="campo nome">
            <input type="text" placeholder="Nome do aluno ${numero}" class="aluno-nome" required>
        </div>
        <div class="campo doc">
            <input type="text" placeholder="Documento com foto" class="aluno-documento" required>
        </div>
        <div class="campo data-matricula">
            <span class="label-data">Matrícula</span>
            <input type="text" placeholder="dd/mm/aaaa" class="aluno-data-matricula input-matricula" maxlength="10" required>
        </div>
        <div class="campo id-aluno">
            <input type="text" placeholder="ID do aluno" class="aluno-identidade" required>
        </div>
        <div class="campo data-nascimento">
            <span class="label-data">Nascimento</span>
            <input type="text" placeholder="dd/mm/aaaa" class="aluno-data-nascimento input-nascimento" maxlength="10" required>
        </div>
        <div class="campo aee">
            <label class="checkbox-aee">
                <input type="checkbox" class="aluno-publico-aee">
                <span>AEE</span>
            </label>
        </div>
        <button type="button" class="remover-aluno">✕</button>
    `;

    // Máscara de data
    const inputMat = div.querySelector('.aluno-data-matricula');
    const inputNasc = div.querySelector('.aluno-data-nascimento');
    inputMat.addEventListener('input', () => mascaraData(inputMat));
    inputNasc.addEventListener('input', () => mascaraData(inputNasc));

    // Botão remover
    div.querySelector('.remover-aluno').addEventListener('click', () => div.remove());

    // *** NOVO: evento blur para buscar ID ***
    const inputNome = div.querySelector('.aluno-nome');
    const inputId = div.querySelector('.aluno-identidade');
      inputNome.addEventListener('blur', () => {
    const escola = selectEscola.value;
    if (!escola) {
      alert('Selecione a escola antes de preencher o nome do aluno.');
      return;
    }
    buscarDadosAluno(inputNome.value, escola, div); // div é a linha inteira
  });

    return div;
}
    
    btnAdicionar.addEventListener('click', () => {
        const total = listaAlunos.querySelectorAll('.aluno-linha').length;
        if (total < 15) {
            listaAlunos.appendChild(criarLinhaAluno(total + 1));
        } else {
            alert('Máximo de 15 alunos.');
        }
    });

    for (let i = 0; i < 3; i++) {
        listaAlunos.appendChild(criarLinhaAluno(i + 1));
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!selectEscola.value) {
            alert('Selecione a escola.');
            return;
        }
        if (!document.getElementById('professor').value.trim()) {
            alert('Preencha o nome do professor(a).');
            return;
        }
        if (!selectModalidade.value) {
            alert('Selecione a modalidade.');
            return;
        }
        if (selectModalidade.value === 'Atletismo' && !selectSubmodalidade.value) {
            alert('Selecione a submodalidade do Atletismo.');
            return;
        }

        if (!document.getElementById('genF').checked && !document.getElementById('genM').checked) {
            alert('Selecione o gênero (Feminino e/ou Masculino).');
            return;
        }

        let modalidade = selectModalidade.value;
        if (modalidade === 'Atletismo') {
            modalidade = `Atletismo - ${selectSubmodalidade.value}`;
        }

                const linhasAlunos = listaAlunos.querySelectorAll('.aluno-linha');

        for (const linha of linhasAlunos) {
            const inputs = linha.querySelectorAll('input');
            const selectPublico = linha.querySelector('.aluno-publico-aee');

            if (!inputs[0].value.trim()) {
                alert('Preencha o nome de todos os alunos.');
                return;
            }
            if (!inputs[1].value.trim()) {
                alert('O campo "Documento com foto" é obrigatório.\n\nCaso o aluno não possua documento com foto, preencha com o ID do aluno.');
                return;
            }
            if (inputs[2].value.trim().length < 10) {
                alert('Preencha a data de matrícula de todos os alunos (dd/mm/aaaa).');
                return;
            }
            // Valida data de matrícula (formato dd/mm/aaaa)
            const dataMatStr = inputs[2].value.trim();
            const [diaMat, mesMat, anoMat] = dataMatStr.split('/');
            const dataMatricula = new Date(`${anoMat}-${mesMat}-${diaMat}T00:00:00`);
            const dataLimiteMat = new Date('2025-11-04T00:00:00');
            if (dataMatricula < dataLimiteMat) {
                alert('Insira a data de matrícula atual.');
                return;
            }
            if (!inputs[3].value.trim()) {
                alert('Preencha o ID do aluno para todos os alunos.');
                return;
            }
            if (inputs[4].value.trim().length < 10) {
                alert('Preencha a data de nascimento de todos os alunos (dd/mm/aaaa).');
                return;
            }
            // Valida ano de nascimento (não pode ser ≤ 2007)
            const dataNascStr = inputs[4].value.trim();
            const [diaNasc, mesNasc, anoNasc] = dataNascStr.split('/');
            const anoNascInt = parseInt(anoNasc, 10);
            if (anoNascInt <= 2007) {
                alert('Data de nascimento inválida: o aluno já possui mais de 18 anos.');
                return;
            }

        }
        
            const alunos = []; 
            linhasAlunos.forEach(linha => {
            const inputs = linha.querySelectorAll('input');
            const selectPublico = linha.querySelector('.aluno-publico-aee');
            const checkboxAEE = linha.querySelector('.aluno-publico-aee');
            alunos.push({
                nome: capitalizarNome(inputs[0].value.trim()),
                documento: inputs[1].value.trim(),
                dataMatricula: inputs[2].value.trim(),
                identidade: inputs[3].value.trim(),
                dataNascimento: inputs[4].value.trim(),
                publicoAEE: checkboxAEE && checkboxAEE.checked ? 'X' : ''
            });
        });

        const payload = {
            modalidade: modalidade,
            generoFeminino: document.getElementById('genF').checked,
            generoMasculino: document.getElementById('genM').checked,
            data: inputData.value,
            escola: selectEscola.value,
            diretor: inputDiretor.value,
            professor: capitalizarNome(document.getElementById('professor').value.trim()),
            auxiliarTecnico: capitalizarNome(document.getElementById('auxiliar').value.trim()),
            alunos: alunos
        };

        statusDiv.textContent = 'Gerando documento...';

        try {
            const response = await fetch(CLOUD_FUNCTION_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Erro na geração do PDF');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            let nomeArquivo = `${payload.escola}_${payload.professor}_Ficha_Coletiva`;
            nomeArquivo = nomeArquivo.replace(/\s+/g, '_') + '.pdf';
            a.download = nomeArquivo;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            statusDiv.textContent = '✅ PDF gerado com sucesso! O download foi iniciado.';
        } catch (error) {
            statusDiv.textContent = '❌ Erro de conexão com o servidor. Verifique se a Cloud Function está ativa.';
            console.error(error);
        }
    });

});
