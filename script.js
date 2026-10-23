/* Interações do portfólio de Alexandre Santana Farias. */
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const raiz = document.documentElement;
  const botaoTema = document.getElementById("botao-tema");
  const botaoMenu = document.getElementById("botao-menu");
  const listaNavegacao = document.getElementById("lista-navegacao");
  const botaoVoltarTopo = document.getElementById("voltar-topo");
  const textoDigitacao = document.getElementById("texto-digitacao");
  const anoAtual = document.getElementById("ano-atual");
  const movimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (anoAtual) anoAtual.textContent = String(new Date().getFullYear());

  // O tema fica salvo no navegador, se o armazenamento estiver disponível.
  let temaSalvo = null;
  try { temaSalvo = localStorage.getItem("tema-portfolio-alexandre"); } catch (erro) { temaSalvo = null; }
  aplicarTema(temaSalvo === "escuro" ? "escuro" : "claro");

  function aplicarTema(tema) {
    raiz.dataset.tema = tema;
    if (botaoTema) {
      const escuro = tema === "escuro";
      botaoTema.setAttribute("aria-label", escuro ? "Ativar tema claro" : "Ativar tema escuro");
      botaoTema.innerHTML = escuro
        ? '<i class="bi bi-sun" aria-hidden="true"></i><span class="texto-tema">Tema claro</span>'
        : '<i class="bi bi-moon-stars" aria-hidden="true"></i><span class="texto-tema">Tema escuro</span>';
    }
    const metaTema = document.querySelector('meta[name="theme-color"]');
    if (metaTema) metaTema.setAttribute("content", tema === "escuro" ? "#111111" : "#fffaf5");
  }

  if (botaoTema) botaoTema.addEventListener("click", () => {
    const novoTema = raiz.dataset.tema === "escuro" ? "claro" : "escuro";
    aplicarTema(novoTema);
    try { localStorage.setItem("tema-portfolio-alexandre", novoTema); } catch (erro) { /* Continua funcionando sem armazenamento. */ }
  });

  function fecharMenu() {
    if (!botaoMenu || !listaNavegacao) return;
    listaNavegacao.classList.remove("aberto");
    botaoMenu.setAttribute("aria-expanded", "false");
    botaoMenu.setAttribute("aria-label", "Abrir menu");
    botaoMenu.innerHTML = '<i class="bi bi-list" aria-hidden="true"></i>';
  }

  if (botaoMenu && listaNavegacao) {
    botaoMenu.addEventListener("click", () => {
      const aberto = listaNavegacao.classList.toggle("aberto");
      botaoMenu.setAttribute("aria-expanded", String(aberto));
      botaoMenu.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
      botaoMenu.innerHTML = aberto ? '<i class="bi bi-x-lg" aria-hidden="true"></i>' : '<i class="bi bi-list" aria-hidden="true"></i>';
    });
    listaNavegacao.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener("click", fecharMenu));
    document.addEventListener("keydown", (evento) => { if (evento.key === "Escape") fecharMenu(); });
    document.addEventListener("click", (evento) => {
      if (!listaNavegacao.contains(evento.target) && !botaoMenu.contains(evento.target)) fecharMenu();
    });
    window.addEventListener("resize", () => { if (window.innerWidth >= 800) fecharMenu(); });
  }

  // Máquina de escrever; respeita a preferência por movimento reduzido.
  if (textoDigitacao) {
    const frases = ["Desenvolvedor Full Stack", "Aprendizado contínuo", "Projetos e prática"];
    if (movimentoReduzido) {
      textoDigitacao.textContent = frases[0];
    } else {
      let indiceFrase = 0;
      let indiceLetra = frases[0].length;
      let apagando = true;
      function animarDigitacao() {
        const frase = frases[indiceFrase];
        textoDigitacao.textContent = frase.slice(0, indiceLetra);
        if (!apagando && indiceLetra === frase.length) {
          apagando = true; window.setTimeout(animarDigitacao, 1500); return;
        }
        if (apagando && indiceLetra === 0) {
          apagando = false; indiceFrase = (indiceFrase + 1) % frases.length;
          window.setTimeout(animarDigitacao, 300); return;
        }
        indiceLetra += apagando ? -1 : 1;
        window.setTimeout(animarDigitacao, apagando ? 45 : 85);
      }
      window.setTimeout(animarDigitacao, 1800);
    }
  }

  // Anima os elementos quando entram na área visível da tela.
  const elementosAnimados = document.querySelectorAll(".aparece");
  if ("IntersectionObserver" in window && !movimentoReduzido) {
    const observador = new IntersectionObserver((entradas, observadorAtual) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visivel");
          observadorAtual.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.12 });
    elementosAnimados.forEach((elemento) => observador.observe(elemento));
  } else {
    elementosAnimados.forEach((elemento) => elemento.classList.add("visivel"));
  }

  function atualizarBotaoTopo() {
    if (botaoVoltarTopo) botaoVoltarTopo.classList.toggle("visivel", window.scrollY > 420);
  }
  window.addEventListener("scroll", atualizarBotaoTopo, { passive: true });
  atualizarBotaoTopo();
  if (botaoVoltarTopo) botaoVoltarTopo.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: movimentoReduzido ? "auto" : "smooth" });
  });
});
