import {
  makePositionProps,
  usePosition
} from "./chunk-ZTHZNQID.js";
import {
  makeLocationProps,
  useLocation
} from "./chunk-IJDFSMSA.js";
import {
  VDefaultsProvider
} from "./chunk-EL5M5IWV.js";
import {
  makeElevationProps,
  useElevation
} from "./chunk-ELZPCHRC.js";
import {
  makeBorderProps,
  useBorder
} from "./chunk-KZL7KHKC.js";
import {
  makeRoundedProps,
  useRounded
} from "./chunk-VXAYSNMO.js";
import {
  makeTagProps
} from "./chunk-NE4ZOCUR.js";
import {
  makeDimensionProps,
  useDimension
} from "./chunk-KBKAXBT7.js";
import {
  useBackgroundColor
} from "./chunk-22QRPJEJ.js";
import {
  makeThemeProps,
  provideTheme
} from "./chunk-PHPTPMQS.js";
import {
  createSimpleFunctional,
  genericComponent,
  makeComponentProps,
  propsFactory,
  useRender
} from "./chunk-PEHW3TFN.js";
import {
  createVNode,
  mergeProps,
  toRef
} from "./chunk-IJV5NOMV.js";

// node_modules/vuetify/lib/components/VSheet/VSheet.js
import "C:/Users/Soren/Desktop/Sites/Calendar_App_Chocov3/node_modules/vuetify/lib/components/VSheet/VSheet.css";
var makeVSheetProps = propsFactory({
  color: String,
  ...makeBorderProps(),
  ...makeComponentProps(),
  ...makeDimensionProps(),
  ...makeElevationProps(),
  ...makeLocationProps(),
  ...makePositionProps(),
  ...makeRoundedProps(),
  ...makeTagProps(),
  ...makeThemeProps()
}, "VSheet");
var VSheet = genericComponent()({
  name: "VSheet",
  props: makeVSheetProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      themeClasses
    } = provideTheme(props);
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(toRef(props, "color"));
    const {
      borderClasses
    } = useBorder(props);
    const {
      dimensionStyles
    } = useDimension(props);
    const {
      elevationClasses
    } = useElevation(props);
    const {
      locationStyles
    } = useLocation(props);
    const {
      positionClasses
    } = usePosition(props);
    const {
      roundedClasses
    } = useRounded(props);
    useRender(() => createVNode(props.tag, {
      "class": ["v-sheet", themeClasses.value, backgroundColorClasses.value, borderClasses.value, elevationClasses.value, positionClasses.value, roundedClasses.value, props.class],
      "style": [backgroundColorStyles.value, dimensionStyles.value, locationStyles.value, props.style]
    }, slots));
    return {};
  }
});

// node_modules/vuetify/lib/labs/VPicker/VPicker.js
import "C:/Users/Soren/Desktop/Sites/Calendar_App_Chocov3/node_modules/vuetify/lib/labs/VPicker/VPicker.css";

// node_modules/vuetify/lib/labs/VPicker/VPickerTitle.js
var VPickerTitle = createSimpleFunctional("v-picker-title");

// node_modules/vuetify/lib/labs/VPicker/VPicker.js
var makeVPickerProps = propsFactory({
  bgColor: String,
  divided: Boolean,
  landscape: Boolean,
  title: String,
  hideHeader: Boolean,
  ...makeVSheetProps()
}, "VPicker");
var VPicker = genericComponent()({
  name: "VPicker",
  props: makeVPickerProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(toRef(props, "color"));
    useRender(() => {
      const sheetProps = VSheet.filterProps(props);
      const hasTitle = !!(props.title || slots.title);
      return createVNode(VSheet, mergeProps(sheetProps, {
        "color": props.bgColor,
        "class": ["v-picker", {
          "v-picker--divided": props.divided,
          "v-picker--landscape": props.landscape,
          "v-picker--with-actions": !!slots.actions
        }, props.class],
        "style": props.style
      }), {
        default: () => {
          var _a;
          return [!props.hideHeader && createVNode("div", {
            "key": "header",
            "class": [backgroundColorClasses.value],
            "style": [backgroundColorStyles.value]
          }, [hasTitle && createVNode(VPickerTitle, {
            "key": "picker-title"
          }, {
            default: () => {
              var _a2;
              return [((_a2 = slots.title) == null ? void 0 : _a2.call(slots)) ?? props.title];
            }
          }), slots.header && createVNode("div", {
            "class": "v-picker__header"
          }, [slots.header()])]), createVNode("div", {
            "class": "v-picker__body"
          }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]), slots.actions && createVNode(VDefaultsProvider, {
            "defaults": {
              VBtn: {
                slim: true,
                variant: "text"
              }
            }
          }, {
            default: () => [createVNode("div", {
              "class": "v-picker__actions"
            }, [slots.actions()])]
          })];
        }
      });
    });
    return {};
  }
});

export {
  makeVSheetProps,
  VSheet,
  makeVPickerProps,
  VPicker
};
//# sourceMappingURL=chunk-QLYPS4WY.js.map
