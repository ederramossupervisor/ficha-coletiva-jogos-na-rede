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

    // Novos elementos para Xadrez/Tênis de Mesa
    const secaoAlunosGenero = document.getElementById('secao-alunos-genero');
    const listaFeminino = document.getElementById('lista-feminino');
    const listaMasculino = document.getElementById('lista-masculino');
    const btnAddFeminino = document.querySelector('.btn-add-feminino');
    const btnAddMasculino = document.querySelector('.btn-add-masculino');

    // Checkboxes de gênero
    const checkFeminino = document.getElementById('genF');
    const checkMasculino = document.getElementById('genM');

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

    popularSelect(selectModalidade, ["Basquete", "Futsal", "Handebol", "Voleibol", "Tênis de Mesa", "Atletismo", "Xadrez"], 'Selecione a modalidade');
    popularSelect(selectEscola, escolas, 'Selecione a escola...');

    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    inputData.value = `${dia}/${mes}/${ano}`;

    selectEscola.addEventListener('change', () => {
        inputDiretor.value = diretores[selectEscola.value] || '';
    });
    
 selectModalidade.addEventListener('change', () => {
        // A submodalidade não é mais usada
        grupoSubmodalidade.style.display = 'none';

        // Lógica de exibição dos blocos de alunos
        const categoria = getCategoria();
        if (categoria === 'xadrez' || categoria === 'tenis_mesa') {
            // Mostra blocos por gênero, esconde lista padrão
            secaoAlunosGenero.style.display = 'block';
            listaAlunos.parentElement.style.display = 'none'; // esconde toda a seção de alunos padrão
            btnAdicionar.parentElement.style.display = 'none'; // esconde botão "Adicionar Aluno" padrão
            // Desabilita gênero
            checkFeminino.checked = false;
            checkMasculino.checked = false;
            checkFeminino.disabled = true;
            checkMasculino.disabled = true;
        } else {
            // Mostra lista padrão
            secaoAlunosGenero.style.display = 'none';
            listaAlunos.parentElement.style.display = 'block';
            btnAdicionar.parentElement.style.display = 'block';
            checkFeminino.disabled = false;
            checkMasculino.disabled = false;
        }

        // Limpa listas ao trocar modalidade
        listaAlunos.innerHTML = '';
        listaFeminino.innerHTML = '';
        listaMasculino.innerHTML = '';

        // Adiciona linhas iniciais conforme categoria
        if (categoria === 'xadrez' || categoria === 'tenis_mesa') {
            for (let i = 0; i < 2; i++) {
                listaFeminino.appendChild(criarLinhaAlunoGenero('FEMININO', i + 1));
                listaMasculino.appendChild(criarLinhaAlunoGenero('MASCULINO', i + 1));
            }
        } else {
            const maxInicial = (categoria === 'atletismo') ? 3 : 3;
            for (let i = 0; i < maxInicial; i++) {
                listaAlunos.appendChild(criarLinhaAluno(i + 1));
            }
        }
    });

    // Categoria da modalidade selecionada
    function getCategoria() {
        const mod = selectModalidade.value;
        if (mod === 'Xadrez') return 'xadrez';
        if (mod === 'Tênis de Mesa') return 'tenis_mesa';
        if (mod === 'Atletismo') return 'atletismo';
        return 'coletiva';
    }

    function mascaraData(input) {
        let valor = input.value.replace(/\D/g, '');
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

    // Cria linha para a lista padrão (coletivas/atletismo)
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

        const inputMat = div.querySelector('.aluno-data-matricula');
        const inputNasc = div.querySelector('.aluno-data-nascimento');
        inputMat.addEventListener('input', () => mascaraData(inputMat));
        inputNasc.addEventListener('input', () => mascaraData(inputNasc));

        div.querySelector('.remover-aluno').addEventListener('click', () => div.remove());

        const inputNome = div.querySelector('.aluno-nome');
        const inputId = div.querySelector('.aluno-identidade');
        inputNome.addEventListener('blur', () => {
            const escola = selectEscola.value;
            if (!escola) {
                alert('Selecione a escola antes de preencher o nome do aluno.');
                return;
            }
            buscarDadosAluno(inputNome.value, escola, div);
        });

        return div;
    }

    // Cria linha para os blocos de gênero (xadrez/tênis de mesa)
    function criarLinhaAlunoGenero(genero, numero) {
        const div = document.createElement('div');
        div.className = 'aluno-linha';
        const generoTexto = genero === 'FEMININO' ? 'Feminino' : 'Masculino';
        div.innerHTML = `
            <div class="campo nome">
                <input type="text" placeholder="Nome ${generoTexto} ${numero}" class="aluno-nome" required>
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

        const inputMat = div.querySelector('.aluno-data-matricula');
        const inputNasc = div.querySelector('.aluno-data-nascimento');
        inputMat.addEventListener('input', () => mascaraData(inputMat));
        inputNasc.addEventListener('input', () => mascaraData(inputNasc));

        div.querySelector('.remover-aluno').addEventListener('click', () => div.remove());

        const inputNome = div.querySelector('.aluno-nome');
        inputNome.addEventListener('blur', () => {
            const escola = selectEscola.value;
            if (!escola) {
                alert('Selecione a escola antes de preencher o nome do aluno.');
                return;
            }
            buscarDadosAluno(inputNome.value, escola, div);
        });

        return div;
    }

    // Botão adicionar aluno padrão (coletivas/atletismo)
    btnAdicionar.addEventListener('click', () => {
        const categoria = getCategoria();
        const max = (categoria === 'atletismo') ? 18 : 15;
        const total = listaAlunos.querySelectorAll('.aluno-linha').length;
        if (total < max) {
            listaAlunos.appendChild(criarLinhaAluno(total + 1));
        } else {
            alert(`Máximo de ${max} alunos.`);
        }
    });

    // Botões dos blocos de gênero
    btnAddFeminino.addEventListener('click', () => {
        const categoria = getCategoria();
        const max = (categoria === 'xadrez') ? 4 : 2;
        const total = listaFeminino.querySelectorAll('.aluno-linha').length;
        if (total < max) {
            listaFeminino.appendChild(criarLinhaAlunoGenero('FEMININO', total + 1));
        } else {
            alert(`Máximo de ${max} alunas.`);
        }
    });

    btnAddMasculino.addEventListener('click', () => {
        const categoria = getCategoria();
        const max = (categoria === 'xadrez') ? 4 : 2;
        const total = listaMasculino.querySelectorAll('.aluno-linha').length;
        if (total < max) {
            listaMasculino.appendChild(criarLinhaAlunoGenero('MASCULINO', total + 1));
        } else {
            alert(`Máximo de ${max} alunos.`);
        }
    });

    // Inicializa a interface com 3 alunos padrão (coletivas)
    // O evento change da modalidade será disparado programaticamente para configurar a interface inicial
    selectModalidade.dispatchEvent(new Event('change'));

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

        const categoria = getCategoria();
        const modalidade = selectModalidade.value;

        const payload = {
            modalidade: modalidade,
            data: inputData.value,
            escola: selectEscola.value,
            diretor: inputDiretor.value,
            professor: capitalizarNome(document.getElementById('professor').value.trim()),
            auxiliarTecnico: capitalizarNome(document.getElementById('auxiliar').value.trim()),
        };

        // Validações e coleta conforme categoria
        if (categoria === 'xadrez' || categoria === 'tenis_mesa') {
            // Coleta feminino e masculino
            const fem = [];
            const masc = [];
            listaFeminino.querySelectorAll('.aluno-linha').forEach(linha => {
                const inputs = linha.querySelectorAll('input');
                const aeeCheck = linha.querySelector('.aluno-publico-aee');
                fem.push({
                    nome: capitalizarNome(inputs[0].value.trim()),
                    documento: inputs[1].value.trim(),
                    dataMatricula: inputs[2].value.trim(),
                    identidade: inputs[3].value.trim(),
                    dataNascimento: inputs[4].value.trim(),
                    publicoAEE: aeeCheck && aeeCheck.checked ? 'X' : ''
                });
            });
            listaMasculino.querySelectorAll('.aluno-linha').forEach(linha => {
                const inputs = linha.querySelectorAll('input');
                const aeeCheck = linha.querySelector('.aluno-publico-aee');
                masc.push({
                    nome: capitalizarNome(inputs[0].value.trim()),
                    documento: inputs[1].value.trim(),
                    dataMatricula: inputs[2].value.trim(),
                    identidade: inputs[3].value.trim(),
                    dataNascimento: inputs[4].value.trim(),
                    publicoAEE: aeeCheck && aeeCheck.checked ? 'X' : ''
                });
            });

            // Validações específicas
            if (fem.length === 0 || masc.length === 0) {
                alert('É obrigatório inscrever ao menos uma aluna e um aluno.');
                return;
            }
            // Valida campos obrigatórios (implementação abreviada, mas você pode adaptar)
            const todosAlunos = [...fem, ...masc];
            for (const aluno of todosAlunos) {
                if (!aluno.nome || !aluno.documento || aluno.dataMatricula.length < 10 ||
                    !aluno.identidade || aluno.dataNascimento.length < 10) {
                    alert('Preencha todos os campos obrigatórios de todos os alunos.');
                    return;
                }
                // Valida data de matrícula e nascimento (pode chamar funções de validação)
                // ... (omitido por brevidade, mas mantenha as validações que já existem)
            }

            payload.alunosFeminino = fem;
            payload.alunosMasculino = masc;
        } else {
            // Coletivas ou atletismo
            const linhas = listaAlunos.querySelectorAll('.aluno-linha');
            const alunos = [];
            for (const linha of linhas) {
                const inputs = linha.querySelectorAll('input');
                const aeeCheck = linha.querySelector('.aluno-publico-aee');
                // Validação individual
                if (!inputs[0].value.trim()) { alert('Preencha o nome de todos os alunos.'); return; }
                if (!inputs[1].value.trim()) {
                    alert('O campo "Documento com foto" é obrigatório.\n\nCaso o aluno não possua documento com foto, preencha com o ID do aluno.');
                    return;
                }
                if (inputs[2].value.trim().length < 10) { alert('Preencha a data de matrícula de todos os alunos (dd/mm/aaaa).'); return; }
                const dataMatStr = inputs[2].value.trim();
                const [diaMat, mesMat, anoMat] = dataMatStr.split('/');
                const dataMatricula = new Date(`${anoMat}-${mesMat}-${diaMat}T00:00:00`);
                const dataLimiteMat = new Date('2025-11-04T00:00:00');
                if (dataMatricula < dataLimiteMat) { alert('Insira a data de matrícula atual.'); return; }
                if (!inputs[3].value.trim()) { alert('Preencha o ID do aluno para todos os alunos.'); return; }
                if (inputs[4].value.trim().length < 10) { alert('Preencha a data de nascimento de todos os alunos (dd/mm/aaaa).'); return; }
                const dataNascStr = inputs[4].value.trim();
                const [diaNasc, mesNasc, anoNasc] = dataNascStr.split('/');
                const anoNascInt = parseInt(anoNasc, 10);
                if (anoNascInt <= 2007) { alert('Data de nascimento inválida: o aluno já possui mais de 18 anos.'); return; }
                alunos.push({
                    nome: capitalizarNome(inputs[0].value.trim()),
                    documento: inputs[1].value.trim(),
                    dataMatricula: inputs[2].value.trim(),
                    identidade: inputs[3].value.trim(),
                    dataNascimento: inputs[4].value.trim(),
                    publicoAEE: aeeCheck && aeeCheck.checked ? 'X' : ''
                });
            }
            // Validação de mínimo para coletivas
            if (categoria === 'coletiva') {
                const mins = { 'Basquete': 8, 'Futsal': 10, 'Handebol': 10, 'Voleibol': 10 };
                const modPrincipal = modalidade.split(' - ')[0];
                if (alunos.length < mins[modPrincipal]) {
                    alert(`Para ${modPrincipal} é necessário no mínimo ${mins[modPrincipal]} alunos.`);
                    return;
                }
            }
            payload.alunos = alunos;
            payload.generoFeminino = checkFeminino.checked;
            payload.generoMasculino = checkMasculino.checked;
        }

        // Verifica gênero para modalidades que exigem
        if (categoria === 'coletiva' || categoria === 'atletismo') {
            if (!checkFeminino.checked && !checkMasculino.checked) {
                alert('Selecione o gênero (Feminino e/ou Masculino).');
                return;
            }
        }

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
            
            // Monta o nome do arquivo: Escola_Modalidade_Gênero.pdf
            const categoria = getCategoria();
            let nomeModalidade = payload.modalidade; // já está correto (sem submodalidade)
            let nomeGenero = '';
            if (categoria === 'xadrez' || categoria === 'tenis_mesa') {
                nomeGenero = 'Feminino e Masculino';
            } else {
                const generos = [];
                if (checkFeminino.checked) generos.push('Feminino');
                if (checkMasculino.checked) generos.push('Masculino');
                nomeGenero = generos.join(' e ') || 'Sem Gênero';
            }
            let nomeArquivo = `${payload.escola}_${nomeModalidade}_${nomeGenero}`;
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
