import {
  makeElevationProps,
  useElevation
} from "./chunk-ELZPCHRC.js";
import {
  makeVariantProps
} from "./chunk-PHWU6B2Z.js";
import {
  makeBorderProps,
  useBorder
} from "./chunk-KZL7KHKC.js";
import {
  makeRoundedProps,
  useRounded
} from "./chunk-VXAYSNMO.js";
import {
  makeDensityProps,
  useDensity
} from "./chunk-7KKGZLDQ.js";
import {
  makeTagProps
} from "./chunk-NE4ZOCUR.js";
import {
  makeThemeProps,
  provideTheme
} from "./chunk-PHPTPMQS.js";
import {
  genericComponent,
  makeComponentProps,
  propsFactory,
  provideDefaults,
  useRender
} from "./chunk-PEHW3TFN.js";
import {
  createVNode,
  toRef
} from "./chunk-IJV5NOMV.js";

// node_modules/vuetify/lib/components/VBtnGroup/VBtnGroup.js
import "C:/Users/Soren/Desktop/Sites/Calendar_App_Chocov3/node_modules/vuetify/lib/components/VBtnGroup/VBtnGroup.css";
var makeVBtnGroupProps = propsFactory({
  baseColor: String,
  divided: Boolean,
  ...makeBorderProps(),
  ...makeComponentProps(),
  ...makeDensityProps(),
  ...makeElevationProps(),
  ...makeRoundedProps(),
  ...makeTagProps(),
  ...makeThemeProps(),
  ...makeVariantProps()
}, "VBtnGroup");
var VBtnGroup = genericComponent()({
  name: "VBtnGroup",
  props: makeVBtnGroupProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      themeClasses
    } = provideTheme(props);
    const {
      densityClasses
    } = useDensity(props);
    const {
      borderClasses
    } = useBorder(props);
    const {
      elevationClasses
    } = useElevation(props);
    const {
      roundedClasses
    } = useRounded(props);
    provideDefaults({
      VBtn: {
        height: "auto",
        baseColor: toRef(props, "baseColor"),
        color: toRef(props, "color"),
        density: toRef(props, "density"),
        flat: true,
        variant: toRef(props, "variant")
      }
    });
    useRender(() => {
      return createVNode(props.tag, {
        "class": ["v-btn-group", {
          "v-btn-group--divided": props.divided
        }, themeClasses.value, borderClasses.value, densityClasses.value, elevationClasses.value, roundedClasses.value, props.class],
        "style": props.style
      }, slots);
    });
  }
});

export {
  makeVBtnGroupProps,
  VBtnGroup
};
//# sourceMappingURL=chunk-5LUMSYQB.js.map
