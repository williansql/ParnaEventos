/**
 * ParnaEventos — Presentation Controller & Interactive Simulator Engine
 * Tailored for GCTI - Prefeitura Municipal de Parnamirim / Afrânio Alex
 */

class PresentationEngine {
  constructor() {
    this.currentSlide = 1;
    this.totalSlides = 12;
    this.slides = document.querySelectorAll('.slide');
    this.progressBar = document.getElementById('progressBar');
    this.slideIndicator = document.getElementById('slideIndicator');
    this.slideBubble = document.getElementById('slideBubble');
    this.notesPanel = document.getElementById('notesPanel');
    this.notesContent = document.getElementById('notesContent');
    this.notesSlideNumber = document.getElementById('notesSlideNumber');
    this.modalOverview = document.getElementById('modalOverview');
    this.modalSimulator = document.getElementById('modalSimulator');

    this.slideTitles = [
      "Visão Geral & Capa Executiva",
      "O Desafio Operacional Municipal",
      "As 3 Decisões Estratégicas Chave",
      "Jornada do Cidadão & Operador",
      "Regras de Negócio & Tratamento de Exceções",
      "Máquina de Estados da Inscrição (FSM)",
      "Arquitetura: Monólito Modular & SOLID",
      "As 3 Transações Críticas (ACID)",
      "Modelo de Dados Relacional (PostgreSQL)",
      "Estratégia de Escala & Resiliência a Picos",
      "Roadmap de Desenvolvimento (5 Fases)",
      "Conclusão & Próximos Passos GCTI"
    ];

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.buildOverviewGrid();
    this.updateSlideView();
    this.setupTouchGestures();
  }

  goToSlide(slideIndex) {
    if (slideIndex < 1 || slideIndex > this.totalSlides) return;
    
    // Manage classes for directional animation
    this.slides.forEach((slide, idx) => {
      const num = idx + 1;
      slide.classList.remove('active', 'prev');
      if (num < slideIndex) {
        slide.classList.add('prev');
      }
    });

    this.currentSlide = slideIndex;
    const target = document.getElementById(`slide-${slideIndex}`);
    if (target) {
      target.classList.add('active');
    }

    this.updateSlideView();
  }

  nextSlide() {
    if (this.currentSlide < this.totalSlides) {
      this.goToSlide(this.currentSlide + 1);
    }
  }

  prevSlide() {
    if (this.currentSlide > 1) {
      this.goToSlide(this.currentSlide - 1);
    }
  }

  updateSlideView() {
    // Update headers and indicators
    const formattedCurrent = String(this.currentSlide).padStart(2, '0');
    const formattedTotal = String(this.totalSlides).padStart(2, '0');
    
    if (this.slideIndicator) {
      this.slideIndicator.textContent = `${formattedCurrent} / ${formattedTotal}`;
    }
    if (this.slideBubble) {
      this.slideBubble.textContent = `${this.currentSlide} / ${this.totalSlides}`;
    }

    // Update Progress Bar
    const percent = (this.currentSlide / this.totalSlides) * 100;
    if (this.progressBar) {
      this.progressBar.style.width = `${percent}%`;
    }

    // Update Notes
    this.updateSpeakerNotes();

    // Update active state in overview grid if open
    document.querySelectorAll('.slide-thumb-card').forEach((card, idx) => {
      if (idx + 1 === this.currentSlide) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  }

  updateSpeakerNotes() {
    const noteEl = document.querySelector(`.speaker-notes[data-for="${this.currentSlide}"]`);
    if (noteEl && this.notesContent) {
      this.notesContent.innerHTML = noteEl.innerHTML;
    } else if (this.notesContent) {
      this.notesContent.innerHTML = "<em>Sem notas registradas para este slide.</em>";
    }
    if (this.notesSlideNumber) {
      this.notesSlideNumber.textContent = this.currentSlide;
    }
  }

  toggleNotes() {
    this.notesPanel.classList.toggle('open');
  }

  toggleOverview() {
    this.modalOverview.classList.toggle('open');
  }

  toggleSimulator() {
    this.modalSimulator.classList.toggle('open');
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn(`Fullscreen error: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  buildOverviewGrid() {
    const grid = document.getElementById('slidesGridIndex');
    if (!grid) return;
    grid.innerHTML = '';

    this.slideTitles.forEach((title, idx) => {
      const num = idx + 1;
      const card = document.createElement('div');
      card.className = `slide-thumb-card ${num === this.currentSlide ? 'active' : ''}`;
      card.innerHTML = `
        <div class="thumb-num">SLIDE ${String(num).padStart(2, '0')}</div>
        <div class="thumb-title">${title}</div>
      `;
      card.addEventListener('click', () => {
        this.goToSlide(num);
        this.modalOverview.classList.remove('open');
      });
      grid.appendChild(card);
    });
  }

  setupEventListeners() {
    // Navigation Buttons
    document.getElementById('btnNext')?.addEventListener('click', () => this.nextSlide());
    document.getElementById('btnPrev')?.addEventListener('click', () => this.prevSlide());

    // Header Actions
    document.getElementById('btnNotes')?.addEventListener('click', () => this.toggleNotes());
    document.getElementById('btnCloseNotes')?.addEventListener('click', () => this.toggleNotes());
    
    document.getElementById('btnOverview')?.addEventListener('click', () => this.toggleOverview());
    document.getElementById('btnCloseOverview')?.addEventListener('click', () => this.toggleOverview());

    document.getElementById('btnSimulator')?.addEventListener('click', () => this.toggleSimulator());
    document.getElementById('btnOpenSimulatorFromEnd')?.addEventListener('click', () => this.toggleSimulator());
    document.getElementById('btnCloseSimulator')?.addEventListener('click', () => this.toggleSimulator());

    document.getElementById('btnFullscreen')?.addEventListener('click', () => this.toggleFullscreen());

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      switch (e.key) {
        case 'ArrowRight':
        case ' ':
        case 'PageDown':
          e.preventDefault();
          this.nextSlide();
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          this.prevSlide();
          break;
        case 'Home':
          e.preventDefault();
          this.goToSlide(1);
          break;
        case 'End':
          e.preventDefault();
          this.goToSlide(this.totalSlides);
          break;
        case 'n':
        case 'N':
          this.toggleNotes();
          break;
        case 's':
        case 'S':
          this.toggleSimulator();
          break;
        case 'g':
        case 'G':
          this.toggleOverview();
          break;
        case 'f':
        case 'F':
          this.toggleFullscreen();
          break;
        case 'Escape':
          this.modalOverview.classList.remove('open');
          this.modalSimulator.classList.remove('open');
          this.notesPanel.classList.remove('open');
          break;
      }
    });

    // Close modals on backdrop click
    [this.modalOverview, this.modalSimulator].forEach(modal => {
      modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('open');
        }
      });
    });
  }

  setupTouchGestures() {
    let touchStartX = 0;
    let touchEndX = 0;

    const viewport = document.getElementById('viewport');
    if (!viewport) return;

    viewport.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    viewport.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
    }, { passive: true });
  }

  handleSwipe(startX, endX) {
    const threshold = 50;
    if (endX < startX - threshold) {
      this.nextSlide(); // Swipe left -> Next
    } else if (endX > startX + threshold) {
      this.prevSlide(); // Swipe right -> Prev
    }
  }
}

/* ==========================================================================
   Interactive Simulator Engine (Live Rules Demonstration for Afrânio Alex)
   ========================================================================== */

class SimulatorEngine {
  constructor() {
    this.initTabs();
    this.initScenarioDuplicidade();
    this.initScenarioFila();
    this.initScenarioCancelamento();
    this.initScenarioTicket();
  }

  initTabs() {
    const tabBtns = document.querySelectorAll('.sim-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const scenario = btn.dataset.scenario;
        document.querySelectorAll('.sim-scenario-pane').forEach(pane => {
          pane.classList.remove('active');
        });
        document.getElementById(`pane-${scenario}`)?.classList.add('active');
      });
    });
  }

  log(termId, text, type = 'info') {
    const term = document.getElementById(termId);
    if (!term) return;

    const time = new Date().toLocaleTimeString();
    const line = document.createElement('div');
    line.className = `line ${type}`;
    line.innerHTML = `<span style="color:#64748b;">[${time}]</span> ${text}`;
    term.appendChild(line);
    term.scrollTop = term.scrollHeight;
  }

  // 1. Conflito de Data no Mesmo Dia
  initScenarioDuplicidade() {
    const btnTry = document.getElementById('btnSimTryEnrollSameDay');
    const btnReset = document.getElementById('btnResetSameDay');

    btnTry?.addEventListener('click', () => {
      this.log('termOutputSameDay', 'POST /api/v1/registrations (Participant: Maria Silva, EventId: EVENT-B-FESTIVAL)', 'sys');
      this.log('termOutputSameDay', 'TRANSACTION BEGIN [ISOLATION LEVEL SERIALIZABLE]', 'acid');
      this.log('termOutputSameDay', 'SELECT FOR UPDATE * FROM participants WHERE id = \'maria-silva-uuid\' (Row locked)', 'sys');
      this.log('termOutputSameDay', 'Checking active events for participant on date: 2026-11-25...', 'info');
      
      setTimeout(() => {
        this.log('termOutputSameDay', 'MATCH FOUND: Participant already has active registration on \'Corrida da Emancipação\' on 2026-11-25!', 'warn');
        this.log('termOutputSameDay', 'INVARIANT VIOLATION: A participant cannot have multiple active registrations on the same calendar day.', 'error');
        this.log('termOutputSameDay', 'TRANSACTION ROLLBACK (No state altered, no capacity lost)', 'acid');
        this.log('termOutputSameDay', 'RESPOSTA HTTP 409 CONFLICT: "Você já está inscrito no evento Corrida da Emancipação no dia 25/11/2026. É permitida apenas 1 inscrição por dia no município."', 'error');
      }, 350);
    });

    btnReset?.addEventListener('click', () => {
      const term = document.getElementById('termOutputSameDay');
      if (term) {
        term.innerHTML = `
          <div class="line sys">[SISTEMA] Aguardando ação do usuário...</div>
          <div class="line info">[INFO] Maria Silva já possui inscrição ativa no Evento A para a data 25/11/2026.</div>
        `;
      }
    });
  }

  // 2. Capacidade & Fila de Espera Automática
  initScenarioFila() {
    this.capacity = 3;
    this.occupied = 3;
    this.waitlist = [
      { name: 'Carlos Eduardo', pos: 1 },
      { name: 'Juliana Medeiros', pos: 2 }
    ];

    const btnAdd = document.getElementById('btnSimAddWaitlist');
    const btnFree = document.getElementById('btnSimFreeSlot');

    btnAdd?.addEventListener('click', () => {
      const newNames = ['Rodrigo Barbosa', 'Larissa Lima', 'Fábio Antunes', 'Camila Rocha'];
      const randomName = newNames[Math.floor(Math.random() * newNames.length)];
      const nextPos = this.waitlist.length + 1;

      this.log('termOutputFila', `Inscrição solicitada por: ${randomName}`, 'sys');
      this.log('termOutputFila', 'TRANSACTION BEGIN: SELECT FOR UPDATE events WHERE id = \'event-123\'', 'acid');
      this.log('termOutputFila', `Capacidade atual: ${this.occupied}/${this.capacity} (ESGOTADO)`, 'warn');
      this.log('termOutputFila', `Redirecionando para Lista de Espera: Posição #${nextPos}`, 'info');

      this.waitlist.push({ name: randomName, pos: nextPos });
      this.renderWaitlistUI();
      this.log('termOutputFila', `INSERT INTO waitlist_entries (queue_pos: ${nextPos}, status: 'WAITING') COMMIT!`, 'success');
    });

    btnFree?.addEventListener('click', () => {
      if (this.waitlist.length === 0) {
        this.log('termOutputFila', 'Não há ninguém na lista de espera para convocar!', 'warn');
        return;
      }

      this.log('termOutputFila', 'TRANSACTION BEGIN: Cancelamento do Titular #01 recebido!', 'acid');
      this.log('termOutputFila', 'UPDATE registrations SET status = \'CANCELLED\' (Vaga 1 liberada)', 'info');

      // Promote first in queue
      const promoted = this.waitlist.shift();
      // Re-index remaining
      this.waitlist.forEach((item, idx) => item.pos = idx + 1);
      this.renderWaitlistUI();

      const newTicketHash = Math.random().toString(16).substring(2, 10) + '...f9';
      this.log('termOutputFila', `MOTOR DE FILA: Promovendo 1º da fila (${promoted.name}) imediatamente!`, 'success');
      this.log('termOutputFila', `UPDATE waitlist_entries SET status = 'OFFERED'`, 'sys');
      this.log('termOutputFila', `INSERT INTO tickets (token_hash: '${newTicketHash}', status: 'ISSUED')`, 'acid');
      this.log('termOutputFila', `Status do Participante ${promoted.name} -> PENDING_VALIDATION`, 'success');
      this.log('termOutputFila', `OUTBOX: Mensagem de convocação agendada para e-mail/notificação! COMMIT.`, 'success');
    });
  }

  renderWaitlistUI() {
    const list = document.getElementById('simWaitlistUI');
    if (!list) return;

    if (this.waitlist.length === 0) {
      list.innerHTML = '<li><em>Lista de espera vazia no momento.</em></li>';
      return;
    }

    list.innerHTML = this.waitlist.map(item => `
      <li><strong>${item.pos}º</strong> ${item.name} (Aguardando vaga)</li>
    `).join('');
  }

  // 3. Cancelamento Seguro com Senha
  initScenarioCancelamento() {
    const btnCancel = document.getElementById('btnSimSubmitCancel');
    const pwdInput = document.getElementById('simCancelPassword');
    const checkOpen = document.getElementById('simRegsOpenCheck');

    btnCancel?.addEventListener('click', () => {
      const pwd = pwdInput.value.trim();
      const isOpen = checkOpen.checked;

      this.log('termOutputCancel', 'Solicitação de cancelamento para inscrição #REG-88421 (Roberto Costa)', 'sys');

      if (!pwd) {
        this.log('termOutputCancel', 'ERRO: Senha não preenchida. O cancelamento exige autenticação rigorosa.', 'error');
        return;
      }

      if (pwd !== 'parnamirim123') {
        this.log('termOutputCancel', 'FALHA DE AUTENTICAÇÃO: Senha incorreta! Tentativa registrada no log de segurança.', 'error');
        return;
      }

      this.log('termOutputCancel', 'Senha conferida com sucesso via Argon2/Bcrypt hash!', 'success');
      this.log('termOutputCancel', 'TRANSACTION BEGIN: LOCK registration #REG-88421', 'acid');
      this.log('termOutputCancel', 'UPDATE registrations SET status = \'CANCELLED\', cancelled_at = NOW()', 'info');
      this.log('termOutputCancel', 'UPDATE tickets SET status = \'REVOKED\'', 'warn');

      if (isOpen) {
        this.log('termOutputCancel', 'REGRA: Inscrições ABERTAS! Vaga disponibilizada para reuso imediato pela fila.', 'success');
      } else {
        this.log('termOutputCancel', 'REGRA: Inscrições ENCERRADAS! Inscrição cancelada, porém a vaga NÃO será reaberta.', 'warn');
      }

      this.log('termOutputCancel', 'INSERT INTO audit_logs (actor: \'ROBERTO_COSTA\', action: \'CANCEL_REGISTRATION\') COMMIT!', 'acid');
      pwdInput.value = '';
    });
  }

  // 4. Ticket Único & Validação Balcão
  initScenarioTicket() {
    this.ticketStatus = 'ISSUED';
    const btnScan = document.getElementById('btnSimScanTicket');
    const btnRevert = document.getElementById('btnSimRevertTicket');
    const btnReset = document.getElementById('btnSimResetTicket');
    const badge = document.getElementById('simTicketStatusBadge');

    btnScan?.addEventListener('click', () => {
      this.log('termOutputTicket', 'Operador #OP-14 bipou QR Code no leitor ótico...', 'sys');
      this.log('termOutputTicket', 'TRANSACTION BEGIN: SELECT * FROM tickets WHERE token_hash = \'e3b0c442...89b1\' FOR UPDATE', 'acid');

      if (this.ticketStatus === 'USED') {
        this.log('termOutputTicket', 'ALERTA DE SEGURANÇA: Ticket JÁ FOI UTILIZADO anteriormente às 14:32 pelo Operador #OP-14!', 'error');
        this.log('termOutputTicket', 'Tentativa de reuso duplicado bloqueada pelo banco de dados!', 'error');
        this.log('termOutputTicket', 'AUDITORIA: Registrada tentativa indevida de reuso. ROLLBACK.', 'warn');
        return;
      }

      if (this.ticketStatus === 'REVOKED') {
        this.log('termOutputTicket', 'ERRO: Ticket consta como REVOGADO pela gestão municipal!', 'error');
        return;
      }

      // Valid use
      this.ticketStatus = 'USED';
      badge.textContent = 'USED (UTILIZADO)';
      badge.className = 'tp-status used';

      this.log('termOutputTicket', 'VALIDAÇÃO AUTORIZADA: Documentos e autorização de menor conferidos.', 'success');
      this.log('termOutputTicket', 'UPDATE tickets SET status = \'USED\', used_at = NOW()', 'info');
      this.log('termOutputTicket', 'UPDATE registrations SET status = \'CONFIRMED\' (Apto para o evento)', 'success');
      this.log('termOutputTicket', 'INSERT INTO audit_logs (operator: \'#OP-14\', action: \'KIT_DELIVERED\') COMMIT!', 'acid');
      this.log('termOutputTicket', 'Sucesso: Kit entregue a Ana Clara Souza e dependente Lucas Souza.', 'success');
    });

    btnRevert?.addEventListener('click', () => {
      const reason = prompt('Informe a justificativa obrigatória da reversão (Ex: Descumprimento de regulamento ou fraude cadastral):', 'Irregularidade constatada na documentação civil do dependente');
      if (!reason) {
        this.log('termOutputTicket', 'Operação cancelada: a reversão exige justificativa obrigatória.', 'warn');
        return;
      }

      this.ticketStatus = 'REVOKED';
      badge.textContent = 'REVOKED (REVOGADO)';
      badge.className = 'tp-status revoked';

      this.log('termOutputTicket', `AÇÃO DO GESTOR GCTI: Reversão acionada com justificativa: "${reason}"`, 'warn');
      this.log('termOutputTicket', 'UPDATE registrations SET status = \'REVOKED\'', 'acid');
      this.log('termOutputTicket', `INSERT INTO audit_logs (actor: 'GESTOR_GCTI', action: 'REVERSE_VALIDATION', reason: '${reason}') COMMIT!`, 'acid');
      this.log('termOutputTicket', 'Status alterado com sucesso e trilha de auditoria gravada irreversivelmente.', 'success');
    });

    btnReset?.addEventListener('click', () => {
      this.ticketStatus = 'ISSUED';
      badge.textContent = 'ISSUED (VÁLIDO)';
      badge.className = 'tp-status';
      const term = document.getElementById('termOutputTicket');
      if (term) {
        term.innerHTML = '<div class="line sys">[LEITOR] Aguardando leitura do QR Code do participante...</div>';
      }
    });
  }
}

// Global initialization
let presentation;
let simulator;

document.addEventListener('DOMContentLoaded', () => {
  presentation = new PresentationEngine();
  simulator = new SimulatorEngine();
});
