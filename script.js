// ============================================================
// Estado de la aplicación (persistido en localStorage para que
// la demo conserve los cambios entre recargas de página)
// ============================================================
const STORAGE_KEY = "red-tecnologia-resources";

function loadResources() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  return JSON.parse(JSON.stringify(SEED_RESOURCES));
}

function saveResources(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

let resources = loadResources();

const app = document.getElementById("app");
const roleSelect = document.getElementById("role-select");
roleSelect.value = localStorage.getItem("red-role") || "estudiante";
roleSelect.addEventListener("change", () => {
  localStorage.setItem("red-role", roleSelect.value);
  render();
});

function collectionName(id) {
  const c = COLLECTIONS.find((x) => x.id === id);
  return c ? c.name : id;
}

function countByCollection(id) {
  return resources.filter((r) => r.collection === id && r.status === "publicado").length;
}

// ============================================================
// Router muy simple basado en el hash de la URL
// ============================================================
function parseHash() {
  const hash = window.location.hash.replace(/^#\//, "");
  const [path, queryString] = hash.split("?");
  const params = new URLSearchParams(queryString || "");
  return { path: path || "home", params };
}

window.addEventListener("hashchange", render);
window.addEventListener("DOMContentLoaded", () => {
  if (!window.location.hash) window.location.hash = "#/home";
  render();
});

function setActiveNav(path) {
  document.querySelectorAll(".main-nav a").forEach((a) => {
    a.classList.toggle("active", a.dataset.nav === path);
  });
}

// ============================================================
// Render principal — decide qué vista mostrar
// ============================================================
function render() {
  const { path, params } = parseHash();
  setActiveNav(path);

  if (path === "home") return renderHome();
  if (path === "results") return renderResults(params.get("collection") || "", params.get("q") || "");
  if (path === "detail") return renderDetail(params.get("id"));
  if (path === "upload") return renderUpload();
  if (path === "admin") return renderAdmin();
  return renderHome();
}

// ============================================================
// Vista: Inicio
// ============================================================
function renderHome() {
  const featured = resources.find((r) => r.status === "publicado");

  app.innerHTML = `
    <section class="view active">
      <p class="eyebrow">Institución educativa · Área de Tecnología e Informática</p>
      <h1>Repositorio de Recursos Educativos Digitales</h1>
      <p class="subtitle">
        Electrónica básica, circuitos y pensamiento computacional para grados 6° a 11°.
        Diseñado para centralizar, preservar y compartir los recursos que ya usamos en clase
        con Scratch, Code.org y Tinkercad Circuits.
      </p>

      <form class="search-row" id="home-search-form">
        <input type="search" id="home-search-input" placeholder="Buscar por tema, grado o tipo de recurso" />
        <button class="btn btn-primary" type="submit">Buscar</button>
        <a class="btn btn-ghost" href="#/upload">Subir recurso</a>
      </form>

      <h2>Colecciones</h2>
      <div class="collection-grid">
        ${COLLECTIONS.map(
          (c) => `
          <div class="chip-card" data-collection="${c.id}">
            <h3>${c.name}</h3>
            <p class="count">${countByCollection(c.id)} recursos</p>
          </div>
        `
        ).join("")}
      </div>

      <h2>Recurso destacado</h2>
      ${featured ? resourceRowHTML(featured) : `<p class="empty-state">Aún no hay recursos publicados.</p>`}
    </section>
  `;

  document.querySelectorAll(".chip-card").forEach((card) => {
    card.addEventListener("click", () => {
      window.location.hash = `#/results?collection=${card.dataset.collection}`;
    });
  });
  document.getElementById("home-search-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const q = document.getElementById("home-search-input").value.trim();
    window.location.hash = `#/results?q=${encodeURIComponent(q)}`;
  });
  document.querySelectorAll("[data-goto-detail]").forEach((el) => {
    el.addEventListener("click", () => {
      window.location.hash = `#/detail?id=${el.dataset.gotoDetail}`;
    });
  });
}

function resourceRowHTML(r) {
  return `
    <div class="resource-row" data-goto-detail="${r.id}">
      <div class="resource-dot"></div>
      <div class="resource-text">
        <div class="title">${r.title}</div>
        <div class="meta">Grado ${r.grade} · ${r.type} · ${r.format}</div>
      </div>
      <span class="btn btn-ghost" style="pointer-events:none;">Ver ficha</span>
    </div>
  `;
}

// ============================================================
// Vista: Resultados de búsqueda / colección
// ============================================================
function renderResults(collectionFilter, searchQuery) {
  const state = {
    collection: collectionFilter,
    grade: "",
    type: "",
    q: searchQuery,
  };

  function filtered() {
    return resources.filter((r) => {
      if (r.status !== "publicado") return false;
      if (state.collection && r.collection !== state.collection) return false;
      if (state.grade && r.grade !== state.grade) return false;
      if (state.type && r.type !== state.type) return false;
      if (state.q) {
        const haystack = `${r.title} ${r.description} ${r.grade} ${r.type} ${r.format}`.toLowerCase();
        if (!haystack.includes(state.q.toLowerCase())) return false;
      }
      return true;
    });
  }

  const grades = [...new Set(resources.map((r) => r.grade))].sort();
  const types = [...new Set(resources.map((r) => r.type))].sort();

  function paint() {
    const list = filtered();
    app.innerHTML = `
      <section class="view active">
        <p class="breadcrumb">Colecciones ${state.collection ? "› " + collectionName(state.collection) : ""}</p>
        <h1>${state.collection ? collectionName(state.collection) : "Todos los recursos"}</h1>
        <p class="subtitle">${list.length} recurso${list.length === 1 ? "" : "s"} encontrado${list.length === 1 ? "" : "s"}</p>

        <div class="results-layout">
          <aside class="filters-box">
            <div class="filter-group">
              <h4>Palabra clave</h4>
              <input type="search" id="filter-q" placeholder="Buscar..." value="${state.q}" />
            </div>
            <div class="filter-group">
              <h4>Grado</h4>
              ${grades.map((g) => `<label><input type="radio" name="grade" value="${g}" /> ${g}</label>`).join("")}
              <label><input type="radio" name="grade" value="" checked /> Todos</label>
            </div>
            <div class="filter-group">
              <h4>Tipo de recurso</h4>
              ${types.map((t) => `<label><input type="radio" name="type" value="${t}" /> ${t}</label>`).join("")}
              <label><input type="radio" name="type" value="" checked /> Todos</label>
            </div>
          </aside>
          <div id="results-list">
            ${list.length ? list.map(resourceRowHTML).join("") : `<p class="empty-state">No hay recursos que coincidan con estos filtros.</p>`}
          </div>
        </div>
      </section>
    `;

    document.getElementById("filter-q").addEventListener("input", (e) => {
      state.q = e.target.value;
      paint();
    });
    document.querySelectorAll('input[name="grade"]').forEach((el) => {
      el.addEventListener("change", (e) => {
        state.grade = e.target.value;
        paint();
      });
    });
    document.querySelectorAll('input[name="type"]').forEach((el) => {
      el.addEventListener("change", (e) => {
        state.type = e.target.value;
        paint();
      });
    });
    document.querySelectorAll("[data-goto-detail]").forEach((el) => {
      el.addEventListener("click", () => {
        window.location.hash = `#/detail?id=${el.dataset.gotoDetail}`;
      });
    });
  }

  paint();
}

// ============================================================
// Vista: Ficha de recurso
// ============================================================
function renderDetail(id) {
  const r = resources.find((x) => x.id === id);
  if (!r) {
    app.innerHTML = `<section class="view active"><p class="empty-state">Recurso no encontrado.</p></section>`;
    return;
  }

  app.innerHTML = `
    <section class="view active">
      <p class="breadcrumb">Colecciones › ${collectionName(r.collection)} › ${r.title}</p>
      <h1>${r.title}</h1>
      <p class="subtitle">${r.description}</p>

      <div class="preview-box">Vista previa embebida (${r.format})</div>

      <div class="form-actions">
        <a class="btn btn-primary" href="${r.link}" target="_blank" rel="noopener">Abrir recurso original</a>
        <a class="btn btn-ghost" href="#/results?collection=${r.collection}">Volver a la colección</a>
      </div>

      <h2 style="margin-top:32px;">Metadatos (Dublin Core)</h2>
      <div class="meta-table">
        <div class="row"><div class="k">Título</div><div>${r.title}</div></div>
        <div class="row"><div class="k">Creador</div><div>${r.creator}, docente de Tecnología</div></div>
        <div class="row"><div class="k">Materia / Tema</div><div>${collectionName(r.collection)}</div></div>
        <div class="row"><div class="k">Tipo de recurso</div><div>${r.type}</div></div>
        <div class="row"><div class="k">Formato</div><div>${r.format}</div></div>
        <div class="row"><div class="k">Nivel educativo</div><div>Grado ${r.grade}</div></div>
        <div class="row"><div class="k">Derechos</div><div>Uso educativo, licencia ${r.license}</div></div>
        <div class="row"><div class="k">Identificador</div><div>${r.id}</div></div>
      </div>
    </section>
  `;
}

// ============================================================
// Vista: Formulario de carga (rol docente)
// ============================================================
function renderUpload() {
  app.innerHTML = `
    <section class="view active">
      <h1>Subir nuevo recurso</h1>
      <div class="notice">
        Rol activo: <strong>${roleSelect.value}</strong>. Este recurso quedará en estado
        <strong>"pendiente de revisión"</strong> hasta que un evaluador lo apruebe.
      </div>

      <form id="upload-form">
        <div class="field">
          <label for="f-title">Título</label>
          <input id="f-title" required placeholder="Ej. Circuito LED con pulsador" />
        </div>
        <div class="field">
          <label for="f-desc">Descripción</label>
          <textarea id="f-desc" rows="3" required placeholder="Objetivo pedagógico del recurso"></textarea>
        </div>
        <div class="field-row">
          <div class="field">
            <label for="f-collection">Colección</label>
            <select id="f-collection">
              ${COLLECTIONS.map((c) => `<option value="${c.id}">${c.name}</option>`).join("")}
            </select>
          </div>
          <div class="field">
            <label for="f-grade">Nivel educativo (grado)</label>
            <select id="f-grade">
              ${["6°", "7°", "8°", "9°", "10°", "11°"].map((g) => `<option value="${g}">${g}</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="field-row">
          <div class="field">
            <label for="f-type">Tipo de recurso</label>
            <select id="f-type">
              ${["Simulación", "Guía", "Video", "Proyecto"].map((t) => `<option value="${t}">${t}</option>`).join("")}
            </select>
          </div>
          <div class="field">
            <label for="f-format">Formato / plataforma</label>
            <input id="f-format" required placeholder="Tinkercad, Scratch, Code.org, PDF..." />
          </div>
        </div>
        <div class="field">
          <label for="f-link">Archivo o enlace</label>
          <input id="f-link" required placeholder="Pega el enlace del recurso" />
        </div>
        <div class="field">
          <label for="f-license">Licencia (derechos)</label>
          <input id="f-license" value="CC BY-NC" />
        </div>
        <div class="form-actions">
          <button class="btn btn-primary" type="submit">Enviar para revisión</button>
          <a class="btn btn-ghost" href="#/home">Cancelar</a>
        </div>
      </form>
    </section>
  `;

  document.getElementById("upload-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const newResource = {
      id: "r" + Date.now(),
      title: document.getElementById("f-title").value,
      description: document.getElementById("f-desc").value,
      collection: document.getElementById("f-collection").value,
      grade: document.getElementById("f-grade").value,
      type: document.getElementById("f-type").value,
      format: document.getElementById("f-format").value,
      creator: "Diego Rodríguez",
      license: document.getElementById("f-license").value || "CC BY-NC",
      link: document.getElementById("f-link").value || "#",
      status: "pendiente",
    };
    resources.push(newResource);
    saveResources(resources);
    window.location.hash = "#/admin";
  });
}

// ============================================================
// Vista: Panel de administrador / evaluador
// ============================================================
function renderAdmin() {
  const pending = resources.filter((r) => r.status === "pendiente");

  app.innerHTML = `
    <section class="view active">
      <h1>Panel de administración</h1>
      <p class="subtitle">Rol activo: <strong>${roleSelect.value}</strong>. Recursos pendientes de revisión antes de publicarse.</p>
      <div id="pending-list">
        ${
          pending.length
            ? pending
                .map(
                  (r) => `
          <div class="pending-row" data-id="${r.id}">
            <div class="resource-text">
              <div class="title">${r.title}</div>
              <div class="meta">Enviado por ${r.creator} · Grado ${r.grade} · ${collectionName(r.collection)}</div>
            </div>
            <span class="badge">Pendiente</span>
            <button class="btn btn-primary" data-action="approve" data-id="${r.id}">Aprobar</button>
            <button class="btn btn-ghost" data-action="reject" data-id="${r.id}">Rechazar</button>
          </div>
        `
                )
                .join("")
            : `<p class="empty-state">No hay recursos pendientes por revisar.</p>`
        }
      </div>
    </section>
  `;

  document.querySelectorAll('[data-action="approve"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = resources.find((x) => x.id === btn.dataset.id);
      if (r) r.status = "publicado";
      saveResources(resources);
      renderAdmin();
    });
  });
  document.querySelectorAll('[data-action="reject"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      resources = resources.filter((x) => x.id !== btn.dataset.id);
      saveResources(resources);
      renderAdmin();
    });
  });
}
