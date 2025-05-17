import { Fade } from 'react-awesome-reveal';
import { useState } from 'react';

interface ChecklistItem {
  id: string;
  label: string;
  requires?: string[];
  disables?: string[];
}

const checklistData: ChecklistItem[] = [
  { id: 'gui-web', label: 'GUI Web' },
  { id: 'gui-mobile', label: 'GUI Móvil' },
  { id: 'auth-email', label: 'Autenticación por email' },
  { id: 'auth-third', label: 'Autenticación con terceros', requires: ['auth-email'] },
  { id: 'catalog-search', label: 'Búsqueda de bienes' },
  { id: 'catalog-filter', label: 'Filtrado de bienes', requires: ['catalog-search'] },
  { id: 'orders-tracking', label: 'Seguimiento de órdenes' },
  { id: 'orders-notify', label: 'Notificaciones de cambios', requires: ['orders-tracking'] },
  { id: 'realtime-track', label: 'Seguimiento en tiempo real', requires: ['orders-tracking'], disables: ['orders-notify'] },
  { id: 'payments-card', label: 'Pago con tarjeta' },
  { id: 'payments-cash', label: 'Pago en efectivo' }
];

function Checklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const handleToggle = (item: ChecklistItem) => {
    setChecked(prev => {
      const newState = { ...prev };
      const newValue = !prev[item.id];

      // enforce requires
      if (newValue && item.requires) {
        const unmet = item.requires.find(req => !prev[req]);
        if (unmet) {
          alert('Este elemento requiere seleccionar primero: ' + unmet);
          return prev;
        }
      }

      newState[item.id] = newValue;

      // enforce disables
      if (item.disables) {
        item.disables.forEach(dis => (newState[dis] = false));
      }

      return newState;
    });
  };

  return (
    <Fade cascade damping={0.12} triggerOnce>
      <ul className="space-y-2">
        {checklistData.map(item => {
          const disabled =
            !!item.requires?.find(req => !checked[req]) || // disabled until requirements met
            !!item.disables?.find(dis => checked[item.id]); // already handled but keep greyed
          return (
            <li key={item.id} className="flex items-center gap-3">
              <input
                id={item.id}
                type="checkbox"
                className="h-5 w-5 rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                checked={!!checked[item.id]}
                disabled={disabled}
                onChange={() => handleToggle(item)}
              />
              <label htmlFor={item.id} className="select-none text-gray-800">
                {item.label}
              </label>
            </li>
          );
        })}
      </ul>
    </Fade>
  );
}

export default Checklist;