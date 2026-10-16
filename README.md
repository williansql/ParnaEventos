# ParnaEventos — Apresentação Executiva & Arquitetural

> **Apresentação Interativa em HTML para o Gestor Afrânio Alex**  
> *GCTI — Grupo de Ciência, Tecnologia da Informação e Inovação*  
> *Prefeitura Municipal de Parnamirim / RN*

---

## 🎯 Sobre o Projeto

O **ParnaEventos** é a proposta arquitetural para a Plataforma Municipal Integrada de Eventos de Parnamirim. Esta apresentação interativa em formato de web app foi construída com rigor de engenharia de software, apresentando:

- **As 3 Decisões Estratégicas Chave**: Capacidade por participante individual (incluindo dependentes menores), convocação automática de lista de espera (FIFO) e encerramento automático de inscrições não validadas no balcão.
- **Engenharia de Domínio & SOLID**: Arquitetura em Monólito Modular para consistência ACID imediata.
- **Transações Críticas Concorrentes (PostgreSQL)**: Bloqueio pessimista (`SELECT FOR UPDATE`), índices parciais e restrições únicas para eliminar *overbooking* e fraudes.
- **Simulador Interativo Live**: Módulo interativo para demonstrar em tempo real ao gestor o bloqueio de conflitos de data, promoção instantânea da fila e rejeição de tickets duplicados.

---

## 🚀 Como Executar e Apresentar

### Opção 1: Abrir diretamente no Navegador
Basta abrir o arquivo [index.html](file:///home/willians-pc/Documentos/Projetos/Apresenta%C3%A7%C3%B5es/ParnaEventos/index.html) em qualquer navegador moderno (Google Chrome, Edge, Firefox, Brave, Safari). Não requer instalação de pacotes externos nem conexão à internet.

### Opção 2: Servidor Local (Recomendado para Apresentações)
```bash
cd "/home/willians-pc/Documentos/Projetos/Apresentações/ParnaEventos"
python3 -m http.server 4321
```
Acesse: [http://localhost:4321](http://localhost:4321)

---

## ⌨️ Atalhos de Teclado (Controles da Apresentação)

| Tecla | Função |
|---|---|
| <kbd>→</kbd> ou <kbd>Espaço</kbd> ou <kbd>PageDown</kbd> | Avançar para o próximo slide |
| <kbd>←</kbd> ou <kbd>PageUp</kbd> | Voltar para o slide anterior |
| <kbd>Home</kbd> | Ir para o Slide 01 (Capa) |
| <kbd>End</kbd> | Ir para o Slide 12 (Conclusão) |
| <kbd>S</kbd> | Abrir/Fechar o **Simulador Interativo Live** |
| <kbd>N</kbd> | Abrir/Fechar as **Notas de Fala do Apresentador** |
| <kbd>G</kbd> | Abrir a **Grade de Slides** (Índice geral com salto direto) |
| <kbd>F</kbd> | Alternar modo **Tela Cheia (Fullscreen)** |
| <kbd>Esc</kbd> | Fechar modais abertos |

---

## 📑 Roteiro dos 12 Slides

1. **Slide 01 — Capa Executiva**: Visão geral do ParnaEventos e dedicatória a Afrânio Alex (GCTI).
2. **Slide 02 — O Desafio Operacional**: Picos massivos de inscrição ("virada de lote"), vagas fantasmas e gargalo no balcão de kits.
3. **Slide 03 — As 3 Decisões Estratégicas Chave**: Capacidade por pessoa, fila de espera automática e encerramento de pendentes.
4. **Slide 04 — Fluxo Ponta a Ponta**: Jornada em 7 passos do cidadão e operador com a distinção de *Inscrição Pendente* vs *Participação Confirmada*.
5. **Slide 05 — Regras de Negócio e Casos Especiais**: Trava de mesmo dia, cancelamento com senha, dependentes menores e reversão com auditoria.
6. **Slide 06 — Máquina de Estados Finita (FSM)**: Os 6 estados do domínio (`PENDING_VALIDATION`, `CONFIRMED`, `WAITLISTED`, etc.) e invariantes rígidas.
7. **Slide 07 — Arquitetura de Software**: Monólito Modular, princípios SOLID e Bounded Contexts.
8. **Slide 08 — As 3 Transações Críticas (ACID)**: Pipelines visuais da Inscrição Concorrente, Cancelamento/Convocação e Validação do Balcão.
9. **Slide 09 — Modelo Relacional (PostgreSQL)**: Schema com tabelas, chaves primárias/estrangeiras, hash de token e logs imutáveis.
10. **Slide 10 — Resiliência & Escala**: Fila virtual na borda, cache de leitura em memória, pool otimizado e Outbox Pattern.
11. **Slide 11 — Roadmap de 5 Fases**: Cronograma de entregas desde o banco de dados até o teste de estresse e go-live.
12. **Slide 12 — Conclusão & Próximos Passos**: Alinhamento final com a gestão do GCTI e convite para a PoC.

---

## 🧪 Como Conduzir o Simulador Live com o Gestor

Pressione <kbd>S</kbd> durante a apresentação para abrir a bancada de testes interativa:

1. **Aba 1 (Conflito de Data no Mesmo Dia)**:  
   Mostre que Maria Silva já possui inscrição na *Corrida da Emancipação*. Clique em *"Tentar Inscrição no Evento B"*. O log do servidor exibirá a transação serializada, o bloqueio e a recusa com `HTTP 409 Conflict`.
2. **Aba 2 (Capacidade & Fila de Espera Automática)**:  
   Mostre a capacidade 3/3 lotada. Clique em *"Simular Cancelamento de Vaga (Titular)"*. O motor de concorrência detecta a vaga aberta e promove Carlos Eduardo instantaneamente, gerando o ticket e emitindo o evento no outbox.
3. **Aba 3 (Cancelamento Seguro com Senha)**:  
   Demonstre a proteção contra exclusão acidental. A senha correta é `parnamirim123`. Mostre a diferença entre inscrições abertas (vaga reabre) e inscrições encerradas (vaga é retida).
4. **Aba 4 (Ticket Único & Validação do Kit no Balcão)**:  
   Clique em *"Bipar e Validar"*. O ticket passa para `USED` e o cidadão vira `CONFIRMED`. Clique novamente no botão: o sistema emite um alerta vermelho de fraude registrando operador, data e tentativa de reuso.
