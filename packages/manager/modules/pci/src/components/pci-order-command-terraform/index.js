import angular from 'angular';
import '@ovh-ux/ui-kit';

import component from './pci-order-command-terraform.component';

const moduleName = 'ovhManagerPciOrderCommandTerraform';

angular
  .module(moduleName, ['oui'])
  .component('pciOrderCommandTerraform', component);

export default moduleName;
