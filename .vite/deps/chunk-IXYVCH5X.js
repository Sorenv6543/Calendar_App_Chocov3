import {
  makeElevationProps,
  useElevation
} from "./chunk-L3T33GX2.js";
import {
  makeVariantProps
} from "./chunk-3D73P7BU.js";
import {
  makeBorderProps,
  useBorder
} from "./chunk-RPNO4C5U.js";
import {
  makeRoundedProps,
  useRounded
} from "./chunk-N35KUXQW.js";
import {
  makeDensityProps,
  useDensity
} from "./chunk-2ZYB6NOD.js";
import {
  makeTagProps
} from "./chunk-6EOBMBQ5.js";
import {
  makeThemeProps,
  provideTheme
} from "./chunk-J2EN7K23.js";
import {
  genericComponent,
  makeComponentProps,
  propsFactory,
  provideDefaults,
  useRender
} from "./chunk-XUWLGWIC.js";
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
//# sourceMappingURL=chunk-IXYVCH5X.js.map
