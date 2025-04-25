import {
  VImg
} from "./chunk-FE3XAPOH.js";
import {
  VIcon,
  makeSizeProps,
  useSize
} from "./chunk-MDOMMZER.js";
import {
  VDefaultsProvider
} from "./chunk-EL5M5IWV.js";
import {
  genOverlays,
  makeVariantProps,
  useVariant
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
  IconValue
} from "./chunk-YMX75DDC.js";
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

// node_modules/vuetify/lib/components/VAvatar/VAvatar.js
import "C:/Users/Soren/Desktop/Sites/Calendar_App_Chocov3/node_modules/vuetify/lib/components/VAvatar/VAvatar.css";
var makeVAvatarProps = propsFactory({
  start: Boolean,
  end: Boolean,
  icon: IconValue,
  image: String,
  text: String,
  ...makeBorderProps(),
  ...makeComponentProps(),
  ...makeDensityProps(),
  ...makeRoundedProps(),
  ...makeSizeProps(),
  ...makeTagProps(),
  ...makeThemeProps(),
  ...makeVariantProps({
    variant: "flat"
  })
}, "VAvatar");
var VAvatar = genericComponent()({
  name: "VAvatar",
  props: makeVAvatarProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      themeClasses
    } = provideTheme(props);
    const {
      borderClasses
    } = useBorder(props);
    const {
      colorClasses,
      colorStyles,
      variantClasses
    } = useVariant(props);
    const {
      densityClasses
    } = useDensity(props);
    const {
      roundedClasses
    } = useRounded(props);
    const {
      sizeClasses,
      sizeStyles
    } = useSize(props);
    useRender(() => createVNode(props.tag, {
      "class": ["v-avatar", {
        "v-avatar--start": props.start,
        "v-avatar--end": props.end
      }, themeClasses.value, borderClasses.value, colorClasses.value, densityClasses.value, roundedClasses.value, sizeClasses.value, variantClasses.value, props.class],
      "style": [colorStyles.value, sizeStyles.value, props.style]
    }, {
      default: () => [!slots.default ? props.image ? createVNode(VImg, {
        "key": "image",
        "src": props.image,
        "alt": "",
        "cover": true
      }, null) : props.icon ? createVNode(VIcon, {
        "key": "icon",
        "icon": props.icon
      }, null) : props.text : createVNode(VDefaultsProvider, {
        "key": "content-defaults",
        "defaults": {
          VImg: {
            cover: true,
            src: props.image
          },
          VIcon: {
            icon: props.icon
          }
        }
      }, {
        default: () => [slots.default()]
      }), genOverlays(false, "v-avatar")]
    }));
    return {};
  }
});

export {
  VAvatar
};
//# sourceMappingURL=chunk-IYN4JQ4K.js.map
