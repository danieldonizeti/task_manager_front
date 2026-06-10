import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

export default function Profile() {
  const { user, fetchUser } = useAuth();

  const [profileForm, setProfileForm] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  function handleProfileChange(e) {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  }

  function handlePasswordChange(e) {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  }

  async function handleProfileSubmit(e) {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    setProfileLoading(true);

    try {
      await api.patch(`/api/users/${user.id}/`, {
        first_name: profileForm.first_name,
        last_name: profileForm.last_name,
        email: profileForm.email,
      });
      setProfileSuccess("Perfil atualizado com sucesso!");
      await fetchUser();
    } catch {
      setProfileError("Erro ao atualizar perfil. Tente novamente.");
    } finally {
      setProfileLoading(false);
    }
  }

  async function handlePasswordSubmit(e) {
  e.preventDefault();
  setPasswordError("");
  setPasswordSuccess("");

  if (passwordForm.new_password !== passwordForm.confirm_password) {
    setPasswordError("As senhas não coincidem.");
    return;
  }

  if (passwordForm.new_password.length < 6) {
    setPasswordError("A nova senha deve ter pelo menos 6 caracteres.");
    return;
  }

  setPasswordLoading(true);

  try {
    await api.patch("/api/users/change-password/", {
      old_password: passwordForm.old_password,
      new_password: passwordForm.new_password,
    });
    setPasswordSuccess("Senha alterada com sucesso!");
    setPasswordForm({ old_password: "", new_password: "", confirm_password: "" });
  } catch {
    setPasswordError("Erro ao alterar senha. Verifique a senha atual.");
  } finally {
    setPasswordLoading(false);
  }
}

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-8">

        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Perfil</h1>
          <p className="text-gray-500 mt-1">Gerencie suas informações pessoais</p>
        </div>

        <div className="max-w-2xl space-y-6">

          {/* Card de dados pessoais */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xl">
                  {user?.first_name?.[0]?.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{user?.first_name} {user?.last_name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>

            <h2 className="text-base font-semibold text-gray-900 mb-4">Dados pessoais</h2>

            {profileSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 text-sm">{profileSuccess}</p>
              </div>
            )}
            {profileError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{profileError}</p>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <input
                    type="text"
                    name="first_name"
                    value={profileForm.first_name}
                    onChange={handleProfileChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sobrenome</label>
                  <input
                    type="text"
                    name="last_name"
                    value={profileForm.last_name}
                    onChange={handleProfileChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input
                  type="email"
                  name="email"
                  value={profileForm.email}
                  disabled
                  onChange={handleProfileChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition cursor-pointer"
                >
                  {profileLoading ? "Salvando..." : "Salvar alterações"}
                </button>
              </div>
            </form>
          </div>

          {/* Card de troca de senha */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Alterar senha</h2>

            {passwordSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 text-sm">{passwordSuccess}</p>
              </div>
            )}
            {passwordError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{passwordError}</p>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Senha atual</label>
                <input
                  type="password"
                  name="old_password"
                  value={passwordForm.old_password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nova senha</label>
                <input
                  type="password"
                  name="new_password"
                  value={passwordForm.new_password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar nova senha</label>
                <input
                  type="password"
                  name="confirm_password"
                  value={passwordForm.confirm_password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition cursor-pointer"
                >
                  {passwordLoading ? "Alterando..." : "Alterar senha"}
                </button>
              </div>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
}