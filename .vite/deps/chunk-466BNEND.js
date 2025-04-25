import {
  computed,
  onMounted,
  readonly,
  shallowRef
} from "./chunk-IJV5NOMV.js";

// node_modules/vuetify/lib/composables/ssrBoot.js
function useSsrBoot() {
  const isBooted = shallowRef(false);
  onMounted(() => {
    window.requestAnimationFrame(() => {
      isBooted.value = true;
    });
  });
  const ssrBootStyles = computed(() => !isBooted.value ? {
    transition: "none !important"
  } : void 0);
  return {
    ssrBootStyles,
    isBooted: readonly(isBooted)
  };
}

export {
  useSsrBoot
};
//# sourceMappingURL=chunk-466BNEND.js.map
