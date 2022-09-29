import find from 'lodash/find';
import { getCriteria } from '../../project.utils';

import { OBJECT_CONTAINER_OFFERS_TYPES } from './containers.constants';

export default class PciStoragesContainersController {
  /* @ngInject */
  constructor(
    $translate,
    $http,
    CucCloudMessage,
    PciProjectStorageContainersService,
  ) {
    this.$translate = $translate;
    this.$http = $http;
    this.CucCloudMessage = CucCloudMessage;
    this.publicToggleLoading = false;
    this.OBJECT_CONTAINER_OFFERS_TYPES = OBJECT_CONTAINER_OFFERS_TYPES;
    this.PciProjectStorageContainersService = PciProjectStorageContainersService;
  }

  $onInit() {
    this.loadMessages();
    this.criteria = getCriteria('id', this.containerId);
    this.publicToggleLoading = false;
    this.hasHighPerformanceStorage = this.hasHighPerformanceStorage();
    this.columnsParameters = [
      {
        name: 'id',
        hidden: !this.archive,
      },
      {
        name: 'state',
        hidden: !this.archive,
      },
    ];
    this.setContainerLoadingErrors();
  }

  onPublicToggle(container) {
    this.loadingContainer = container.id;
    return this.PciProjectStorageContainersService.toggleContainerState(
      this.projectId,
      container,
    )
      .then(() =>
        this.CucCloudMessage.success(
          this.$translate.instant(
            container.state
              ? 'pci_projects_project_storages_containers_toggle_private_succeed'
              : 'pci_projects_project_storages_containers_toggle_public_succeed',
            { name: container.name },
          ),
          'pci.projects.project.storages.containers.container',
        ),
      )
      .catch((error) =>
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_storages_containers_toggle_fail',
            { message: error.data?.message },
          ),
          'pci.projects.project.storages.containers.container',
        ),
      )
      .finally(() => {
        this.loadingContainer = null;
      });
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.storages.containers.container',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  hasHighPerformanceStorage() {
    return find(this.containers, { isHighPerfStorage: true });
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  isSwiftType(container) {
    return !this.archive && !container.s3StorageType;
  }

  setContainerLoadingErrors() {
    const s3RegionsInError = [];
    this.containersResponseObj.errors.forEach((error) => {
      if (error.type === 'swift') {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_storages_containers_swift_containers_load_error',
          ),
          'pci.projects.project.storages.containers',
        );
      }
      if (
        error.type === 'storage-s3-high-perf' ||
        error.type === 'storage-s3-standard'
      ) {
        s3RegionsInError.push(error.region);
      }
    });
    if (s3RegionsInError.length > 0) {
      this.CucCloudMessage.error(
        this.$translate.instant(
          'pci_projects_project_storages_containers_s3_containers_load_error',
          { regions: s3RegionsInError.join(',') },
        ),
        'pci.projects.project.storages.containers',
      );
    }
  }
}
