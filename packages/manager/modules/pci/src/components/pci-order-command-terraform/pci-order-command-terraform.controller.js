export default class PciOrderCommandTerraformCtrl {
  $onInit() {
    this.checkApiData = () => {
      if (this.apiData.subnetId && this.apiData.networkId) {
        return `subnetId = "${this.apiData.subnetId}"
        networkId = "${this.apiData.networkId}"`;
      }
      return '';
    };

    this.addNodes = (nodesCount) => {
      const nodes = [];
      for (let i = 0; i < nodesCount; i += 1) {
        nodes.push(`nodes {
          region = "${this.model.region.name}"
          ${this.checkApiData()}
      }`);
      }
      return nodes;
    };

    this.terraformData = `resource "ovh_cloud_project_database" "${
      this.model.engine.name
    }" {
      service_name = "${this.projectId}"
      description = "${this.model.name}"
      engine = "${this.model.engine.name}"
      version = "${this.model.engine.selectedVersion.version}"
      plan = "${this.model.plan.name}"
      ${this.addNodes(this.model.plan.nodesCount).join('\n\t')}
      flavor = "${this.model.flavor.name}"
}`;
  }
}
