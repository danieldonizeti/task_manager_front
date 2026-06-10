import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import CategoryModal from "../../components/CategoryModal";
import TaskCard from "../../components/TaskCard";
import TaskModal from "../../components/TaskModal";
import api from "../../api/axios";

const statusOptions = [
  { value: "", label: "Todos os status" },
  { value: "pendente", label: "Pendente" },
  { value: "em progresso", label: "Em Progresso" },
  { value: "concluída", label: "Concluída" },
];

const priorityOptions = [
  { value: "", label: "Todas as prioridades" },
  { value: "1", label: "Baixa" },
  { value: "2", label: "Média" },
  { value: "3", label: "Alta" },
];

const orderingOptions = [
  { value: "", label: "Mais recentes" },
  { value: "priority", label: "Prioridade (menor → maior)" },
  { value: "-priority", label: "Prioridade (maior → menor)" },
  { value: "due_date", label: "Vencimento (mais próximo)" },
  { value: "-due_date", label: "Vencimento (mais distante)" },
  { value: "title", label: "Título (A → Z)" },
  { value: "-title", label: "Título (Z → A)" },
  { value: "status", label: "Status" },
];

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  // 1. NOVOS ESTADOS PARA PAGINAÇÃO
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [totalTasks, setTotalTasks] = useState(0);

  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    ordering: "",
  });

  useEffect(() => {
    fetchTasks(); // Quando altera os filtros, recomeça da página inicial
  }, [filters]);

  // 2. FETCH TASKS ADAPTADO PARA ACEITAR A URL DA PAGINAÇÃO
  async function fetchTasks(targetUrl = "/api/tasks/") {
    try {
      setLoading(true);
      setError("");

      let response;
      
      // Se for a URL padrão, aplicamos os filtros selecionados
      if (targetUrl === "/api/tasks/") {
        const params = {};
        if (filters.status) params.status = filters.status;
        if (filters.priority) params.priority = filters.priority;
        if (filters.ordering) params.ordering = filters.ordering;

        response = await api.get(targetUrl, { params });
      } else {
        // Se targetUrl for o link do 'next' ou 'prev', os filtros já vêm embutidos nele!
        response = await api.get(targetUrl);
      }

      // Atualiza os estados respeitando a estrutura do seu backend (data.data)
      setTasks(response.data.data.results);
      setNextPage(response.data.data.next);
      setPrevPage(response.data.data.previous);
      setTotalTasks(response.data.data.count); // Total geral de itens no banco
    } catch {
      setError("Erro ao carregar tarefas.");
    } finally {
      setLoading(false);
    }
  }

  function handleFilterChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  function clearFilters() {
    setFilters({ status: "", priority: "", ordering: "" });
  }

  const hasActiveFilters = filters.status || filters.priority || filters.ordering;

  function handleNewTask() {
    setSelectedTask(null);
    setModalOpen(true);
  }

  function handleNewCategory() {
    setCategoryModalOpen(true);
  }

  function handleCategoryCreated() {
    setCategoryModalOpen(false);
  }

  function handleEdit(task) {
    setSelectedTask(task);
    setModalOpen(true);
  }

  function handleDelete(task) {
    setDeleteConfirm(task);
  }

  async function confirmDelete() {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      await api.delete(`/api/tasks/${deleteConfirm.id}/`);
      setDeleteConfirm(null);
      fetchTasks();
    } catch {
      setDeleteConfirm(null);
    } finally {
      setDeleting(false);
    }
  }

  // 3. EN AJUSTE DOS CRDS DE RESUMO
  // O total agora olha para o banco de dados geral.
  // Nota: Os outros contadores filtram apenas os itens da página atual.
  const counts = {
    total: totalTasks,
    pendente: tasks.filter((t) => t.status === "pendente").length,
    "em progresso": tasks.filter((t) => t.status === "em progresso").length,
    concluida: tasks.filter((t) => t.status === "concluída").length,
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onCreateCategory={handleNewCategory} />

      <main className="flex-1 p-8">

        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Gerencie suas tarefas</p>
          </div>
          <button
            onClick={handleNewTask}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg transition cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nova Tarefa
          </button>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-1">Total</p>
            <p className="text-2xl font-bold text-gray-900">{counts.total}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-1">Pendentes</p>
            <p className="text-2xl font-bold text-yellow-500">{counts.pendente}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-1">Em Progresso</p>
            <p className="text-2xl font-bold text-blue-500">{counts["em progresso"]}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-1">Concluídas</p>
            <p className="text-2xl font-bold text-green-500">{counts.concluida}</p>
          </div>
        </div>

        {/* Barra de filtros */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex flex-wrap items-center gap-3">
          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>

          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {statusOptions.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          <select
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {priorityOptions.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>

          <select
            name="ordering"
            value={filters.ordering}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {orderingOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Limpar filtros
            </button>
          )}
        </div>

        {/* Lista de tarefas */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => fetchTasks()}
              className="mt-4 text-blue-600 hover:underline text-sm cursor-pointer"
            >
              Tentar novamente
            </button>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">Nenhuma tarefa encontrada.</p>
            <p className="text-gray-400 text-sm mt-1">
              {hasActiveFilters ? "Tente limpar os filtros." : "Clique em \"Nova Tarefa\" para começar!"}
            </p>
          </div>
        ) : (
          // 4. EMBALAMOS A GRID E OS BOTÕES DE PAGINAÇÃO ABAIXO
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {/* BARRA DE BOTÕES DA PAGINAÇÃO */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => fetchTasks(prevPage)}
                disabled={!prevPage}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition shadow-sm"
              >
                Anterior
              </button>
              <button
                onClick={() => fetchTasks(nextPage)}
                disabled={!nextPage}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition shadow-sm"
              >
                Próximo
              </button>
            </div>
          </>
        )}

      </main>

      {/* Modal de criar/editar */}
      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => fetchTasks()}
        task={selectedTask}
      />

      <CategoryModal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onSuccess={handleCategoryCreated}
      />

      {/* Modal de confirmação de exclusão */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Excluir tarefa</h2>
            <p className="text-gray-500 text-sm mb-6">
              Tem certeza que deseja excluir a tarefa{" "}
              <span className="font-medium text-gray-900">"{deleteConfirm.title}"</span>?
              Essa ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium rounded-lg transition cursor-pointer"
              >
                {deleting ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}