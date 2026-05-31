import { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabaseClient";

const DISTANCES = ["5 Km", "10 Km", "21 Km", "Maratona", "Não corri"];

const emptyForm = {
  nome: "",
  sobrenome: "",
  distancia: "",
  tempoEstimado: "00:00:00",
  tempoReal: "00:00:00",
};

function Card({ title, subtitle, children, right }) {
  return (
    <div
      style={{
        background: "linear-gradient(180deg, #18181b 0%, #121214 100%)",
        border: "1px solid #27272a",
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        boxShadow: "0 18px 40px rgba(0,0,0,0.28)",
      }}
    >
      {(title || subtitle || right) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            alignItems: "flex-start",
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            {title && (
              <h2 style={{ margin: 0, fontSize: 22, lineHeight: 1.2 }}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                style={{
                  margin: "6px 0 0 0",
                  color: "#a1a1aa",
                  lineHeight: 1.5,
                  fontSize: 14,
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

function Field({ label, value, onChange, placeholder = "", type = "text" }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label
        style={{
          display: "block",
          marginBottom: 8,
          color: "#d4d4d8",
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
        style={{
          width: "100%",
          height: 50,
          borderRadius: 16,
          border: "1px solid #3f3f46",
          background: "#09090b",
          color: "white",
          padding: "0 14px",
          fontSize: 15,
          outline: "none",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label
        style={{
          display: "block",
          marginBottom: 8,
          color: "#d4d4d8",
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          height: 50,
          borderRadius: 16,
          border: "1px solid #3f3f46",
          background: "#09090b",
          color: "white",
          padding: "0 14px",
          fontSize: 15,
          outline: "none",
          boxSizing: "border-box",
        }}
      >
        <option value="">Selecione</option>
        {options.map((option) => (
          <option key={option} value={option} style={{ background: "#09090b", color: "white" }}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function PrimaryButton({ children, onClick, type = "button", disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled
          ? "#3f3f46"
          : "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
        color: "white",
        border: "none",
        borderRadius: 16,
        padding: "14px 18px",
        fontSize: 15,
        fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: disabled ? "none" : "0 10px 20px rgba(220,38,38,0.25)",
      }}
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        background: "#0b0b0d",
        color: disabled ? "#666" : "#fafafa",
        border: "1px solid #3f3f46",
        borderRadius: 16,
        padding: "14px 18px",
        fontSize: 15,
        fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </button>
  );
}

function DangerButton({ children, onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? "#3f3f46" : "#7f1d1d",
        color: "white",
        border: "1px solid #991b1b",
        borderRadius: 16,
        padding: "14px 18px",
        fontSize: 15,
        fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </button>
  );
}

function MetricCard({ title, value, subtitle = "" }) {
  return (
    <div
      style={{
        background: "linear-gradient(180deg, #09090b 0%, #111113 100%)",
        border: "1px solid #27272a",
        borderRadius: 20,
        padding: 18,
        minHeight: 110,
      }}
    >
      <div style={{ color: "#a1a1aa", fontSize: 13 }}>{title}</div>
      <div style={{ fontSize: 30, fontWeight: 800, marginTop: 8 }}>{value}</div>
      {subtitle ? (
        <div style={{ color: "#d4d4d8", fontSize: 13, marginTop: 8, lineHeight: 1.4 }}>
          {subtitle}
        </div>
      ) : null}
    </div>
  );
}

function formatTime(value) {
  const cleaned = value.replace(/\D/g, "").slice(0, 6);

  if (cleaned.length === 0) return "";
  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}:${cleaned.slice(2)}`;
  return `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}:${cleaned.slice(4, 6)}`;
}

function isValidTime(value) {
  return /^\d{2}:\d{2}:\d{2}$/.test(value);
}

function timeToSeconds(value) {
  if (!isValidTime(value)) return null;
  const [hh, mm, ss] = value.split(":").map(Number);
  return hh * 3600 + mm * 60 + ss;
}

function formatDate(dateString) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString("pt-BR");
}

function isZeroTime(value) {
  return value === "00:00:00";
}

export default function App() {
  const [form, setForm] = useState(emptyForm);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [distanceFilter, setDistanceFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadRecords();
  }, []);

  async function loadRecords() {
    setLoading(true);

    const { data, error } = await supabase
      .from("tempos_prova")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert("Erro ao carregar registros: " + error.message);
      setLoading(false);
      return;
    }

    setRecords(data || []);
    setLoading(false);
  }

  function handleEdit(record) {
    setForm({
      nome: record.nome || "",
      sobrenome: record.sobrenome || "",
      distancia: record.distancia || "",
      tempoEstimado: record.tempo_estimado || "00:00:00",
      tempoReal: record.tempo_real || "00:00:00",
    });

    setEditingId(record.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleDelete(record) {
    const confirmed = window.confirm(
      `Deseja realmente excluir o registro de ${record.nome} ${record.sobrenome}?`
    );

    if (!confirmed) return;

    setDeletingId(record.id);

    const { error } = await supabase
      .from("tempos_prova")
      .delete()
      .eq("id", record.id);

    setDeletingId(null);

    if (error) {
      alert("Erro ao excluir: " + error.message);
      return;
    }

    setRecords((prev) => prev.filter((item) => item.id !== record.id));

    if (editingId === record.id) {
      setForm(emptyForm);
      setEditingId(null);
    }

    alert("Registro excluído com sucesso.");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.nome.trim()) {
      alert("Preencha o nome.");
      return;
    }

    if (!form.sobrenome.trim()) {
      alert("Preencha o sobrenome.");
      return;
    }

    if (!form.distancia) {
      alert("Selecione a distância.");
      return;
    }

    if (form.tempoEstimado && !isValidTime(form.tempoEstimado)) {
      alert("Se preencher o tempo estimado, use o formato HH:MM:SS.");
      return;
    }

    if (form.tempoReal && !isValidTime(form.tempoReal)) {
      alert("Se preencher o tempo real, use o formato HH:MM:SS.");
      return;
    }

    setSaving(true);

    const payload = {
      nome: form.nome.trim(),
      sobrenome: form.sobrenome.trim(),
      distancia: form.distancia,
      tempo_estimado: form.tempoEstimado || "00:00:00",
      tempo_real: form.tempoReal || "00:00:00",
    };

    let response;

    if (editingId) {
      response = await supabase
        .from("tempos_prova")
        .update(payload)
        .eq("id", editingId)
        .select()
        .single();
    } else {
      response = await supabase
        .from("tempos_prova")
        .insert([payload])
        .select()
        .single();
    }

    const { data, error } = response;

    setSaving(false);

    if (error) {
      alert("Erro ao salvar: " + error.message);
      return;
    }

    if (editingId) {
      setRecords((prev) => prev.map((item) => (item.id === editingId ? data : item)));
      alert("Registro atualizado com sucesso.");
    } else {
      setRecords((prev) => [data, ...prev]);
      alert("Registro salvo com sucesso.");
    }

    setForm(emptyForm);
    setEditingId(null);
  }

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesDistance = distanceFilter ? record.distancia === distanceFilter : true;
      const matchesSearch = searchTerm
        ? `${record.nome} ${record.sobrenome}`.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      return matchesDistance && matchesSearch;
    });
  }, [records, distanceFilter, searchTerm]);

  const summary = useMemo(() => {
    const total = records.length;

    const byDistance = DISTANCES.reduce((acc, distance) => {
      acc[distance] = records.filter((r) => r.distancia === distance).length;
      return acc;
    }, {});

    return {
      total,
      byDistance,
    };
  }, [records]);

  const sortedByRealTime = useMemo(() => {
    return [...filteredRecords]
      .filter((r) => isValidTime(r.tempo_real) && !isZeroTime(r.tempo_real))
      .sort((a, b) => timeToSeconds(a.tempo_real) - timeToSeconds(b.tempo_real));
  }, [filteredRecords]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(239,68,68,0.12), transparent 28%), linear-gradient(180deg, #09090b 0%, #0f0f12 100%)",
        color: "white",
        padding: 16,
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: 20, padding: "20px 0 8px 0" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "6px 10px",
              borderRadius: 999,
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.24)",
              color: "#fca5a5",
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            FORMULÁRIO PÚBLICO • PROVA
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 34,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            100 Maratonas de Paulo Gustavo
          </h1>

          <p
            style={{
              color: "#a1a1aa",
              marginTop: 10,
              marginBottom: 0,
              fontSize: 15,
              lineHeight: 1.6,
              maxWidth: 760,
            }}
          >
            Cada quilômetro tem uma história. Registre nome, distância, tempo estimado e tempo real
            nesta jornada de superação.
          </p>
        </div>

        <Card title="Resumo rápido" subtitle="Visão geral da base cadastrada.">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
            }}
          >
            <MetricCard title="Total de registros" value={summary.total} />
            <MetricCard title="5 Km" value={summary.byDistance["5 Km"] || 0} />
            <MetricCard title="10 Km" value={summary.byDistance["10 Km"] || 0} />
            <MetricCard title="21 Km" value={summary.byDistance["21 Km"] || 0} />
            <MetricCard title="Maratona" value={summary.byDistance["Maratona"] || 0} />
            <MetricCard title="Não corri" value={summary.byDistance["Não corri"] || 0} />
          </div>
        </Card>

        <Card
          title={editingId ? "Editar registro" : "Novo registro"}
          subtitle={
            editingId
              ? "Atualize os dados do participante selecionado."
              : "Preencha os dados do participante."
          }
        >
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 14,
              }}
            >
              <Field
                label="Nome *"
                value={form.nome}
                onChange={(e) => setForm((prev) => ({ ...prev, nome: e.target.value }))}
                placeholder="Digite o nome"
              />

              <Field
                label="Sobrenome *"
                value={form.sobrenome}
                onChange={(e) => setForm((prev) => ({ ...prev, sobrenome: e.target.value }))}
                placeholder="Digite o sobrenome"
              />

              <SelectField
                label="Distância *"
                value={form.distancia}
                onChange={(e) => setForm((prev) => ({ ...prev, distancia: e.target.value }))}
                options={DISTANCES}
              />

              <Field
                label="Tempo estimado"
                value={form.tempoEstimado}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    tempoEstimado: formatTime(e.target.value),
                  }))
                }
                placeholder="00:00:00"
              />

              <Field
                label="Tempo real"
                value={form.tempoReal}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    tempoReal: formatTime(e.target.value),
                  }))
                }
                placeholder="00:00:00"
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                marginTop: 18,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <div style={{ color: "#a1a1aa", fontSize: 14 }}>
                Os campos de tempo são opcionais. Quando não houver informação, mantenha{" "}
                <strong>00:00:00</strong>.
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <SecondaryButton
                  onClick={editingId ? handleCancelEdit : () => setForm(emptyForm)}
                  disabled={saving}
                >
                  {editingId ? "Cancelar edição" : "Limpar"}
                </SecondaryButton>

                <PrimaryButton type="submit" disabled={saving}>
                  {saving
                    ? "Salvando..."
                    : editingId
                    ? "Salvar alterações"
                    : "Salvar registro"}
                </PrimaryButton>
              </div>
            </div>
          </form>
        </Card>

        <Card title="Filtros" subtitle="Refine a visualização dos participantes.">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 14,
            }}
          >
            <SelectField
              label="Filtrar por distância"
              value={distanceFilter}
              onChange={(e) => setDistanceFilter(e.target.value)}
              options={DISTANCES}
            />

            <Field
              label="Buscar participante"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite nome ou sobrenome"
            />
          </div>
        </Card>

        <Card
          title="Classificação por tempo real"
          subtitle="Ordenação do menor para o maior tempo, conforme os filtros. Registros com 00:00:00 não entram no ranking."
          right={
            <div style={{ color: "#a1a1aa", fontSize: 14 }}>
              {loading ? "Carregando..." : `${sortedByRealTime.length} registros`}
            </div>
          }
        >
          {loading ? (
            <div style={{ color: "#a1a1aa" }}>Carregando registros...</div>
          ) : sortedByRealTime.length === 0 ? (
            <div
              style={{
                background: "#09090b",
                border: "1px dashed #3f3f46",
                borderRadius: 18,
                padding: 20,
                color: "#a1a1aa",
              }}
            >
              Nenhum registro encontrado.
            </div>
          ) : (
            <div
              style={{
                overflowX: "auto",
                border: "1px solid #27272a",
                borderRadius: 18,
                background: "#09090b",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr
                    style={{
                      color: "#a1a1aa",
                      textAlign: "left",
                      borderBottom: "1px solid #27272a",
                    }}
                  >
                    <th style={{ padding: "14px 12px" }}>#</th>
                    <th style={{ padding: "14px 12px" }}>Nome</th>
                    <th style={{ padding: "14px 12px" }}>Distância</th>
                    <th style={{ padding: "14px 12px" }}>Tempo estimado</th>
                    <th style={{ padding: "14px 12px" }}>Tempo real</th>
                    <th style={{ padding: "14px 12px" }}>Registro</th>
                    <th style={{ padding: "14px 12px" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedByRealTime.map((record, index) => (
                    <tr key={record.id} style={{ borderBottom: "1px solid #18181b" }}>
                      <td style={{ padding: "14px 12px", fontWeight: 700 }}>{index + 1}</td>
                      <td style={{ padding: "14px 12px", fontWeight: 600 }}>
                        {record.nome} {record.sobrenome}
                      </td>
                      <td style={{ padding: "14px 12px" }}>{record.distancia}</td>
                      <td style={{ padding: "14px 12px" }}>{record.tempo_estimado}</td>
                      <td style={{ padding: "14px 12px", fontWeight: 700 }}>{record.tempo_real}</td>
                      <td style={{ padding: "14px 12px" }}>{formatDate(record.created_at)}</td>
                      <td style={{ padding: "14px 12px" }}>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <SecondaryButton onClick={() => handleEdit(record)}>
                            Editar
                          </SecondaryButton>
                          <DangerButton
                            onClick={() => handleDelete(record)}
                            disabled={deletingId === record.id}
                          >
                            {deletingId === record.id ? "Excluindo..." : "Excluir"}
                          </DangerButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}