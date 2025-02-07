import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import template from './template.html';
import { FEATURES } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp', {
    url: '/netapp',
    template,
    redirectTo: 'netapp.index',
    resolve: {
      features: /* @ngInject */ (ovhFeatureFlipping) => {
        const features = FEATURES.map((feature) => `netapp:${feature}`);
        return ovhFeatureFlipping.checkFeatureAvailability(features);
      },
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('netapp_title'),
    },
  });

  $stateProvider.state('netapp.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    views: {
      netappContainer: {
        component: 'managerListLayout',
      },
    },
    params: ListLayoutHelper.stateParams,
    redirectTo: (transition) =>
      Promise.all([
        transition.injector().getAsync('resources'),
        transition.injector().getAsync('features'),
      ]).then(([services, features]) =>
        services.data.length === 0 &&
        features.isFeatureAvailable('netapp:order')
          ? {
              state: 'netapp.onboarding',
            }
          : false,
      ),
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '/storage/netapp',
      dataModel: () => 'storage.NetAppService',
      defaultFilterColumn: () => 'id',
      header: () => 'Enterprise File Storage',
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({ id }) =>
        $state.href('netapp.dashboard', {
          serviceName: id,
        }),
      schema: /* @ngInject */ ($http) =>
        $http.get('/storage.json').then(({ data }) => data),

      /**
       * Used into ngLayoutHelper to customize datagrid columns name
       */
      customizeColumnsMap: /* @ngInject */ ($translate, configuration) => {
        return configuration.data.reduce(
          (columnsMap, { property }) => ({
            ...columnsMap,
            [property]: {
              title: $translate.instant(
                `netapp_list_columns_header_${property}`,
              ),
            },
          }),
          {},
        );
      },

      /**
       * Used into ngLayoutHelper to define datagrid Topbar CTA
       */
      topbarOptions: /* @ngInject */ ($translate, goToOrder) => ({
        cta: {
          type: 'button',
          displayed: true,
          disabled: false,
          label: $translate.instant('netapp_order_cta_label'),
          value: $translate.instant('netapp_order_cta_value'),
          onClick: () => {
            goToOrder();
          },
        },
      }),

      goToOrder: /* @ngInject */ ($state, atInternet) => () => {
        atInternet.trackClick({
          type: 'action',
          name: `netapp::create`,
        });

        return $state.go('netapp.order');
      },

      hideBreadcrumb: () => true,
    },
  });
};
