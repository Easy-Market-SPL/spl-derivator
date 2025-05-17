'use client';

import { Fade } from 'react-awesome-reveal';
import { useMemo, useState } from 'react';
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
      // Clone before mutating
      const next = { ...prev };
      const currentValue = !!prev[item.id];
      const willSelect = !currentValue;

      // 1) Requirements (if selecting)
      if (willSelect && item.requires) {
        const unmet = item.requires.find(req => !prev[req]);
        if (unmet) {
          alert(`Este elemento requiere seleccionar primero: “${idToItem.get(unmet)?.label}”.`);
          return prev; // block selection
        }
      }

      // 2) Group logic (radio‑style)
      if (item.group && groupTypes[item.group] === 'single') {
        // Des‑seleccionar los demás elementos del grupo
        for (const peerId of groupIndex[item.group] ?? []) {
          next[peerId] = false;
        }
      }

      // 3) Toggle current item
      next[item.id] = willSelect;

      // 4) Disable rules (auto‑untick targets)
      if (willSelect && item.disables) {
        for (const dis of item.disables) next[dis] = false;
      }

      return next;
    });
  };

  const isDisabled = (itm: ChecklistItem): boolean => {
    // Disabled until all requirements are met
    return !!itm.requires?.find(req => !selected[req]);
  };

  return (
    <div className="space-y-4">
      {checklistSections.map(section => (
        <Fade key={section.id} cascade damping={0.13} triggerOnce>
          <h3 className="text-lg font-semibold text-gray-900">
            {section.label}
          </h3>
          <p className="text-sm text-gray-800">{section.description}</p>
          {/* List of included items */}
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
          {/* List of items */}
          <ul className="space-y-2 pl-2">
            {section.items.map(item => {
              const disabled = isDisabled(item);
              const groupSingle = item.group && groupTypes[item.group] === 'single';
              return (
                <li key={item.id} className="flex items-center gap-3">
                  <input
                    id={item.id}
                    type={groupSingle ? 'radio' : 'checkbox'}
                    name={groupSingle ? item.group : item.id}
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500 disabled:opacity-40"
                    checked={!!selected[item.id]}
                    disabled={disabled}
                    onChange={() => toggle(item)}
                  />
                  <label htmlFor={item.id} className="select-none text-gray-800">
                    {item.label}
                  </label>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </li>
              );
            })}
          </ul>
          <hr />
        </Fade>
      ))}
    </div>
  );
}
