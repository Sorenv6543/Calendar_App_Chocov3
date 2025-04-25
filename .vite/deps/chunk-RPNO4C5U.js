import {
  getCurrentInstanceName,
  propsFactory
} from "./chunk-XUWLGWIC.js";
import {
  computed,
  isRef
} from "./chunk-IJV5NOMV.js";

// node_modules/vuetify/lib/composables/border.js
var makeBorderProps = propsFactory({
  border: [Boolean, Number, String]
}, "border");
function useBorder(props) {
  let name = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : getCurrentInstanceName();
  const borderClasses = computed(() => {
    const border = isRef(props) ? props.value : props.border;
    const classes = [];
    if (border === true || border === "") {
      classes.push(`${name}--border`);
    } else if (typeof border === "string" || border === 0) {
      for (const value of String(border).split(" ")) {
        classes.push(`border-${value}`);
      }
    }
    return classes;
  });
  return {
    borderClasses
  };
}

export {
  makeBorderProps,
  useBorder
};
//# sourceMappingURL=chunk-RPNO4C5U.js.map
