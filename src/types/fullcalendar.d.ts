declare module '@fullcalendar/vue3' {
  import { DefineComponent } from 'vue';
  const FullCalendar: DefineComponent;
  export default FullCalendar;
}

declare module '@fullcalendar/daygrid' {
  const plugin: any;
  export default plugin;
}

declare module '@fullcalendar/timegrid' {
  const plugin: any;
  export default plugin;
}

declare module '@fullcalendar/interaction' {
  const plugin: any;
  export default plugin;
  export interface EventResizeDoneArg {
    event: {
      id: string;
      start: Date | null;
      end: Date | null;
    };
  }
  export interface EventDropArg {
    event: {
      id: string;
      start: Date | null;
      end: Date | null;
    };
    revert: () => void;
  }
}

declare module '@fullcalendar/core/index.js' {
  export interface DateSelectArg {
    startStr: string;
  }
  export interface EventClickArg {
    event: {
      id: string;
      title: string;
      startStr: string;
      endStr: string;
      start: Date;
      end: Date | null;
      toPlainObject: (options: { collapseExtendedProps: boolean }) => any;
    };
  }
  export interface EventSourceFuncArg {
    start: Date;
    end: Date;
  }
} 