const statusConfig = {
  pendente: {
    label: "Pendente",
    className: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  },
  "em progresso": {
    label: "Em Progresso",
    className: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  concluída: {
    label: "Concluída",
    className: "bg-green-50 text-green-700 border border-green-200",
  },
};

const priorityConfig = {
  baixa: { label: "Baixa", className: "text-gray-500" },
  media: { label: "Média", className: "text-yellow-600" },
  alta: { label: "Alta", className: "text-red-500" },
};

function formatDate(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function isOverdue(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}

export default function TaskCard({ task, onEdit, onDelete }) {
  const status = statusConfig[task.status] ?? statusConfig["pendente"];
  const priority = priorityConfig[task.priority_code] ?? priorityConfig["baixa"];
  const overdue = task.status !== "concluida" && isOverdue(task.due_date);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition group">

      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className={`font-medium text-gray-900 leading-snug ${task.status === "concluida" ? "line-through text-gray-400" : ""}`}>
          {task.title}
        </h3>
        {/* Ações */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Descrição */}
      {task.description && (
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{task.description}</p>
      )}

      {/* Rodapé */}
      <div className="flex items-center flex-wrap gap-2">

        {/* Status */}
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${status.className}`}>
          {status.label}
        </span>

        {/* Prioridade */}
        <span className={`text-xs font-medium ${priority.className}`}>
          ● {priority.label}
        </span>

        {/* Categoria */}
        {task.category_name && (
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {task.category_name}
          </span>
        )}

        {/* Data de vencimento */}
        {task.due_date && (
          <span className={`text-xs ml-auto font-medium ${overdue ? "text-red-500" : "text-gray-400"}`}>
            {overdue ? "⚠ " : "📅 "}
            {formatDate(task.due_date)}
          </span>
        )}

      </div>
    </div>
  );
}