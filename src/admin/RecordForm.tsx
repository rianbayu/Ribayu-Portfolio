import { Save, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import {
  listToText,
  textToList,
  validateRecord,
  type FieldSpec,
} from "./collections";

export type RecordValues = Record<string, unknown>;

/** Mengubah baris database menjadi nilai form (semuanya string). */
function toFormValues(fields: FieldSpec[], record: RecordValues | null) {
  const values: Record<string, string> = {};

  for (const field of fields) {
    const raw = record?.[field.name];
    values[field.name] =
      field.type === "list"
        ? listToText(raw)
        : raw === null || raw === undefined
          ? ""
          : String(raw);
  }

  return values;
}

/** Mengubah nilai form kembali menjadi payload database. */
function toPayload(fields: FieldSpec[], values: Record<string, string>) {
  const payload: RecordValues = {};

  for (const field of fields) {
    const text = values[field.name] ?? "";

    if (field.type === "list") {
      payload[field.name] = textToList(text);
      continue;
    }

    const trimmed = text.trim();
    // Kolom opsional yang dikosongkan disimpan sebagai NULL, bukan string
    // kosong, supaya situs publik bisa memakai fallback dengan andal.
    payload[field.name] = trimmed === "" ? null : trimmed;
  }

  return payload;
}

export default function RecordForm({
  fields,
  record,
  busy,
  onCancel,
  onSubmit,
}: {
  fields: FieldSpec[];
  record: RecordValues | null;
  busy: boolean;
  onCancel?: () => void;
  onSubmit: (payload: RecordValues) => Promise<void>;
}) {
  const [values, setValues] = useState(() => toFormValues(fields, record));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setField = (name: string, value: string) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;

    const found = validateRecord(fields, values);
    if (found.length > 0) {
      setErrors(Object.fromEntries(found.map((e) => [e.field, e.message])));
      return;
    }

    setErrors({});
    await onSubmit(toPayload(fields, values));
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit} noValidate>
      {fields.map((field) => {
        const value = values[field.name] ?? "";
        const error = errors[field.name];
        const id = `field-${field.name}`;

        return (
          <label key={field.name} className="admin-field" htmlFor={id}>
            <span>
              {field.label}
              {field.required && <i className="admin-req">wajib</i>}
            </span>

            {field.type === "textarea" || field.type === "list" ? (
              <textarea
                id={id}
                rows={field.type === "list" ? 4 : 3}
                value={value}
                onChange={(event) => setField(field.name, event.target.value)}
                aria-invalid={Boolean(error)}
              />
            ) : field.type === "select" ? (
              <select
                id={id}
                value={value}
                onChange={(event) => setField(field.name, event.target.value)}
              >
                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={id}
                type="text"
                value={value}
                onChange={(event) => setField(field.name, event.target.value)}
                aria-invalid={Boolean(error)}
              />
            )}

            {field.help && !error && (
              <small className="admin-muted">{field.help}</small>
            )}
            {error && <small className="admin-field-error">{error}</small>}
          </label>
        );
      })}

      <div className="admin-form-actions">
        <button type="submit" className="admin-primary" disabled={busy}>
          <Save size={15} />
          {busy ? "Menyimpan..." : "Simpan"}
        </button>
        {onCancel && (
          <button
            type="button"
            className="admin-ghost"
            onClick={onCancel}
            disabled={busy}
          >
            <X size={15} />
            Batal
          </button>
        )}
      </div>
    </form>
  );
}
