import controller from './pci-order-command-terraform.controller';
import template from './pci-order-command-terraform.html';

export default {
  bindings: {
    apiData: '<',
    model: '<',
    projectId: '<',
  },
  controller,
  template,
};
