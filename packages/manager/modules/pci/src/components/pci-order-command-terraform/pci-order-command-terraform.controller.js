export default class PciOrderCommandTerraformCtrl {
  $onInit() {
    this.identationString = '  ';
    this.terraformDisplay = this.formatTerraformNode(this.terraformData);
  }

  formatTerraformNode(node, ident = 0) {
    let keyStr = '';
    // handle key value
    if (node.key === 'resource') {
      keyStr = `${node.key} ${node.values
        .map((value) => `"${value}"`)
        .join(' ')}`;
    } else if (node.values.length > 0) {
      keyStr = `${node.key} = ${node.values
        .map((value) => `"${value}"`)
        .join(' ')}`;
    } else {
      keyStr = `${node.key}`;
    }
    // handle sub nodes
    if (node.nodes.length > 0) {
      return `${this.getIdentationString(ident)}${keyStr} { 
${node.nodes
  .map((subnode) => `${this.formatTerraformNode(subnode, ident + 1)}`)
  .join(`\r\n`)}
${this.getIdentationString(ident)}}`;
    }
    return `${this.getIdentationString(ident)}${keyStr}`;
  }

  getIdentationString(ident) {
    let identationStr = '';
    for (let i = 0; i < ident; i += 1) {
      identationStr += this.identationString;
    }
    return identationStr;
  }
}
