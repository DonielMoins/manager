import { EOL_LV1_LV2_SERVICES_LINK_INFO } from './constants';

export default class EolLv1Lv2ServicesBannerController {
  constructor(coreConfig) {
    this.eolLv1Lv2ServicesInfoLink =
      EOL_LV1_LV2_SERVICES_LINK_INFO[coreConfig.getUser().ovhSubsidiary] ||
      EOL_LV1_LV2_SERVICES_LINK_INFO.DEFAULT;
  }
}
