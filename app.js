// Utilitários de localStorage
function getPatients() {
  return JSON.parse(localStorage.getItem("patients") || "[]");
}

function savePatients(patients) {
  localStorage.setItem("patients", JSON.stringify(patients));
}

// Seed inicial
function seedIfEmpty() {
  if (getPatients().length === 0) {
    savePatients([
      { id: 1, name: "Maria Silva", age: 30, cpf: "12345678901", phone: "11999999999" },
      { id: 2, name: "João Souza", age: 45, cpf: "98765432100", phone: "11988888888" },
    ]);
  }
}

// Renderização
function renderTable(list) {
  const tbody = document.getElementById("patients-table");
  tbody.innerHTML = "";
  list.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>${p.age}</td>
      <td>${p.cpf}</td>
      <td>${p.phone}</td>
      <td>
        <button onclick="openEdit(${p.id})">Editar</button>
        <button onclick="deletePatient(${p.id})">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}
// Máscara para CPF
document.getElementById("cpf").addEventListener("input", e => {
  let value = e.target.value.replace(/\D/g, ""); // só números
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  e.target.value = value;
});

// Máscara para Telefone
document.getElementById("phone").addEventListener("input", e => {
  let value = e.target.value.replace(/\D/g, ""); // só números
  value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
  value = value.replace(/(\d{4})(\d)/, "$1-$2");
  e.target.value = value;
});

// Máscara para edição (modal)
document.getElementById("edit-cpf").addEventListener("input", e => {
  let value = e.target.value.replace(/\D/g, "");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  e.target.value = value;
});

document.getElementById("edit-phone").addEventListener("input", e => {
  let value = e.target.value.replace(/\D/g, "");
  value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
  value = value.replace(/(\d{4})(\d)/, "$1-$2");
  e.target.value = value;
});

// CRUD
function createPatient(patient) {
  const patients = getPatients();
  patient.id = patients.length ? patients[patients.length - 1].id + 1 : 1;
  patients.push(patient);
  savePatients(patients);
  renderTable(patients);
}

function updatePatient(id, data) {
  const patients = getPatients();
  const idx = patients.findIndex(p => p.id === id);
  if (idx > -1) {
    patients[idx] = { ...patients[idx], ...data };
    savePatients(patients);
    renderTable(patients);
  }
}

function deletePatient(id) {
  if (!confirm("Tem certeza que deseja excluir este paciente?")) return;
  let patients = getPatients().filter(p => p.id !== id);
  savePatients(patients);
  renderTable(patients);
}

// Eventos
document.getElementById("patient-form").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const age = parseInt(document.getElementById("age").value);
  const cpf = document.getElementById("cpf").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!name || isNaN(age) || cpf.length !== 11 || !phone) {
    alert("Preencha os dados corretamente!");
    return;
  }

  createPatient({ name, age, cpf, phone });
  e.target.reset();
});

// Modal edição
function openEdit(id) {
  const p = getPatients().find(p => p.id === id);
  if (!p) return;

  document.getElementById("edit-id").value = p.id;
  document.getElementById("edit-name").value = p.name;
  document.getElementById("edit-age").value = p.age;
  document.getElementById("edit-cpf").value = p.cpf;
  document.getElementById("edit-phone").value = p.phone;

  document.getElementById("modal").classList.remove("hidden");
}

document.getElementById("close-modal").addEventListener("click", () => {
  document.getElementById("modal").classList.add("hidden");
});

document.getElementById("edit-form").addEventListener("submit", e => {
  e.preventDefault();
  const id = parseInt(document.getElementById("edit-id").value);
  const name = document.getElementById("edit-name").value.trim();
  const age = parseInt(document.getElementById("edit-age").value);
  const cpf = document.getElementById("edit-cpf").value.trim();
  const phone = document.getElementById("edit-phone").value.trim();

  updatePatient(id, { name, age, cpf, phone });
  document.getElementById("modal").classList.add("hidden");
});

// Busca
document.getElementById("search").addEventListener("input", e => {
  const term = e.target.value.toLowerCase();
  const patients = getPatients().filter(p =>
    p.name.toLowerCase().includes(term) || p.cpf.includes(term)
  );
  renderTable(patients);
});

// Botão para mostrar/ocultar lista de pacientes
const toggleBtn = document.getElementById("toggle-list");
const listWrapper = document.getElementById("list-wrapper");

toggleBtn.addEventListener("click", () => {
  const isVisible = listWrapper.classList.toggle("visible");
  if (isVisible) {
    listWrapper.classList.remove("hidden");
    toggleBtn.textContent = "Esconder";
  } else {
    listWrapper.classList.add("hidden");
    toggleBtn.textContent = "Mostrar";
  }
});

// Inicialização
seedIfEmpty();
renderTable(getPatients());
