document.addEventListener('DOMContentLoaded', () => {

    // ========================
    // SUBSTITUA AQUI PELA URL DA SUA CLOUD FUNCTION
    // ========================
    const CLOUD_FUNCTION_URL = 'https://proxy-ficha-coletiva-327419300290.southamerica-east1.run.app/';

    // ---- Dados estáticos ----
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

    // ---- Elementos do DOM ----
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

    /**
     * Converte um nome para o formato "José da Silva":
     * - Primeira letra de cada palavra em maiúscula
     * - Exceto preposições/artigos como "da", "de", "do", "das", "dos", "e"
     * - Mas se a palavra for a primeira do nome, sempre maiúscula
     */
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

    // ---- Preencher selects ----
    function popularSelect(select, opcoes, textoDefault = 'Selecione...') {
        // 👇 Adiciona opção vazia padrão
        const optDefault = document.createElement('option');
        optDefault.value = '';
        optDefault.textContent = textoDefault;
        select.appendChild(optDefault);

        // Preenche as demais opções
        opcoes.forEach(op => {
            const opt = document.createElement('option');
            opt.value = op;
            opt.textContent = op;
            select.appendChild(opt);
        });
    }

    popularSelect(selectModalidade, ["Basquete", "Futsal", "Handebol", "Voleibol", "Tênis de Mesa", "Atletismo"], 'Selecione a modalidade');
    popularSelect(selectEscola, escolas, 'Selecione a escola...');
    popularSelect(selectSubmodalidade, submodalidades, 'Selecione a submodalidade');

    // Data atual formato dd/mm/aaaa
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    inputData.value = `${dia}/${mes}/${ano}`;

    // Atualiza diretor ao trocar escola
    selectEscola.addEventListener('change', () => {
        inputDiretor.value = diretores[selectEscola.value] || '';
    });

    // Mostra/oculta submodalidade conforme Atletismo
    selectModalidade.addEventListener('change', () => {
        if (selectModalidade.value === 'Atletismo') {
            grupoSubmodalidade.style.display = 'flex';
        } else {
            grupoSubmodalidade.style.display = 'none';
        }
    });

    
    // ---- Gerenciar lista de alunos ----
    function criarLinhaAluno(numero) {
        const div = document.createElement('div');
        div.className = 'aluno-linha';
        div.innerHTML = `
            <input type="text" placeholder="Nome ${numero}" class="aluno-nome" required>
            <input type="text" placeholder="Nº Documento" class="aluno-documento">
            <input type="date" class="aluno-data-matricula input-matricula">
            <input type="text" placeholder="Identidade" class="aluno-identidade">
            <input type="date" class="aluno-data-nascimento input-nascimento">
            <select class="aluno-publico-aee">
                <option value="">Público AEE</option>
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
            </select>
            <button type="button" class="remover-aluno">✕</button>
        `;
        div.querySelector('.remover-aluno').addEventListener('click', () => div.remove());
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

    // Inicia com 3 linhas
    for (let i = 0; i < 3; i++) {
        listaAlunos.appendChild(criarLinhaAluno(i + 1));
    }

    // ---- Envio do formulário ----
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validações básicas
        if (!selectEscola.value) {
            alert('Selecione a escola.');
            return;
        }
        if (!document.getElementById('professor').value.trim()) {
            alert('Preencha o nome do professor(a).');
            return;
        }

                // Validações básicas
        if (!selectEscola.value) {
            alert('Selecione a escola.');
            return;
        }
        if (!document.getElementById('professor').value.trim()) {
            alert('Preencha o nome do professor(a).');
            return;
        }
        // 👇 INSIRA AQUI AS VALIDAÇÕES DA MODALIDADE
        if (!selectModalidade.value) {
            alert('Selecione a modalidade.');
            return;
        }
        if (selectModalidade.value === 'Atletismo' && !selectSubmodalidade.value) {
            alert('Selecione a submodalidade do Atletismo.');
            return;
        }

        // Monta modalidade (inclui submodalidade se for Atletismo)
        let modalidade = selectModalidade.value;
        if (modalidade === 'Atletismo') {
            modalidade = `Atletismo - ${selectSubmodalidade.value}`;
        }

                // Coleta os alunos
                const alunos = [];
                const linhasAlunos = listaAlunos.querySelectorAll('.aluno-linha');
                // Função auxiliar para converter data ISO (yyyy-mm-dd) para dd/mm/aaaa
                const formatarData = (dataISO) => {
                    if (!dataISO) return '';
                    const partes = dataISO.split('-');
                    if (partes.length !== 3) return dataISO;
                    return `${partes[2]}/${partes[1]}/${partes[0]}`;
                };

                linhasAlunos.forEach(linha => {
                    const inputs = linha.querySelectorAll('input');
                    const selectPublico = linha.querySelector('.aluno-publico-aee');
                    alunos.push({
                        nome: capitalizarNome(inputs[0].value.trim()),
                        documento: inputs[1].value.trim(),
                        dataMatricula: formatarData(inputs[2].value),
                        identidade: inputs[3].value.trim(),
                        dataNascimento: formatarData(inputs[4].value),
                        publicoAEE: selectPublico ? selectPublico.value : ''
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

                    // Recebe o blob PDF
                    const blob = await response.blob();
                    // Cria um link temporário e dispara o download
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    // Nome do arquivo: Escola_Prof_Ficha_Coletiva.pdf, com underscores
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
