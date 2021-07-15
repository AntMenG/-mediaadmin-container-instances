import { ContainerPort, EnvironmentVariable, ResourceRequests } from "@azure/arm-containerinstance/esm/models";
export interface Options {
    ports?: ContainerPort[];
    environmentVariables?: EnvironmentVariable[];
    requests?: ResourceRequests;
}
export interface Port {
    protocol: string;
    port: number;
}
