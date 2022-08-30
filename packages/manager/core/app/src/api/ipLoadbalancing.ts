export enum SslConfigurationEnum {
  INTERMEDIATE = 'intermediate',
  MODERN = 'modern',
}

export enum IpStateEnum {
  BLACKLISTED = 'blacklisted',
  DELETED = 'deleted',
  FREE = 'free',
  OK = 'ok',
  QUARANTINED = 'quarantined',
  SUSPENDED = 'suspended',
}

export type IpLoadBalancing = {
  displayName?: string;
  ipLoadbalancing: string;
  ipv4?: string;
  ipv6?: string;
  metricsToken?: string;
  offer?: string;
  orderableZone: {
    name: string;
    planCode: string;
  }[];
  serviceName: string;
  sslConfiguration?: SslConfigurationEnum;
  state: IpStateEnum;
  vrackEligibility: boolean;
  vrackName?: string;
  zone: string[];
};

export async function getIpLoadBalancing(
  serviceName: string,
): Promise<IpLoadBalancing> {
  const response = await fetch(`/engine/api/ipLoadbalancing/${serviceName}`);
  return response.json();
}

export default IpLoadBalancing;
