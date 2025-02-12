import { RENEW_URL, SERVICE_TYPE } from './service-actions.constants';

export default class ServicesActionsCtrl {
  /* @ngInject */
  constructor($injector, $q, atInternet, coreConfig, coreURLBuilder) {
    this.$injector = $injector;
    this.$q = $q;
    this.atInternet = atInternet;
    this.coreURLBuilder = coreURLBuilder;
    this.coreConfig = coreConfig;
    this.billingLink = this.coreURLBuilder.buildURL(
      'dedicated',
      '#/billing/history',
    );

    this.SERVICE_TYPE = SERVICE_TYPE;
    this.isLoading = true;
  }

  $onInit() {
    let fetchAutoRenewLink = this.$q.when();
    if (!this.billingManagementAvailability) {
      this.autorenewLink = null;
    } else if (this.$injector.has('shellClient')) {
      fetchAutoRenewLink = this.$injector
        .get('shellClient')
        .navigation.getURL('dedicated', '#/billing/autorenew')
        .then((url) => {
          this.autorenewLink = url;
        });
    } else {
      this.autorenewLink = this.coreURLBuilder.buildURL(
        'dedicated',
        '#/billing/autorenew',
      );
    }
    return fetchAutoRenewLink.finally(() => {
      this.isLoading = false;
      this.initLinks();
    });
  }

  initLinks() {
    const serviceTypeParam = this.service.serviceType
      ? `&serviceType=${this.service.serviceType}`
      : '';
    this.user = this.coreConfig.getUser();

    this.commitmentLink =
      (this.getCommitmentLink && this.getCommitmentLink(this.service)) ||
      `${this.autorenewLink}/${this.service.id}/commitment`;
    this.cancelCommitmentLink =
      (this.getCancelCommitmentLink &&
        this.getCancelCommitmentLink(this.service)) ||
      `${this.autorenewLink}/${this.service.id}/cancel-commitment`;
    this.cancelResiliationLink =
      (this.getCancelResiliationLink && this.getCancelResiliationLink()) ||
      `${this.autorenewLink}/cancel-resiliation?serviceId=${this.service.serviceId}${serviceTypeParam}`;

    this.warningLink = `${this.autorenewLink}/warn-nic?nic=${this.service.contactBilling}`;
    this.updateLink = `${this.autorenewLink}/update?serviceId=${this.service.serviceId}${serviceTypeParam}`;
    this.deleteLink =
      this.service.serviceType &&
      `${this.autorenewLink}/delete-${this.service.serviceType
        .replace(/_/g, '-')
        .toLowerCase()}?serviceId=${this.service.serviceId}`;

    const resiliationByEndRuleLink =
      (this.getResiliationLink && this.getResiliationLink()) ||
      `${this.autorenewLink}/resiliation?serviceId=${this.service.id}&serviceName=${this.service.serviceId}${serviceTypeParam}`;

    switch (this.service.serviceType) {
      case SERVICE_TYPE.EXCHANGE:
        this.resiliateLink = `${this.service.url}?action=resiliate`;
        this.renewLink = `${this.service.url}?tab=ACCOUNT`;
        break;
      case SERVICE_TYPE.EMAIL_DOMAIN:
        this.resiliateLink = `${this.autorenewLink}/delete-email?serviceId=${this.service.serviceId}&name=${this.service.domain}`;
        this.cancelResiliationLink = null;
        break;
      case SERVICE_TYPE.SMS:
        this.buyingLink = this.coreURLBuilder.buildURL(
          'telecom',
          '#/sms/:serviceName/order',
          {
            serviceName: this.service.serviceId,
          },
        );
        this.renewLink = this.coreURLBuilder.buildURL(
          'telecom',
          '#/sms/:serviceName/options/recredit',
          { serviceName: this.service.serviceId },
        );
        break;
      case SERVICE_TYPE.ALL_DOM:
        this.resiliateLink = this.service.canResiliateByEndRule()
          ? resiliationByEndRuleLink
          : `${this.autorenewLink}/delete-all-dom?serviceId=${this.service.serviceId}&serviceType=${this.service.serviceType}`;
        break;
      default:
        this.resiliateLink = this.service.canResiliateByEndRule()
          ? resiliationByEndRuleLink
          : this.autorenewLink &&
            `${this.autorenewLink}/delete?serviceId=${this.service.serviceId}${serviceTypeParam}`;
        break;
    }
  }

  getRenewUrl() {
    return `${RENEW_URL[this.user.ovhSubsidiary] || RENEW_URL.default}${
      this.service.serviceId
    }`;
  }

  getExchangeBilling() {
    if (/\/service\//.test(this.service.serviceId)) {
      const [organization, exchangeName] = this.service.serviceId.split(
        '/service/',
      );
      return `${this.autorenewLink}/exchange?organization=${organization}&exchangeName=${exchangeName}`;
    }
    return `${this.autorenewLink}/exchange?organization=${this.service.serviceId}&exchangeName=${this.service.serviceId}`;
  }

  trackAction(action) {
    if (this.trackingPrefix) {
      this.atInternet.trackClick({
        name: `${this.trackingPrefix}::action::${action}`,
        type: 'action',
      });
    }
  }
}
