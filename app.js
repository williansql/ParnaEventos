/**
 * ParnaEventos — Sistema de Gestão Municipal de Eventos & Apresentação Executiva
 * Desenvolvido para o GCTI - Prefeitura Municipal de Parnamirim / Afrânio Alex
 */

class ParnaEventosApp {
  constructor() {
    this.currentMode = 'presentation'; // 'presentation' | 'prototype'
    this.currentSlide = 1;
    this.totalSlides = 12;

    // Database / System State (Simulação Transacional em Memória)
    this.events = [
      {
        id: 'ev-1',
        title: '15ª Corrida da Emancipação de Parnamirim',
        date: '2026-11-25',
        time: '07:00',
        category: 'esporte',
        capacity: 500,
        enrolled: 452,
        location: 'Cohabinal • Centro',
        minAge: 16,
        status: 'open',
        description: 'Percurso oficial de 5km pelas principais avenidas com kit atleta incluso.'
      },
      {
        id: 'ev-2',
        title: 'Festival Gastronômico Sabores de Parnamirim',
        date: '2026-11-25', // MESMA DATA PARA TESTE DE CONFLITO!
        time: '18:00',
        category: 'cultura',
        capacity: 300,
        enrolled: 290,
        location: 'Praça Paz de Deus, Centro',
        minAge: 0,
        status: 'open',
        description: 'Festival culinário tradicional com aulas-show e degustação municipal.'
      },
      {
        id: 'ev-3',
        title: 'ParnaTech 2026: Encontro de Inovação e Robótica',
        date: '2026-12-10',
        time: '09:00',
        category: 'tech',
        capacity: 800,
        enrolled: 620,
        location: 'Parque Aluízio Alves, Cohabinal',
        minAge: 10,
        status: 'open',
        description: 'Mostra científica municipal, oficinas de robótica e palestras do GCTI.'
      },
      {
        id: 'ev-4',
        title: 'Torneio Verão de Vôlei de Areia Pirangi',
        date: '2026-12-18',
        time: '08:00',
        category: 'esporte',
        capacity: 120,
        enrolled: 120,
        location: 'Praia de Pirangi do Norte',
        minAge: 14,
        status: 'waitlist',
        description: 'Competição esportiva de duplas na orla com arbitragem oficial.'
      }
    ];

    this.selectedEventForSignup = this.events[0];

    // Citizen registered tickets
    this.tickets = [
      {
        code: 'TKT-88421',
        tokenHash: 'e3b0c442...88421',
        eventId: 'ev-1',
        eventName: '15ª Corrida da Emancipação de Parnamirim',
        eventDate: '2026-11-25',
        eventLocation: 'Cohabinal • Centro',
        participantName: 'Maria Clara Silva',
        participantCpf: '045.892.124-78',
        participantBairro: 'Cohabinal',
        dependents: [{ name: 'Lucas Silva', age: 10, relationship: 'Filho' }],
        status: 'PENDING_VALIDATION', // 'PENDING_VALIDATION' | 'USED' | 'CANCELLED' | 'REVOKED'
        validatedAt: null,
        validatedBy: null,
        createdAt: '16/10/2026 09:15'
      }
    ];

    this.dependentsDraft = [];
    this.ticketToCancel = null;

    this.slideTitles = [
      "Visão Geral & Capa Executiva",
      "O Desafio Operacional Municipal",
      "As 3 Decisões Estratégicas Chave",
      "A Jornada do Munícipe (Visual)",
      "Regras de Negócio na Prática",
      "Ciclo de Vida da Inscrição (Visual)",
      "O Painel do Gestor Afrânio Alex",
      "O Balcão do Operador & Scanner",
      "Proteção de Dados & LGPD Municipal",
      "Desempenho: 10.000 Acessos Concorrentes",
      "Cronograma Simples de Execução",
      "Conclusão & Sistema em Ação"
    ];

    this.init();
  }

  init() {
    this.setupModeSwitching();
    this.setupPresentationNavigation();
    this.setupPrototypeTabs();
    this.renderPortalEvents();
    this.renderManagerTable();
    this.renderOperatorStation();
    this.renderMyTickets();
    this.setupFormsAndModals();
    this.updateManagerMetrics();
    this.updateSlideView();
  }

  // =========================================================================
  // MODE SWITCHING (APRESENTAÇÃO vs PROTÓTIPO FUNCIONAL)
  // =========================================================================
  setupModeSwitching() {
    const btnPres = document.getElementById('btnModePresentation');
    const btnProto = document.getElementById('btnModePrototype');
    const btnHero = document.getElementById('btnHeroGoToPrototype');
    const btnEnd = document.getElementById('btnLaunchPrototypeFromEnd');
    const btnReturn = document.getElementById('btnReturnToSlides');

    const setMode = (mode) => {
      this.currentMode = mode;
      const presView = document.getElementById('presentationView');
      const protoView = document.getElementById('prototypeView');
      const footer = document.getElementById('appFooter');
      const progressBar = document.getElementById('progressBar');

      if (mode === 'presentation') {
        presView?.classList.add('active-view');
        protoView?.classList.remove('active-view');
        footer?.style.setProperty('display', 'flex');
        progressBar?.style.setProperty('display', 'block');
        btnPres?.classList.add('active');
        btnProto?.classList.remove('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        presView?.classList.remove('active-view');
        protoView?.classList.add('active-view');
        footer?.style.setProperty('display', 'none');
        progressBar?.style.setProperty('display', 'none');
        btnPres?.classList.remove('active');
        btnProto?.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    btnPres?.addEventListener('click', () => setMode('presentation'));
    btnProto?.addEventListener('click', () => setMode('prototype'));
    btnHero?.addEventListener('click', () => setMode('prototype'));
    btnEnd?.addEventListener('click', () => setMode('prototype'));
    btnReturn?.addEventListener('click', () => setMode('presentation'));
  }

  switchToPrototype(tabName = 'landing') {
    this.currentMode = 'prototype';
    document.getElementById('presentationView')?.classList.remove('active-view');
    document.getElementById('prototypeView')?.classList.add('active-view');
    document.getElementById('appFooter')?.style.setProperty('display', 'none');
    document.getElementById('progressBar')?.style.setProperty('display', 'none');

    document.getElementById('btnModePresentation')?.classList.remove('active');
    document.getElementById('btnModePrototype')?.classList.add('active');

    // Activate specific tab
    this.switchPrototypeTab(tabName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // =========================================================================
  // PRESENTATION CONTROLLER
  // =========================================================================
  setupPresentationNavigation() {
    this.slides = document.querySelectorAll('.slide');

    document.getElementById('btnNext')?.addEventListener('click', () => this.nextSlide());
    document.getElementById('btnPrev')?.addEventListener('click', () => this.prevSlide());

    document.getElementById('btnNotes')?.addEventListener('click', () => this.toggleNotes());
    document.getElementById('btnCloseNotes')?.addEventListener('click', () => this.toggleNotes());

    document.getElementById('btnOverview')?.addEventListener('click', () => this.toggleOverview());
    document.getElementById('btnCloseOverview')?.addEventListener('click', () => this.toggleOverview());

    document.getElementById('btnFullscreen')?.addEventListener('click', () => this.toggleFullscreen());

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (this.currentMode === 'presentation') {
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
          case 'g':
          case 'G':
            this.toggleOverview();
            break;
          case 'f':
          case 'F':
            this.toggleFullscreen();
            break;
          case 'Escape':
            document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('open'));
            document.getElementById('notesPanel')?.classList.remove('open');
            break;
        }
      }
    });

    this.buildOverviewGrid();
    this.setupTouchGestures();
  }

  goToSlide(slideIndex) {
    if (slideIndex < 1 || slideIndex > this.totalSlides) return;
    this.slides.forEach((slide, idx) => {
      const num = idx + 1;
      slide.classList.remove('active');
      if (num === slideIndex) {
        slide.classList.add('active');
      }
    });
    this.currentSlide = slideIndex;
    this.updateSlideView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    const formattedCurrent = String(this.currentSlide).padStart(2, '0');
    const formattedTotal = String(this.totalSlides).padStart(2, '0');

    const ind = document.getElementById('slideIndicator');
    if (ind) ind.textContent = `${formattedCurrent} / ${formattedTotal}`;

    const bubble = document.getElementById('slideBubble');
    if (bubble) bubble.textContent = `${this.currentSlide} / ${this.totalSlides}`;

    const percent = (this.currentSlide / this.totalSlides) * 100;
    const bar = document.getElementById('progressBar');
    if (bar) bar.style.width = `${percent}%`;

    // Speaker notes
    const noteEl = document.querySelector(`.speaker-notes[data-for="${this.currentSlide}"]`);
    const notesContent = document.getElementById('notesContent');
    const notesSlideNumber = document.getElementById('notesSlideNumber');
    if (notesContent && noteEl) {
      notesContent.innerHTML = noteEl.innerHTML;
    }
    if (notesSlideNumber) {
      notesSlideNumber.textContent = this.currentSlide;
    }

    // Grid thumbs active highlight
    document.querySelectorAll('.slide-thumb-card').forEach((card, idx) => {
      if (idx + 1 === this.currentSlide) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  }

  toggleNotes() {
    document.getElementById('notesPanel')?.classList.toggle('open');
  }

  toggleOverview() {
    document.getElementById('modalOverview')?.classList.toggle('open');
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen?.();
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
        document.getElementById('modalOverview')?.classList.remove('open');
      });
      grid.appendChild(card);
    });
  }

  setupTouchGestures() {
    let startX = 0;
    window.addEventListener('touchstart', (e) => {
      startX = e.changedTouches[0].screenX;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      if (this.currentMode !== 'presentation') return;
      const endX = e.changedTouches[0].screenX;
      if (endX < startX - 60) this.nextSlide();
      else if (endX > startX + 60) this.prevSlide();
    }, { passive: true });
  }

  // =========================================================================
  // PROTOTYPE TABS & EVENT HANDLING
  // =========================================================================
  setupPrototypeTabs() {
    const tabBtns = document.querySelectorAll('.proto-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        this.switchPrototypeTab(tab);
      });
    });
  }

  switchPrototypeTab(tabName) {
    document.querySelectorAll('.proto-tab-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tabName);
    });

    document.querySelectorAll('.proto-tab-pane').forEach(p => {
      p.classList.remove('active');
    });

    const targetPane = document.getElementById(`pane-${tabName}`);
    if (targetPane) {
      targetPane.classList.add('active');
    }
  }

  // =========================================================================
  // TAB 1: RENDER PORTAL EVENTS (LANDING PAGE)
  // =========================================================================
  renderPortalEvents() {
    const grid = document.getElementById('eventsGridPortal');
    const countBadge = document.getElementById('eventsCountBadge');
    if (!grid) return;

    grid.innerHTML = '';
    if (countBadge) {
      countBadge.textContent = `${this.events.length} Eventos Disponíveis`;
    }

    const emojis = {
      esporte: '🏃‍♂️',
      cultura: '🍲',
      tech: '🤖',
      'meio-ambiente': '🌳'
    };

    this.events.forEach(ev => {
      const remaining = Math.max(0, ev.capacity - ev.enrolled);
      const percent = Math.min(100, Math.round((ev.enrolled / ev.capacity) * 100));
      
      let statusClass = 'open';
      let statusLabel = 'Inscrições Abertas';

      if (remaining === 0) {
        statusClass = 'waitlist';
        statusLabel = 'Lista de Espera';
      }

      const card = document.createElement('div');
      card.className = 'event-card';
      card.innerHTML = `
        <div class="ec-banner-placeholder ${ev.category}">
          <span>${emojis[ev.category] || '🎯'}</span>
          <span class="ec-status-tag ${statusClass}">${statusLabel}</span>
        </div>
        <div class="ec-body">
          <span class="ec-category-tag">${ev.category.toUpperCase()} • PARNAMIRIM</span>
          <h3>${ev.title}</h3>
          
          <div class="ec-info-list">
            <div class="ec-info-item">
              <span>📅 Data: <strong>${this.formatDate(ev.date)} • ${ev.time}</strong></span>
            </div>
            <div class="ec-info-item">
              <span>📍 Local: <strong>${ev.location}</strong></span>
            </div>
            <div class="ec-info-item">
              <span>👶 Idade Mínima: <strong>${ev.minAge > 0 ? ev.minAge + ' anos' : 'Livre'}</strong></span>
            </div>
          </div>

          <div class="ec-capacity-gauge">
            <div class="ec-gauge-header">
              <span>Ocupação das Vagas:</span>
              <strong>${ev.enrolled} / ${ev.capacity} (${percent}%)</strong>
            </div>
            <div class="ec-gauge-track">
              <div class="ec-gauge-fill ${percent > 90 ? 'warning' : ''}" style="width: ${percent}%;"></div>
            </div>
          </div>

          <div class="ec-footer">
            <button class="btn-card-enroll" data-event-id="${ev.id}">
              ${remaining > 0 ? 'Fazer Minha Inscrição &rarr;' : 'Entrar na Lista de Espera &rarr;'}
            </button>
          </div>
        </div>
      `;

      card.querySelector('.btn-card-enroll')?.addEventListener('click', () => {
        this.selectEventForSignup(ev.id);
      });

      grid.appendChild(card);
    });

    // Search and filter interactions
    const searchInput = document.getElementById('portalSearchInput');
    searchInput?.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      document.querySelectorAll('.event-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(term) ? 'flex' : 'none';
      });
    });

    document.querySelectorAll('.filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const filter = pill.dataset.filter;

        document.querySelectorAll('.event-card').forEach(card => {
          if (filter === 'all') {
            card.style.display = 'flex';
          } else {
            const hasCat = card.querySelector(`.${filter}`);
            card.style.display = hasCat ? 'flex' : 'none';
          }
        });
      });
    });
  }

  selectEventForSignup(eventId) {
    const ev = this.events.find(e => e.id === eventId);
    if (!ev) return;

    this.selectedEventForSignup = ev;
    
    // Update labels in Signup pane
    const titleEl = document.getElementById('signupFormEventTitle');
    const sesName = document.getElementById('sesEventName');
    const sesDate = document.getElementById('sesEventDate');
    const sesVagas = document.getElementById('sesEventVagas');

    if (titleEl) titleEl.textContent = `Inscrição: ${ev.title}`;
    if (sesName) sesName.textContent = ev.title;
    if (sesDate) sesDate.textContent = `📅 ${this.formatDate(ev.date)} • ${ev.time}`;
    if (sesVagas) {
      const rem = Math.max(0, ev.capacity - ev.enrolled);
      sesVagas.textContent = rem > 0 ? `${rem} vagas restantes` : 'Lista de Espera Ativa';
    }

    // Switch to tab 2
    this.switchPrototypeTab('signup');
    this.checkDateConflict();
  }

  // =========================================================================
  // TAB 2: SIGNUP FORM & DEPENDENTS
  // =========================================================================
  setupFormsAndModals() {
    // Add Dependent Button
    const btnAddDep = document.getElementById('btnAddDependent');
    btnAddDep?.addEventListener('click', () => {
      this.addDependentRow();
    });

    // Citizen Form Submit
    const formCitizen = document.getElementById('formCitizenEnroll');
    formCitizen?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleCitizenEnrollment();
    });

    // Test Scan from Live Preview
    const btnTestScan = document.getElementById('btnTestScanThisTicket');
    btnTestScan?.addEventListener('click', () => {
      this.switchPrototypeTab('operator');
      const latestTicket = this.tickets[0];
      if (latestTicket) {
        this.inspectTicketForOperator(latestTicket.code);
      }
    });

    // Manager: Toggle New Event Panel
    const btnToggle = document.getElementById('btnToggleNewEventForm');
    const btnClose = document.getElementById('btnCloseNewEventForm');
    const btnCancel = document.getElementById('btnCancelCreateEvent');
    const panel = document.getElementById('newEventFormPanel');

    const togglePanel = () => {
      if (panel) {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
      }
    };

    btnToggle?.addEventListener('click', togglePanel);
    btnClose?.addEventListener('click', togglePanel);
    btnCancel?.addEventListener('click', togglePanel);

    // Manager: Create Event Submit
    const formCreate = document.getElementById('formCreateEvent');
    formCreate?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleCreateEvent();
    });

    // Operator: Search ticket
    document.getElementById('btnOpSearchTicket')?.addEventListener('click', () => {
      const code = document.getElementById('opInputTicketCode')?.value.trim();
      if (code) this.inspectTicketForOperator(code);
    });

    // Operator: Confirm Kit Delivery
    document.getElementById('btnOpConfirmKit')?.addEventListener('click', () => {
      this.confirmKitDelivery();
    });

    // Operator: Revert Validation
    document.getElementById('btnOpRevertValidation')?.addEventListener('click', () => {
      this.revertTicketValidation();
    });

    // Reset Fraud Alert
    document.getElementById('btnResetFraudView')?.addEventListener('click', () => {
      document.getElementById('orpFraudAlert')?.style.setProperty('display', 'none');
    });

    // Modal: Cancel Ticket Handlers
    document.getElementById('btnCloseCancelModal')?.addEventListener('click', () => {
      document.getElementById('modalCancelTicket')?.classList.remove('open');
    });
    document.getElementById('btnDismissCancelModal')?.addEventListener('click', () => {
      document.getElementById('modalCancelTicket')?.classList.remove('open');
    });
    document.getElementById('btnConfirmCancelRegistration')?.addEventListener('click', () => {
      this.executeTicketCancellation();
    });

    // Modal: Broadcast Handlers
    document.getElementById('btnCloseBroadcastModal')?.addEventListener('click', () => {
      document.getElementById('modalManagerBroadcast')?.classList.remove('open');
    });
    document.getElementById('btnSendBroadcast')?.addEventListener('click', () => {
      this.showToast('✓ Comunicado oficial transmitido aos cidadãos inscritos!', 'success');
      document.getElementById('modalManagerBroadcast')?.classList.remove('open');
    });
  }

  addDependentRow() {
    const container = document.getElementById('dependentsContainer');
    if (!container) return;

    const depId = Date.now();
    const row = document.createElement('div');
    row.className = 'dependent-item-row';
    row.dataset.depId = depId;
    row.innerHTML = `
      <input type="text" class="form-control dep-name" placeholder="Nome Completo do Menor" required>
      <input type="date" class="form-control dep-birth" value="2016-05-14" required>
      <select class="form-control dep-rel">
        <option value="Filho(a)" selected>Filho(a)</option>
        <option value="Tutelado(a)">Tutelado(a)</option>
        <option value="Irmão(ã) Menor">Irmão(ã) Menor</option>
      </select>
      <button type="button" class="btn-remove-dep" title="Remover Menor">&times;</button>
    `;

    row.querySelector('.btn-remove-dep')?.addEventListener('click', () => {
      row.remove();
      this.updateLiveTicketPreview();
    });

    row.querySelectorAll('input, select').forEach(el => {
      el.addEventListener('input', () => this.updateLiveTicketPreview());
    });

    container.appendChild(row);
    this.updateLiveTicketPreview();
    this.showToast('Dependente menor adicionado. Reserva +1 vaga.', 'info');
  }

  checkDateConflict() {
    const alertBox = document.getElementById('conflictAlertBox');
    const alertText = document.getElementById('conflictAlertText');
    const submitBtn = document.getElementById('btnSubmitEnrollment');

    if (!alertBox || !alertText || !submitBtn) return false;

    // Check if Maria Clara Silva already has an active ticket for this same date!
    const activeConflict = this.tickets.find(t => 
      t.eventDate === this.selectedEventForSignup.date &&
      t.eventId !== this.selectedEventForSignup.id &&
      t.status !== 'CANCELLED'
    );

    if (activeConflict) {
      alertBox.style.display = 'flex';
      alertText.innerHTML = `
        Você já possui inscrição ativa na <strong>${activeConflict.eventName}</strong> na mesma data (<strong>${this.formatDate(activeConflict.eventDate)}</strong>).<br>
        A legislação de Parnamirim veda 2 inscrições no mesmo dia para democratizar o acesso às vagas municipais.
      `;
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.5';
      return true;
    } else {
      alertBox.style.display = 'none';
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      return false;
    }
  }

  handleCitizenEnrollment() {
    // Re-check conflict
    if (this.checkDateConflict()) {
      this.showToast('Inscrição recusada: Conflito de data no mesmo dia!', 'error');
      return;
    }

    const name = document.getElementById('citizenFullName')?.value.trim() || 'Maria Clara Silva';
    const cpf = document.getElementById('citizenCpf')?.value.trim() || '045.892.124-78';
    const phone = document.getElementById('citizenPhone')?.value.trim();
    const bairro = document.getElementById('citizenNeighborhood')?.value || 'Cohabinal';

    // Collect dependents
    const depRows = document.querySelectorAll('.dependent-item-row');
    const deps = [];
    depRows.forEach(row => {
      const depName = row.querySelector('.dep-name')?.value.trim();
      const depBirth = row.querySelector('.dep-birth')?.value;
      const depRel = row.querySelector('.dep-rel')?.value;
      if (depName) {
        deps.push({ name: depName, birth: depBirth, relationship: depRel });
      }
    });

    const totalVagasOccupied = 1 + deps.length;
    const newCode = 'TKT-' + Math.floor(10000 + Math.random() * 90000);
    const newTokenHash = Math.random().toString(16).substring(2, 10) + '...' + newCode.substring(4);

    const newTicket = {
      code: newCode,
      tokenHash: newTokenHash,
      eventId: this.selectedEventForSignup.id,
      eventName: this.selectedEventForSignup.title,
      eventDate: this.selectedEventForSignup.date,
      eventLocation: this.selectedEventForSignup.location,
      participantName: name,
      participantCpf: cpf,
      participantBairro: bairro,
      dependents: deps,
      status: 'PENDING_VALIDATION',
      validatedAt: null,
      validatedBy: null,
      createdAt: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR')
    };

    // Update capacity
    this.selectedEventForSignup.enrolled = Math.min(
      this.selectedEventForSignup.capacity,
      this.selectedEventForSignup.enrolled + totalVagasOccupied
    );

    // Save ticket
    this.tickets.unshift(newTicket);

    // Update Live Ticket Box
    this.updateLiveTicketPreview(newTicket);
    this.renderPortalEvents();
    this.renderManagerTable();
    this.renderOperatorStation();
    this.renderMyTickets();
    this.updateManagerMetrics();

    this.showToast(`✓ Inscrição confirmada com sucesso! ${totalVagasOccupied} vaga(s) garantida(s).`, 'success');
  }

  updateLiveTicketPreview(ticketData = null) {
    const t = ticketData || this.tickets[0];
    if (!t) return;

    const elEvent = document.getElementById('ltEventName');
    const elDate = document.getElementById('ltDate');
    const elLocal = document.getElementById('ltLocal');
    const elPart = document.getElementById('ltParticipant');
    const elDep = document.getElementById('ltDependentsText');
    const elHash = document.getElementById('ltTokenHash');
    const elBadge = document.getElementById('ltStatusBadge');

    if (elEvent) elEvent.textContent = t.eventName;
    if (elDate) elDate.textContent = this.formatDate(t.eventDate);
    if (elLocal) elLocal.textContent = t.eventLocation;
    if (elPart) elPart.textContent = t.participantName;
    if (elHash) elHash.textContent = t.tokenHash;

    if (elDep) {
      if (t.dependents && t.dependents.length > 0) {
        elDep.textContent = `+ ${t.dependents.length} Dependente(s) Menor(es): ${t.dependents.map(d => d.name).join(', ')}`;
      } else {
        elDep.textContent = 'Sem dependentes vinculados';
      }
    }

    if (elBadge) {
      if (t.status === 'PENDING_VALIDATION') {
        elBadge.textContent = 'RESERVADO (PENDENTE)';
        elBadge.className = 'lt-status-badge badge-pending';
      } else if (t.status === 'USED') {
        elBadge.textContent = 'CONFIRMADO (UTILIZADO)';
        elBadge.className = 'lt-status-badge badge-confirmed';
      } else if (t.status === 'CANCELLED') {
        elBadge.textContent = 'CANCELADO';
        elBadge.className = 'lt-status-badge badge-used';
      }
    }
  }

  // =========================================================================
  // TAB 3: MANAGER DASHBOARD (AFRÂNIO ALEX / GCTI)
  // =========================================================================
  handleCreateEvent() {
    const title = document.getElementById('evTitle')?.value.trim();
    const cat = document.getElementById('evCategory')?.value || 'esporte';
    const date = document.getElementById('evDate')?.value || '2026-12-20';
    const time = document.getElementById('evTime')?.value || '07:30';
    const capacity = parseInt(document.getElementById('evCapacity')?.value) || 200;
    const location = document.getElementById('evLocation')?.value || 'Cohabinal';
    const minAge = parseInt(document.getElementById('evMinAge')?.value) || 0;
    const desc = document.getElementById('evDescription')?.value || '';

    if (!title) return;

    const newEvent = {
      id: 'ev-' + Date.now(),
      title,
      date,
      time,
      category: cat,
      capacity,
      enrolled: 0,
      location,
      minAge,
      status: 'open',
      description: desc
    };

    this.events.unshift(newEvent);

    document.getElementById('newEventFormPanel')?.style.setProperty('display', 'none');
    document.getElementById('formCreateEvent')?.reset();

    this.renderPortalEvents();
    this.renderManagerTable();
    this.updateManagerMetrics();

    this.showToast(`✓ Evento "${title}" publicado no Portal do Cidadão!`, 'success');
  }

  renderManagerTable() {
    const tbody = document.getElementById('managerEventsTbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    this.events.forEach(ev => {
      const tr = document.createElement('tr');
      const percent = Math.round((ev.enrolled / ev.capacity) * 100);

      tr.innerHTML = `
        <td><strong>${ev.title}</strong><br><small class="text-muted">${ev.category.toUpperCase()}</small></td>
        <td>${this.formatDate(ev.date)} • ${ev.time}</td>
        <td>${ev.location}</td>
        <td><strong>${ev.enrolled} / ${ev.capacity}</strong> (${percent}%)</td>
        <td><span class="badge-tag-open">${ev.status === 'open' ? 'Ativo' : 'Lotado'}</span></td>
        <td>
          <div class="table-action-btns">
            <button class="btn-table-action btn-mg-capacity" data-id="${ev.id}">Alterar Vagas</button>
            <button class="btn-table-action btn-mg-broadcast" data-id="${ev.id}">Comunicado</button>
            <button class="btn-table-action danger btn-mg-cancel" data-id="${ev.id}">Cancelar</button>
          </div>
        </td>
      `;

      tr.querySelector('.btn-mg-capacity')?.addEventListener('click', () => {
        const newCap = prompt(`Informe a nova capacidade para "${ev.title}":`, ev.capacity);
        if (newCap && !isNaN(newCap) && parseInt(newCap) >= ev.enrolled) {
          ev.capacity = parseInt(newCap);
          this.renderPortalEvents();
          this.renderManagerTable();
          this.updateManagerMetrics();
          this.showToast(`Capacidade de "${ev.title}" atualizada para ${newCap} vagas!`, 'info');
        } else if (newCap) {
          alert('A nova capacidade não pode ser menor que as vagas já preenchidas.');
        }
      });

      tr.querySelector('.btn-mg-broadcast')?.addEventListener('click', () => {
        const inp = document.getElementById('broadcastEventName');
        if (inp) inp.value = ev.title;
        document.getElementById('modalManagerBroadcast')?.classList.add('open');
      });

      tr.querySelector('.btn-mg-cancel')?.addEventListener('click', () => {
        const reason = prompt('Informe a justificativa oficial do cancelamento (Ex: Força maior, chuvas):', 'Aviso meteorológico de chuvas intensas');
        if (reason) {
          ev.status = 'closed';
          this.renderPortalEvents();
          this.renderManagerTable();
          this.showToast(`Evento cancelado e comunicado enviado aos inscritos!`, 'error');
        }
      });

      tbody.appendChild(tr);
    });
  }

  updateManagerMetrics() {
    const elEvents = document.getElementById('metricTotalEvents');
    const elSlots = document.getElementById('metricTotalSlots');
    const elEnrolled = document.getElementById('metricTotalEnrolled');
    const elValidated = document.getElementById('metricKitsValidated');

    const totalSlots = this.events.reduce((acc, e) => acc + e.capacity, 0);
    const totalEnrolled = this.events.reduce((acc, e) => acc + e.enrolled, 0);
    const validated = this.tickets.filter(t => t.status === 'USED').length + 1120;

    if (elEvents) elEvents.textContent = this.events.length;
    if (elSlots) elSlots.textContent = totalSlots.toLocaleString('pt-BR');
    if (elEnrolled) elEnrolled.textContent = totalEnrolled.toLocaleString('pt-BR');
    if (elValidated) elValidated.textContent = validated.toLocaleString('pt-BR');
  }

  // =========================================================================
  // TAB 4: OPERATOR STATION (ENTREGA DE KITS)
  // =========================================================================
  renderOperatorStation() {
    const list = document.getElementById('quickTokensList');
    if (!list) return;

    list.innerHTML = '';
    this.tickets.slice(0, 4).forEach(t => {
      const btn = document.createElement('button');
      btn.className = 'btn-quick-token';
      btn.textContent = `${t.code} (${t.status === 'USED' ? 'Usado' : 'Válido'})`;
      btn.addEventListener('click', () => {
        this.inspectTicketForOperator(t.code);
      });
      list.appendChild(btn);
    });
  }

  inspectTicketForOperator(code) {
    const ticket = this.tickets.find(t => t.code.toUpperCase() === code.toUpperCase());
    const orpCard = document.getElementById('orpCard');
    const fraudAlert = document.getElementById('orpFraudAlert');

    if (!ticket) {
      this.showToast(`Ticket "${code}" não encontrado no banco de dados!`, 'error');
      return;
    }

    if (fraudAlert) fraudAlert.style.display = 'none';

    // Populate inspector
    document.getElementById('orpTicketNumber').textContent = '#' + ticket.code;
    document.getElementById('orpEventTitle').textContent = ticket.eventName;
    document.getElementById('orpEventDateBadge').textContent = `📅 ${this.formatDate(ticket.eventDate)} • ${ticket.eventLocation}`;
    document.getElementById('orpParticipantName').textContent = ticket.participantName;
    document.getElementById('orpParticipantCpf').textContent = ticket.participantCpf;
    document.getElementById('orpParticipantBairro').textContent = `${ticket.participantBairro} (Parnamirim)`;

    const depAlert = document.getElementById('orpDependentAlert');
    const depName = document.getElementById('orpDependentName');
    const termWrap = document.getElementById('opCheckTermWrapper');

    if (ticket.dependents && ticket.dependents.length > 0) {
      if (depAlert) depAlert.style.display = 'flex';
      if (termWrap) termWrap.style.display = 'flex';
      if (depName) depName.textContent = ticket.dependents.map(d => `${d.name} (${d.age || 10} anos - ${d.relationship})`).join(', ');
    } else {
      if (depAlert) depAlert.style.display = 'none';
      if (termWrap) termWrap.style.display = 'none';
    }

    const badge = document.getElementById('orpStatusBadge');
    if (ticket.status === 'USED') {
      badge.textContent = 'JÁ UTILIZADO (ENTREGUE)';
      badge.className = 'orp-badge-status used';
    } else if (ticket.status === 'REVOKED') {
      badge.textContent = 'VALIVAÇÃO REVOGADA';
      badge.className = 'orp-badge-status used';
    } else {
      badge.textContent = 'VÁLIDO (AGUARDANDO ENTREGA)';
      badge.className = 'orp-badge-status valid';
    }

    this.currentInspectedTicket = ticket;
  }

  confirmKitDelivery() {
    const t = this.currentInspectedTicket || this.tickets[0];
    if (!t) return;

    if (t.status === 'USED') {
      // TRIGGER FRAUD ALERT (RED SCREEN)
      const fraudAlert = document.getElementById('orpFraudAlert');
      const fraudDetails = document.getElementById('orpFraudDetails');
      if (fraudAlert && fraudDetails) {
        fraudDetails.innerHTML = `
          O bilhete <strong>#${t.code}</strong> já foi validado anteriormente hoje às <strong>${t.validatedAt || '14:32'}</strong> pelo Operador João no Balcão 01.<br>
          Tentativa duplicada bloqueada pelo banco de dados com registro de auditoria!
        `;
        fraudAlert.style.display = 'flex';
      }
      this.showToast('🚨 ALERTA: Ticket já utilizado anteriormente!', 'error');
      return;
    }

    if (t.status === 'REVOKED') {
      this.showToast('Ticket consta como REVOGADO pela administração municipal!', 'error');
      return;
    }

    // Success validation
    t.status = 'USED';
    t.validatedAt = new Date().toLocaleTimeString('pt-BR');
    t.validatedBy = 'Operador #OP-01 (Parnamirim)';

    this.inspectTicketForOperator(t.code);
    this.renderOperatorStation();
    this.renderMyTickets();
    this.updateLiveTicketPreview(t);
    this.updateManagerMetrics();

    this.showToast(`✓ Kit entregue com sucesso a ${t.participantName}! Ticket marcado como UTILIZADO.`, 'success');
  }

  revertTicketValidation() {
    const t = this.currentInspectedTicket || this.tickets[0];
    if (!t) return;

    const reason = prompt('Informe a justificativa obrigatória da reversão (Ação do Gestor Afrânio):', 'Constatada inconformidade na documentação comprobatória');
    if (!reason) return;

    t.status = 'REVOKED';
    this.inspectTicketForOperator(t.code);
    this.renderOperatorStation();
    this.renderMyTickets();

    this.showToast(`Validação revertida com sucesso pelo Gestor: "${reason}"`, 'info');
  }

  // =========================================================================
  // TAB 5: MY TICKETS (VISÃO DO MUNÍCIPE & CANCELAMENTO COM SENHA)
  // =========================================================================
  renderMyTickets() {
    const list = document.getElementById('myTicketsList');
    if (!list) return;

    list.innerHTML = '';

    this.tickets.forEach(t => {
      const card = document.createElement('div');
      card.className = `citizen-ticket-item status-${t.status.toLowerCase()}`;

      let statusBadge = '<span class="status-pill-badge yellow">Aguardando Retirada de Kit</span>';
      if (t.status === 'USED') {
        statusBadge = '<span class="status-pill-badge green">Kit Entregue • Confirmado</span>';
      } else if (t.status === 'CANCELLED') {
        statusBadge = '<span class="status-pill-badge red">Inscrição Cancelada</span>';
      } else if (t.status === 'REVOKED') {
        statusBadge = '<span class="status-pill-badge purple">Validação Revogada</span>';
      }

      card.innerHTML = `
        <div class="cti-top">
          <small class="text-muted">Código: <strong>#${t.code}</strong></small>
          ${statusBadge}
        </div>
        <h4 class="cti-event-title">${t.eventName}</h4>
        <div class="cti-meta-info">
          <span>📅 Data: <strong>${this.formatDate(t.eventDate)}</strong></span>
          <span>📍 Local: <strong>${t.eventLocation}</strong></span>
          <span>Titular: <strong>${t.participantName}</strong> (${t.participantBairro})</span>
        </div>
        <div class="cti-dependents">
          ${t.dependents && t.dependents.length > 0 ? '👶 Dependentes: ' + t.dependents.map(d => d.name).join(', ') : 'Inscrição individual'}
        </div>
        <div class="cti-actions">
          <small class="text-muted">${t.createdAt}</small>
          ${t.status === 'PENDING_VALIDATION' ? `
            <button class="btn-cancel-ticket" data-code="${t.code}">Cancelar Inscrição</button>
          ` : ''}
        </div>
      `;

      card.querySelector('.btn-cancel-ticket')?.addEventListener('click', () => {
        this.openCancelModal(t);
      });

      list.appendChild(card);
    });
  }

  openCancelModal(ticket) {
    this.ticketToCancel = ticket;
    const title = document.getElementById('cancelEventNameTitle');
    const label = document.getElementById('cancelTicketCodeLabel');
    const inputPwd = document.getElementById('inputCancelPassword');

    if (title) title.textContent = ticket.eventName;
    if (label) label.textContent = `Ticket: #${ticket.code} • ${ticket.participantName}`;
    if (inputPwd) inputPwd.value = '';

    document.getElementById('modalCancelTicket')?.classList.add('open');
  }

  executeTicketCancellation() {
    const pwdInput = document.getElementById('inputCancelPassword');
    const pwd = pwdInput?.value.trim();

    if (!pwd) {
      alert('Por favor, digite sua senha de munícipe.');
      return;
    }

    if (pwd !== 'parnamirim123') {
      alert('Senha incorreta! Teste com: parnamirim123');
      return;
    }

    if (!this.ticketToCancel) return;

    this.ticketToCancel.status = 'CANCELLED';

    // Free event slot
    const ev = this.events.find(e => e.id === this.ticketToCancel.eventId);
    if (ev) {
      const freed = 1 + (this.ticketToCancel.dependents ? this.ticketToCancel.dependents.length : 0);
      ev.enrolled = Math.max(0, ev.enrolled - freed);
    }

    document.getElementById('modalCancelTicket')?.classList.remove('open');

    this.renderPortalEvents();
    this.renderManagerTable();
    this.renderOperatorStation();
    this.renderMyTickets();
    this.updateManagerMetrics();

    this.showToast('✓ Inscrição cancelada com sucesso! Vaga liberada na hora para a lista de espera.', 'success');
  }

  // =========================================================================
  // HELPER UTILITIES
  // =========================================================================
  formatDate(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
      success: '✓',
      error: '⚠️',
      info: 'ℹ️'
    };

    toast.innerHTML = `
      <span style="font-weight: 800; font-size: 1rem;">${icons[type] || '•'}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
}

// Global initialization
let app;
let presentation;

document.addEventListener('DOMContentLoaded', () => {
  app = new ParnaEventosApp();
  presentation = app; // Aliased for inline onclick handlers in slides
});
