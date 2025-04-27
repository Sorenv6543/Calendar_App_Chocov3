declare module "@/components/ui/TimePicker.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{
    modelValue: string;
    isVisible: boolean;
  }>;
  export default component;
}
