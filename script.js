"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const frame = document.getElementById("simulatorFrame");
  const loading = document.getElementById("frameLoading");
  const fallback = document.getElementById("frameFallback");
  const resultsPanel = document.getElementById("resultsPanel");
  const toggleResultsButton = document.getElementById("toggleResultsButton");
  const closeResultsButton = document.getElementById("closeResultsButton");
  const reloadButton = document.getElementById("reloadButton");
  const openDirectButton = document.getElementById("openDirectButton");
  const helpButton = document.getElementById("helpButton");
  const helpDialog = document.getElementById("helpDialog");
  const workspaceTitle = document.getElementById("workspaceTitle");
  const workspaceSubtitle = document.getElementById("workspaceSubtitle");
  const activityNote = document.getElementById("activityNote");

  const simulatorUrl = "https://www.falstad.com/circuit/circuitjs.html?whiteBackground=true";

  document.getElementById("year").textContent = new Date().getFullYear();

  let loadingTimer;
  function startLoadingState() {
    loading.classList.remove("loaded");
    fallback.hidden = true;
    clearTimeout(loadingTimer);
    loadingTimer = setTimeout(() => {
      // A cross-origin iframe does not expose its internal load state reliably.
      // This is only a fallback prompt, not a definitive network diagnosis.
      if (!loading.classList.contains("loaded")) fallback.hidden = false;
    }, 12000);
  }

  frame.addEventListener("load", () => {
    clearTimeout(loadingTimer);
    loading.classList.add("loaded");
    fallback.hidden = true;
  });

  // The hosted simulator is cross-origin. We can embed/open/reload it, but cannot
  // read its internal results or control its editor from this page without a
  // supported integration interface or a locally built version.
  startLoadingState();

  function reloadSimulator() {
    startLoadingState();
    frame.src = simulatorUrl + "&reload=" + Date.now();
  }

  reloadButton.addEventListener("click", reloadSimulator);

  openDirectButton.addEventListener("click", () => {
    window.open(simulatorUrl, "_blank", "noopener,noreferrer");
  });

  function setResultsVisible(visible) {
    body.classList.toggle("results-hidden", !visible);
    toggleResultsButton.setAttribute("aria-expanded", String(visible));
    toggleResultsButton.innerHTML = visible
      ? 'Ocultar painel de apoio <span aria-hidden="true">⌄</span>'
      : 'Mostrar painel de apoio <span aria-hidden="true">⌃</span>';
  }

  toggleResultsButton.addEventListener("click", () => {
    setResultsVisible(body.classList.contains("results-hidden"));
  });

  closeResultsButton.addEventListener("click", () => setResultsVisible(false));

  helpButton.addEventListener("click", () => {
    if (typeof helpDialog.showModal === "function") helpDialog.showModal();
    else window.alert("Use os menus do simulador para inserir componentes, conectá-los e executar a simulação.");
  });


  const componentInfo = {
    resistor: { title: "Resistor", text: "Limita a corrente e provoca queda de tensão. O valor é informado em ohms (Ω), como 220 Ω ou 1 kΩ." },
    led: { title: "LED", text: "É um diodo que emite luz quando ligado no sentido correto. Em circuitos simples, use um resistor em série para limitar a corrente." },
    diodo: { title: "Diodo", text: "Permite a passagem de corrente principalmente em um sentido. Observe a orientação do símbolo e a polaridade do componente." },
    transistor: { title: "Transistor", text: "Pode funcionar como chave eletrônica ou amplificador. Modelos comuns possuem três terminais: base, coletor e emissor (NPN), ou equivalentes no PNP." },
    capacitor: { title: "Capacitor", text: "Armazena energia em um campo elétrico. A capacitância é medida em farads (F), geralmente microfarads (µF) em circuitos didáticos." },
    fonte: { title: "Fonte de tensão contínua (CC)", text: "Fornece uma tensão definida, como 5 V ou 9 V. Confira a polaridade e os valores antes de conectar os componentes." },
    interruptor: { title: "Interruptor", text: "Abre ou fecha o caminho elétrico. Aberto interrompe a corrente; fechado permite a passagem quando o circuito está completo." },
    fio: { title: "Fio de ligação", text: "Conecta os terminais e forma o caminho elétrico. No simulador, os terminais precisam estar conectados de verdade, não apenas próximos." }
  };

  document.querySelectorAll("[data-component]").forEach((button) => {
    button.addEventListener("click", () => {
      const info = componentInfo[button.dataset.component];
      if (!info) return;
      document.querySelectorAll("[data-component]").forEach((item) => {
        const selected = item === button;
        item.classList.toggle("selected", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      document.getElementById("componentDetailTitle").textContent = info.title;
      document.getElementById("componentDetailText").textContent = info.text;
    });
  });

  const activities = {
    livre: {
      title: "Área de simulação",
      subtitle: "Monte o circuito diretamente no motor de simulação.",
      note: "O simulador abre em modo de montagem livre. Use os menus dele para inserir e conectar componentes."
    },
    resistor: {
      title: "Atividade: Lei de Ohm",
      subtitle: "Monte uma fonte CC e um resistor para observar a corrente.",
      note: "Roteiro sugerido: monte uma fonte de 5 V, conecte um resistor de 1 kΩ e feche o circuito. A corrente ideal esperada é aproximadamente 5 mA."
    },
    led: {
      title: "Atividade: LED com resistor",
      subtitle: "Monte um circuito simples com LED e resistor limitador.",
      note: "Use uma fonte CC, um resistor em série e um LED polarizado corretamente. Escolha os valores e confira a corrente simulada. Não conecte o LED diretamente a uma fonte ideal sem limitação."
    },
    capacitor: {
      title: "Atividade: capacitor",
      subtitle: "Observe a resposta transitória de um circuito RC.",
      note: "Monte uma fonte, um resistor e um capacitor. Execute a simulação e observe a tensão do capacitor durante a carga e a descarga."
    }
  };

  document.querySelectorAll("[data-activity]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-activity]").forEach((item) => {
        item.classList.toggle("active", item === button);
      });
      const activity = activities[button.dataset.activity];
      if (!activity) return;
      workspaceTitle.textContent = activity.title;
      workspaceSubtitle.textContent = activity.subtitle;
      activityNote.textContent = activity.note;
      // The hosted engine is cross-origin. Activity buttons provide a guided
      // exercise only; they do not silently inject components into the engine.
      if (window.innerWidth < 820) {
        document.querySelector(".simulator-panel").scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
});
