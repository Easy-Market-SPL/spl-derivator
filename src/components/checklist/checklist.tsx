'use client';

import { Fade } from 'react-awesome-reveal';
import { useMemo, useState, useEffect } from 'react';
import {
  checklistSections,
  groupTypes,
  ChecklistItem
} from '@/lib/checklist-data';

// Helper to flatten all items once – makes lookup trivial.
const allItems: ChecklistItem[] = checklistSections.flatMap(s => s.items);
const idToItem = new Map(allItems.map(i => [i.id, i]));

export default function Checklist() {
  /** state: id → selected? */
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [sending, setSending] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');

  /** Group → ids[], memoised so we only compute once. */
  const groupIndex = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const itm of allItems) {
      if (!itm.group) continue;
      if (!map[itm.group]) map[itm.group] = [];
      map[itm.group].push(itm.id);
    }
    return map;
  }, []);

  const toggle = (item: ChecklistItem) => {
    setSelected(prev => {
      const next = { ...prev };
      const currentValue = !!prev[item.id];
      const willSelect = !currentValue;

      if (willSelect && item.requires) {
        const unmet = item.requires.find(req => !prev[req]);
        if (unmet) {
          alert(`Este elemento requiere seleccionar primero: “${idToItem.get(unmet)?.label}”.`);
          return prev;
        }
      }

      if (item.group && groupTypes[item.group] === 'single') {
        for (const peerId of groupIndex[item.group] ?? []) {
          next[peerId] = false;
        }
      }

      next[item.id] = willSelect;

      if (willSelect && item.disables) {
        for (const dis of item.disables) next[dis] = false;
      }

      return next;
    });
  };

  const isDisabled = (itm: ChecklistItem, sel = selected): boolean => {
    return !!itm.requires?.find(req => !sel[req]);
  };

  useEffect(() => {
    setSelected(prev => {
      let changed = false;
      const next = { ...prev };
      for (const item of allItems) {
        if (prev[item.id] && isDisabled(item, prev)) {
          next[item.id] = false;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [selected]);

  const generateEnvContent = () => {
    const featureMap: Record<string, string> = {
      RATINGS_ENABLED: 'support-rating',
      CHAT_ENABLED: 'support-chat',
      THIRD_AUTH_ENABLED: 'auth-third',
      REALTIME_TRACKING_ENABLED: 'realtime-track',
      CASH_ENABLED: 'payments-cash',
      CREDIT_CARD_ENABLED: 'payments-card',
      FEAT_NOTIFICATIONS: 'notifications',
    };

    const deviceMap: Record<string, string> = {
      MOBILE: 'gui-mobile',
      WEB: 'gui-web',
    };

    const lines = ['# FEATURE TOGGLES', ''];

    for (const [envVar, featId] of Object.entries(deviceMap)) {
      lines.push(`${envVar}=${selected[featId] ? 'true' : 'false'}`);
    }

    for (const [envVar, featId] of Object.entries(featureMap)) {
      lines.push(`${envVar}=${selected[featId] ? 'true' : 'false'}`);
    }

    return lines.join('\n');
  };

  const sendEmail = async () => {
    if (!companyName.trim() || !companyEmail.trim()) {
      alert('Por favor ingresa el nombre y correo de la empresa.');
      return;
    }
    setSending(true);
    const envFeats = generateEnvContent();
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ envFeats, companyName, companyEmail }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Solicitud enviada correctamente. Revisa tu correo.');
        setCompanyName('');
        setCompanyEmail('');
        setSelected({});
      } else {
        alert('Error al enviar la solicitud: ' + (data.error ?? ''));
      }
    } catch (err) {
      alert('Error de conexión: ' + String(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Inputs para empresa */}
        <div className="flex flex-col gap-4 max-w-md">
          <label className="flex flex-col text-gray-700">
            Nombre de la empresa:
            <input
              type="text"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              className="mt-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ejemplo: Mi Empresa S.A."
              required
            />
          </label>
          <label className="flex flex-col text-gray-700">
            Correo electrónico:
            <input
              type="email"
              value={companyEmail}
              onChange={e => setCompanyEmail(e.target.value)}
              className="mt-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ejemplo@empresa.com"
              required
            />
          </label>
        </div>

        {/* Checklist */}
        {checklistSections.map(section => (
          <Fade key={section.id} cascade damping={0.13} triggerOnce>
            <h3 className="text-lg font-semibold text-gray-900">
              {section.label}
            </h3>
            <p className="text-sm text-gray-800">{section.description}</p>
            <p className="text-sm text-gray-800">
              {section.included.length > 0 ? "Incluido en el paquete: " : ""}
            </p>
            <ul className="space-y-2 pl-2">
              {section.included.map(item => (
                <li key={item} className="flex text-sm items-center gap-3">
                  <label htmlFor={item} className="text-gray-800">
                    - {item}
                  </label>
                </li>
              ))}
            </ul>
            <ul className="space-y-2 pl-2">
              {section.items.map(item => {
                const disabled = isDisabled(item);
                const groupSingle = item.group && groupTypes[item.group] === 'single';
                return (
                  <li key={item.id} className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <input
                        id={item.id}
                        type={groupSingle ? 'radio' : 'checkbox'}
                        name={groupSingle ? item.group : item.id}
                        className="h-5 w-5 rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500 disabled:opacity-40"
                        checked={!!selected[item.id]}
                        disabled={disabled}
                        onChange={() => toggle(item)}
                      />
                      <label htmlFor={item.id} className="select-none text-gray-800 cursor-pointer">
                        {item.label}
                      </label>
                    </div>
                    <p className="text-sm text-gray-600 pl-8">{item.description}</p>
                  </li>
                );
              })}
            </ul>
            <hr />
          </Fade>
        ))}
      </div>

      <div className="mt-6 flex flex-col items-start gap-3 max-w-md">
        <button
          onClick={sendEmail}
          disabled={sending}
          className={`px-4 py-2 rounded text-white transition ${
            sending ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {sending ? 'Enviando...' : 'Enviar solicitud'}
        </button>
      </div>
    </>
  );
}
