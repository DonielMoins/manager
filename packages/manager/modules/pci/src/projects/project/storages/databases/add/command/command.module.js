import angular from 'angular';

import component from './command.component';
import routing from './command.routing';
import orderReview from '../../components/order-review';
import pciOrderCommandTerraform from '../../../../../../components/pci-order-command-terraform';

const moduleName = 'ovhManagerPciStoragesDatabasesAddCommand';

angular
  .module(moduleName, [orderReview, pciOrderCommandTerraform])
  .config(routing)
  .component('ovhManagerPciProjectDatabasesAddCommand', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
