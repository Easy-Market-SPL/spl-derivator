export type GroupType = 'single' | 'multi';

export interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  requires?: string[];
  disables?: string[];
  group?: string;
}

export interface ChecklistSection {
  id: string;
  label: string;
  description: string;
  included: string[];
  items: ChecklistItem[];
}

/**
 * Map of logical groups.  `single` → radio‑button behaviour (aka «alternative» in
 * the feature model).  `multi`   → normal checkbox list.
 */
export const groupTypes: Record<string, GroupType> = {
  'tracking-mode': 'single'
};

export const checklistSections: ChecklistSection[] = [
  {
    id: 'gui',
    label: 'Dispositivos de usuario',
    description: 'Selecciona los dispositivos desde los cuales los usuarios accederán a la aplicación.',
    included: [],
    items: [
      {
        id: 'gui-web',
        label: 'Acceso web',
        description: 'Permite a los usuarios ingresar y utilizar la aplicación desde cualquier navegador web moderno.'
      },
      {
        id: 'gui-mobile',
        label: 'Acceso móvil',
        description: 'Permite a los usuarios acceder a la aplicación desde dispositivos móviles, optimizando la experiencia en pantallas pequeñas.'
      }
    ]
  },
  {
    id: 'user-management',
    label: 'Gestión de usuarios',
    description: 'Funcionalidades para administrar usuarios, controlar accesos y definir roles dentro de la aplicación.',
    included: ['Autenticación por correo electrónico', 'Registro de nuevos usuarios', 'Gestión de roles y permisos'],
    items: [
      {
        id: 'auth-third',
        label: 'Autenticación con terceros',
        description: 'Permite iniciar sesión mediante proveedores externos (Google), facilitando el acceso a los usuarios.'
      }
    ]
  },
  {
    id: 'catalog',
    label: 'Catálogo',
    description: 'Módulo para administrar y visualizar productos y servicios disponibles en la plataforma.',
    included: ['Búsqueda avanzada de productos', 'Filtrado dinámico por categorías y atributos'],
    items: []
  },
  {
    id: 'orders',
    label: 'Seguimiento de órdenes',
    description: 'Opciones para monitorizar el estado y progreso de las órdenes realizadas, elige entre seguimiento por estados o en tiempo real.',
    included: [],
    items: [
      {
        id: 'tracking-state',
        label: 'Seguimiento por estados',
        group: 'tracking-mode',
        description: 'Visualización del estado de la orden en etapas clave, como preparación, envío y entrega.'
      },
      {
        id: 'realtime-track',
        label: 'Seguimiento en tiempo real',
        group: 'tracking-mode',
        requires: ['gui-mobile'],
        description: 'Permite rastrear el movimiento de los domiciliarios y órdenes en tiempo real, mostrando su ubicación en un mapa interactivo.'
      },
      {
        id: 'notifications',
        label: 'Notificaciones',
        description: 'Envía alertas automáticas a los usuarios sobre cambios en el estado de sus órdenes, manteniéndolos informados.'
      }
    ]
  },
  {
    id: 'payments',
    label: 'Registro de pagos',
    description: 'Gestión de métodos y registros de pagos realizados por los usuarios.',
    included: [],
    items: [
      {
        id: 'payments-card',
        label: 'Pago con tarjeta',
        group: 'payment-method',
        description: 'Permite realizar transacciones mediante tarjetas de crédito o débito, integrando pasarelas de pago seguras.'
      },
      {
        id: 'payments-cash',
        label: 'Pago en efectivo',
        group: 'payment-method',
        requires: ['realtime-track'],
        description: 'Opción para que los usuarios paguen en efectivo al momento de la entrega, requiriendo seguimiento en tiempo real.'
      }
    ]
  },
  {
    id: 'support',
    label: 'Soporte y retroalimentación',
    description: 'Herramientas para asistencia al usuario y recopilación de opiniones sobre la aplicación.',
    included: [],
    items: [
      {
        id: 'support-chat',
        label: 'Chat de soporte',
        description: 'Canal de comunicación directa para que los usuarios reciban ayuda y asistencia en tiempo real.'
      },
      {
        id: 'support-rating',
        label: 'Calificaciones y reseñas',
        description: 'Funcionalidad que permite a los usuarios valorar la aplicación y dejar comentarios que ayuden a mejorar el servicio.'
      }
    ]
  }
];
