import {
  createLayout,
  makeLayoutProps
} from "./chunk-A3NQ477W.js";
import {
  useRtl
} from "./chunk-CTAOLQID.js";
import {
  makeThemeProps,
  provideTheme
} from "./chunk-PHPTPMQS.js";
import {
  genericComponent,
  makeComponentProps,
  propsFactory,
  useRender
} from "./chunk-PEHW3TFN.js";
import {
  createVNode
} from "./chunk-IJV5NOMV.js";

// node_modules/vuetify/lib/components/VApp/VApp.js
import "C:/Users/Soren/Desktop/Sites/Calendar_App_Chocov3/node_modules/vuetify/lib/components/VApp/VApp.css";
var makeVAppProps = propsFactory({
  ...makeComponentProps(),
  ...makeLayoutProps({
    fullHeight: true
  }),
  ...makeThemeProps()
}, "VApp");
var VApp = genericComponent()({
  name: "VApp",
  props: makeVAppProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const theme = provideTheme(props);
    const {
      layoutClasses,
      getLayoutItem,
      items,
      layoutRef
    } = createLayout(props);
    const {
      rtlClasses
    } = useRtl();
    useRender(() => {
      var _a;
      return createVNode("div", {
        "ref": layoutRef,
        "class": ["v-application", theme.themeClasses.value, layoutClasses.value, rtlClasses.value, props.class],
        "style": [props.style]
      }, [createVNode("div", {
        "class": "v-application__wrap"
      }, [(_a = slots.default) == null ? void 0 : _a.call(slots)])]);
    });
    return {
      getLayoutItem,
      items,
      theme
    };
  }
});

export {
  VApp
};
//# sourceMappingURL=chunk-MFB34THK.js.map
