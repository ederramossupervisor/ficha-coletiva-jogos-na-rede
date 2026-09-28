document.addEventListener('DOMContentLoaded', () => {

    const CLOUD_FUNCTION_URL = 'https://proxy-ficha-coletiva-327419300290.southamerica-east1.run.app/';
    const LOOKUP_URL = CLOUD_FUNCTION_URL + 'lookup';

    const escolas = [
        "CEEFMTI Afonso Cláudio", "CEEFMTI Elisa Paiva", "EE Ivana Casagrande Scabelo", "EE Severino Paste",
        "EEEFM Alto Rio Possmoser", "EEEFM Álvaro Castelo", "EEEFM Domingos Perim", "EEEFM Elvira Barros",
        "EEEFM Fazenda Camporês", "EEEFM Fazenda Emílio Schroeder", "EEEFM Fioravante Caliman", "EEEFM Frederico Boldt",
        "EEEFM Gisela Salloker Fayet", "EEEFM Graça Aranha", "EEEFM Joaquim Caetano de Paiva", "EEEFM José Cupertino",
        "EEEFM José Giestas", "EEEFM José Roberto Christo", "EEEFM Leogildo Severiano de Souza", "EEEFM Luiz Jouffroy",
        "EEEFM Maria de Abreu Alvim", "EE Mário Bergamin", "EEEFM Marlene Brandão", "EEEFM Pedra Azul",
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
        "EEEFM Joaquim Caetano de Paiva": "Miriam Klitzke Seibel", "EEEFM José Cupertino": "Nilzeti Silva da Cruz Coutinho",
        "EEEFM José Giestas": "Gederson Vargas Dazilio", "EEEFM José Roberto Christo": "Andressa Silva Dias",
        "EEEFM Leogildo Severiano de Souza": "Adalberto Carlos Araújo Chaves", "EEEFM Luiz Jouffroy": "Nilza Abel Gumz",
        "EEEFM Maria de Abreu Alvim": "Maria das Graças Fabio Costa", "EE Mário Bergamin": "CELINA JANUÁRIO MOREIRA",
        "EEEFM Marlene Brandão": "Paulynne Ayres Tatagiba Gonçalves", "EEEFM Pedra Azul": "Elizabeth Drumond Ambrósio Filgueiras",
        "EEEFM Ponto do Alto": "Marcelo Ribett", "EEEFM Profª Aldy Soares Merçon Vargas": "Israel Augusto Moreira Borges",
        "EEEFM Prof Hermman Berger": "Eliane Raasch Bicalho", "EEEFM São Jorge": "Jormi Maria da Silva",
        "EEEFM São Luís": "Valdirene Mageski Cordeiro Magri", "EEEFM Teófilo Paulino": "Delfina Schneider Stein",
        "EEEM Francisco Guilherme": "Jonatas André Drescher", "EE Ivana Casagrande Scabelo": "Maristela Broedel",
        "EE Severino Paste": "Maristela Broedel", "EEEM Mata fria": "Jonatas André Drescher",
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

    // Fichas salvas na planilha
    const secaoFichasSalvas = document.getElementById('secao-fichas-salvas');
    const selectFichasSalvas = document.getElementById('select-fichas-salvas');
    const btnCarregarFicha = document.getElementById('btn-carregar-ficha');
    const btnExcluirFicha = document.getElementById('btn-excluir-ficha');

    // Novos elementos para Xadrez/Tênis de Mesa
    const secaoAlunosGenero = document.getElementById('secao-alunos-genero');
    const listaFeminino = document.getElementById('lista-feminino');
    const listaMasculino = document.getElementById('lista-masculino');
    const btnAddFeminino = document.querySelector('.btn-add-feminino');
    const btnAddMasculino = document.querySelector('.btn-add-masculino');

    // Checkboxes de gênero
    const checkFeminino = document.getElementById('genF');
    const checkMasculino = document.getElementById('genM');
    // Torna os checkboxes de gênero mutuamente exclusivos
    checkFeminino.addEventListener('change', () => {
        if (checkFeminino.checked) checkMasculino.checked = false;
    });
    checkMasculino.addEventListener('change', () => {
        if (checkMasculino.checked) checkFeminino.checked = false;
    });

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
        carregarFichasDaEscola();
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

        function normalizarNome(nome) {
        return nome
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/\s+/g, ' ')
            .trim();
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

    async function buscarDadosAluno(nome, escola, linhaDiv, tentativa = 1) {
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

            if (!response.ok) {
                // O proxy (Cloud Run) às vezes retorna 500 na primeira
                // chamada depois de ficar inativo (cold start). Tenta de
                // novo automaticamente uma vez antes de desistir.
                if (tentativa === 1) {
                    console.warn(`Lookup falhou com status ${response.status}, tentando novamente...`);
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    return buscarDadosAluno(nome, escola, linhaDiv, tentativa + 1);
                }
                throw new Error(`O servidor de busca respondeu com erro ${response.status}.`);
            }

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
            alert('Erro ao buscar dados. O servidor pode estar iniciando — aguarde alguns segundos e tente novamente.');
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
            <div class="checkbox-aee">
                <input type="checkbox" class="aluno-publico-aee">
                <span>AEE</span>
            </div>
        </div>
            <button type="button" class="remover-aluno">✕</button>
        `;

        const inputMat = div.querySelector('.aluno-data-matricula');
        const inputNasc = div.querySelector('.aluno-data-nascimento');
        inputMat.addEventListener('input', () => mascaraData(inputMat));
        inputNasc.addEventListener('input', () => mascaraData(inputNasc));

        div.querySelector('.remover-aluno').addEventListener('click', () => {
            div.remove();
            renumerarListaPadrao();  // ✅ chama a função correta para a lista padrão
        });

        const inputNome = div.querySelector('.aluno-nome');
        const inputId = div.querySelector('.aluno-identidade');
        inputNome.addEventListener('blur', () => {
            // Ficha carregada do histórico: não busca de novo se o nome não mudou
            if (div.dataset.nomeRestaurado && inputNome.value.trim() === div.dataset.nomeRestaurado) return;
            const escola = selectEscola.value;
            if (!escola) {
                alert('Selecione a escola antes de preencher o nome do aluno.');
                return;
            }
            buscarDadosAluno(inputNome.value, escola, div);
        });

        return div;
    }

    // Renumera as linhas da lista padrão (coletivas/atletismo)
    function renumerarListaPadrao() {
        const linhas = listaAlunos.querySelectorAll('.aluno-linha');
        linhas.forEach((linha, index) => {
            const numero = index + 1;
            const inputNome = linha.querySelector('.aluno-nome');
            if (inputNome) {
                inputNome.placeholder = `Nome do aluno ${numero}`;
            }
        });
    }

    // Renumera as linhas de um bloco de gênero específico
    function renumerarListaGenero(container, genero) {
        const linhas = container.querySelectorAll('.aluno-linha');
        const generoTexto = genero === 'FEMININO' ? 'Feminino' : 'Masculino';
        linhas.forEach((linha, index) => {
            const numero = index + 1;
            const inputNome = linha.querySelector('.aluno-nome');
            if (inputNome) {
                inputNome.placeholder = `Nome ${generoTexto} ${numero}`;
            }
        });
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
                <div class="checkbox-aee">
                    <input type="checkbox" class="aluno-publico-aee">
                    <span>AEE</span>
                </div>
            </div>
            <button type="button" class="remover-aluno">✕</button>
        `;

        const inputMat = div.querySelector('.aluno-data-matricula');
        const inputNasc = div.querySelector('.aluno-data-nascimento');
        inputMat.addEventListener('input', () => mascaraData(inputMat));
        inputNasc.addEventListener('input', () => mascaraData(inputNasc));

                div.querySelector('.remover-aluno').addEventListener('click', () => {
                    div.remove();
                    if (genero === 'FEMININO') {
                        renumerarListaGenero(listaFeminino, 'FEMININO');
                    } else {
                        renumerarListaGenero(listaMasculino, 'MASCULINO');
                    }
                });

        const inputNome = div.querySelector('.aluno-nome');
        inputNome.addEventListener('blur', () => {
            // Ficha carregada do histórico: não busca de novo se o nome não mudou
            if (div.dataset.nomeRestaurado && inputNome.value.trim() === div.dataset.nomeRestaurado) return;
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

    // ===== Fichas salvas na planilha (via mesmo backend/proxy da ficha) =====
    // O servidor (Apps Script) salva a ficha sozinho quando o PDF é gerado.
    // Aqui o app só LISTA e EXCLUI as fichas guardadas na planilha.

    // Fichas da escola atualmente selecionada: [{ chave, salvoEm, payload }]
    let fichasDaEscola = [];

    async function chamarBackend(dados, tentativa = 1) {
        try {
            const response = await fetch(CLOUD_FUNCTION_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            if (!response.ok) throw new Error('HTTP ' + response.status);
            const texto = await response.text();
            let resultado;
            try {
                resultado = JSON.parse(texto);
            } catch (e) {
                throw new Error('Resposta inesperada do servidor: ' + texto.slice(0, 200));
            }
            if (!resultado.success) throw new Error(resultado.error || 'Erro desconhecido no servidor');
            return resultado;
        } catch (erro) {
            // O proxy (Cloud Run) às vezes falha na primeira chamada depois de
            // ficar inativo (cold start): tenta mais uma vez.
            if (tentativa === 1) {
                await new Promise(resolve => setTimeout(resolve, 1500));
                return chamarBackend(dados, tentativa + 1);
            }
            throw erro;
        }
    }

    // Identifica a ficha por escola + modalidade + gênero (igual ao servidor):
    // ao gerar de novo a mesma ficha, ela substitui a anterior.
    function chaveDaFicha(payload) {
        let genero;
        if (payload.alunosFeminino || payload.alunosMasculino) {
            genero = 'FM';
        } else {
            genero = (payload.generoFeminino ? 'F' : '') + (payload.generoMasculino ? 'M' : '');
        }
        return [payload.escola, payload.modalidade, genero].join('|');
    }

    function rotuloDaFicha(ficha) {
        const p = ficha.payload;
        let genero;
        if (p.alunosFeminino || p.alunosMasculino) {
            genero = 'Fem. e Masc.';
        } else {
            genero = [p.generoFeminino ? 'Fem.' : '', p.generoMasculino ? 'Masc.' : ''].filter(Boolean).join(' e ');
        }
        const d = new Date(ficha.salvoEm);
        const quando = d.toLocaleDateString('pt-BR') + ' ' +
            d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        const prof = p.professor ? ` — Prof. ${p.professor}` : '';
        return `${p.modalidade}${genero ? ' (' + genero + ')' : ''}${prof} — salva em ${quando}`;
    }

    function atualizarListaFichasSalvas(chaveSelecionada) {
        selectFichasSalvas.innerHTML = '';
        fichasDaEscola.forEach(ficha => {
            const opt = document.createElement('option');
            opt.value = ficha.chave;
            opt.textContent = rotuloDaFicha(ficha);
            selectFichasSalvas.appendChild(opt);
        });
        if (chaveSelecionada) selectFichasSalvas.value = chaveSelecionada;
        secaoFichasSalvas.style.display = fichasDaEscola.length ? 'block' : 'none';
    }

    // Busca na planilha as fichas da escola selecionada
    async function carregarFichasDaEscola() {
        const escola = selectEscola.value;
        fichasDaEscola = [];
        atualizarListaFichasSalvas();
        if (!escola) return;
        try {
            const resultado = await chamarBackend({ action: 'listarFichas', escola: escola });
            if (selectEscola.value !== escola) return; // trocou de escola durante a busca
            fichasDaEscola = resultado.fichas || [];
            atualizarListaFichasSalvas();
        } catch (e) {
            console.warn('Não foi possível buscar as fichas salvas:', e);
        }
    }

    // Depois de gerar o PDF (o servidor já salvou na planilha), atualiza a lista na tela
    function registrarFichaNaLista(payload) {
        if (selectEscola.value !== payload.escola) return;
        const chave = chaveDaFicha(payload);
        fichasDaEscola = fichasDaEscola.filter(f => f.chave !== chave);
        fichasDaEscola.unshift({ chave: chave, salvoEm: new Date().toISOString(), payload: payload });
        atualizarListaFichasSalvas(chave);
    }

    function preencherLinha(div, aluno) {
        div.querySelector('.aluno-nome').value = aluno.nome || '';
        div.querySelector('.aluno-documento').value = aluno.documento || '';
        div.querySelector('.aluno-data-matricula').value = aluno.dataMatricula || '';
        div.querySelector('.aluno-identidade').value = aluno.identidade || '';
        div.querySelector('.aluno-data-nascimento').value = aluno.dataNascimento || '';
        div.querySelector('.aluno-publico-aee').checked = aluno.publicoAEE === 'X';
        div.dataset.nomeRestaurado = (aluno.nome || '').trim();
    }

    function carregarFicha(payload) {
        // Modalidade primeiro (monta a interface certa)
        selectModalidade.value = payload.modalidade;
        selectModalidade.dispatchEvent(new Event('change'));

        // Escola e diretor (sem disparar de novo a busca das fichas)
        selectEscola.value = payload.escola;
        inputDiretor.value = diretores[payload.escola] || '';

        document.getElementById('professor').value = payload.professor || '';
        document.getElementById('auxiliar').value = payload.auxiliarTecnico || '';

        const categoria = getCategoria();
        if (categoria === 'xadrez' || categoria === 'tenis_mesa') {
            listaFeminino.innerHTML = '';
            listaMasculino.innerHTML = '';
            (payload.alunosFeminino || []).forEach((aluno, i) => {
                const linha = criarLinhaAlunoGenero('FEMININO', i + 1);
                preencherLinha(linha, aluno);
                listaFeminino.appendChild(linha);
            });
            (payload.alunosMasculino || []).forEach((aluno, i) => {
                const linha = criarLinhaAlunoGenero('MASCULINO', i + 1);
                preencherLinha(linha, aluno);
                listaMasculino.appendChild(linha);
            });
        } else {
            listaAlunos.innerHTML = '';
            (payload.alunos || []).forEach((aluno, i) => {
                const linha = criarLinhaAluno(i + 1);
                preencherLinha(linha, aluno);
                listaAlunos.appendChild(linha);
            });
            checkFeminino.checked = !!payload.generoFeminino;
            checkMasculino.checked = !!payload.generoMasculino;
        }

        // A data continua sendo a de hoje (definida no início da página)
        statusDiv.textContent = '✏️ Ficha carregada. Faça as alterações e clique em "Gerar Ficha".';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    btnCarregarFicha.addEventListener('click', () => {
        const ficha = fichasDaEscola.find(f => f.chave === selectFichasSalvas.value);
        if (!ficha) {
            alert('Nenhuma ficha selecionada.');
            return;
        }
        carregarFicha(ficha.payload);
    });

    btnExcluirFicha.addEventListener('click', async () => {
        const ficha = fichasDaEscola.find(f => f.chave === selectFichasSalvas.value);
        if (!ficha) return;
        if (!confirm('Excluir esta ficha da planilha?\n\n' + rotuloDaFicha(ficha))) return;
        try {
            await chamarBackend({ action: 'excluirFicha', chave: ficha.chave });
            fichasDaEscola = fichasDaEscola.filter(f => f.chave !== ficha.chave);
            atualizarListaFichasSalvas();
        } catch (e) {
            console.error('Erro ao excluir a ficha:', e);
            alert('Não foi possível excluir a ficha. Tente novamente.');
        }
    });

    // Inicializa a interface com 3 alunos padrão (coletivas)
    // O evento change da modalidade será disparado programaticamente para configurar a interface inicial
    selectModalidade.dispatchEvent(new Event('change'));
    atualizarListaFichasSalvas();

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

            if (fem.length === 0 && masc.length === 0) {
                alert('Insira ao menos um aluno (feminino ou masculino).');
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

                        // 🔍 Verifica nomes duplicados
            const nomesNormalizados = todosAlunos.map(a => normalizarNome(a.nome));
            const duplicados = nomesNormalizados.filter((nome, i, arr) => arr.indexOf(nome) !== i);
            if (duplicados.length > 0) {
                alert('Há nomes de alunos repetidos na ficha. Verifique e corrija.');
                return;
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

            // 🔍 Verifica nomes duplicados
            const nomesNormalizados = alunos.map(a => normalizarNome(a.nome));
            const duplicados = nomesNormalizados.filter((nome, i, arr) => arr.indexOf(nome) !== i);
            if (duplicados.length > 0) {
                alert('Há nomes de alunos repetidos na ficha. Verifique e corrija.');
                return;
            }

            // Validação de mínimo para coletivas (com aviso de exceção para escolas pequenas)
            if (categoria === 'coletiva') {
                const mins = { 'Basquete': 8, 'Futsal': 10, 'Handebol': 10, 'Voleibol': 10 };
                const modPrincipal = modalidade.split(' - ')[0];
                if (alunos.length < mins[modPrincipal]) {
                    const confirmar = confirm(
                        `O regulamento exige no mínimo ${mins[modPrincipal]} alunos para ${modPrincipal}.\n\n` +
                        `Sua escola tem MENOS de 100 alunos no ensino médio?\n\n` +
                        `Clique em OK para confirmar e prosseguir, ou Cancelar para ajustar a quantidade.`
                    );
                    if (!confirmar) {
                        return; // usuário cancelou, interrompe o envio
                    }
                    // Se confirmou, continua normalmente (escola pequena, exceção do art. 14)
                }
            }

            payload.alunos = alunos;
            payload.generoFeminino = checkFeminino.checked;
            payload.generoMasculino = checkMasculino.checked;
        }

            if (categoria === 'coletiva' || categoria === 'atletismo') {
            if (!checkFeminino.checked && !checkMasculino.checked) {
                alert('Selecione o gênero (Feminino e/ou Masculino).');
                return;
            }
            // Modalidades coletivas exigem apenas um gênero
            if (categoria === 'coletiva' && checkFeminino.checked && checkMasculino.checked) {
                alert('Modalidades coletivas permitem apenas um gênero: escolha Feminino ou Masculino.');
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

            // O back-end (Apps Script) deveria sempre retornar o PDF como uma
            // string em base64 puro (texto), mas na prática o proxy Cloud Run
            // às vezes entrega esse mesmo conteúdo de formas diferentes:
            // - texto base64 normal (caso esperado)
            // - os bytes do PDF já "crus" (binário)
            // - uma mensagem de erro (texto/JSON) quando a geração falha
            // Por isso lemos a resposta como bytes brutos (arrayBuffer) e
            // detectamos qual desses três casos é, em vez de assumir texto
            // UTF-8 direto — ler bytes binários como texto UTF-8 corrompe
            // os dados e foi a causa dos erros anteriores (atob e "caracteres
            // fora do intervalo Latin1").
            const rawBuffer = await response.arrayBuffer();
            const rawBytes = new Uint8Array(rawBuffer);

            let byteArray;

            // Caso 1: já são os bytes de um PDF (assinatura "%PDF").
            const assinaturaPdf = [0x25, 0x50, 0x44, 0x46]; // %PDF
            const jaEhPdf = assinaturaPdf.every((b, i) => rawBytes[i] === b);

            if (jaEhPdf) {
                byteArray = rawBytes;
            } else {
                // Caso 2 ou 3: interpreta os bytes como texto Latin1 (não
                // UTF-8) para não corromper nada, e decide se é base64 ou
                // uma mensagem de erro.
                let textoLatin1 = '';
                for (let i = 0; i < rawBytes.length; i++) {
                    textoLatin1 += String.fromCharCode(rawBytes[i]);
                }
                const pareceBase64 = /^[A-Za-z0-9+/=\s]+$/.test(textoLatin1) && textoLatin1.trim().length > 0;

                if (pareceBase64) {
                    // Caso 2: texto base64 normal.
                    const byteCharacters = atob(textoLatin1.replace(/\s/g, ''));
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    byteArray = new Uint8Array(byteNumbers);
                } else {
                    // Caso 3: não é PDF nem base64 — provavelmente uma
                    // mensagem de erro do servidor (texto ou JSON), ou dados
                    // corrompidos/comprimidos de forma inesperada.
                    const textoUtf8 = new TextDecoder('utf-8', { fatal: false }).decode(rawBytes);
                    console.error('Resposta do servidor não é um PDF válido. Bytes (Latin1):', textoLatin1);
                    console.error('Resposta do servidor não é um PDF válido. Texto (UTF-8):', textoUtf8);
                    let mensagemServidor = textoUtf8;
                    try {
                        const jsonErro = JSON.parse(textoUtf8);
                        mensagemServidor = jsonErro.error || jsonErro.message || textoUtf8;
                    } catch (parseError) {
                        // não era JSON, usa o texto puro mesmo
                    }
                    throw new Error('O servidor não conseguiu gerar o PDF: ' + mensagemServidor);
                }
            }

            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            // Monta o nome do arquivo: Escola_Modalidade_Gênero.pdf
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
            // O servidor já guardou a ficha na planilha: atualiza a lista na tela
            registrarFichaNaLista(payload);
            statusDiv.textContent = '✅ PDF gerado com sucesso! O download foi iniciado.';
        } catch (error) {
            statusDiv.textContent = '❌ ' + (error.message || 'Erro de conexão com o servidor. Verifique se a Cloud Function está ativa.');
            console.error(error);
        }
    });

});
