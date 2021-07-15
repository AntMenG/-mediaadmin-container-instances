import { Options } from './interfaces/options';
/**
 * Clase para crear y eliminar instancias de contenedor.
 * Requiere las siguientes variables de entorno
 * @envirment AZURE_SUBSCRIPTION_ID
 * @envirment AZURE_CLIENT_ID
 * @envirment AZURE_TENANT_ID
 * @envirment AZURE_CLIENT_SECRET
 */
export declare class ContainerInstance {
    private _creds;
    private _client;
    ContainerInstance(): void;
    /**
     * Esta función obtine todos los grupos de contenedores
     * Existentes en el repositorio
     */
    getAllCI: () => Promise<import("@azure/arm-containerinstance/esm/models").ContainerGroupsListResponse | undefined>;
    /**
     * Crear nueva instancia de contenedor.
     * @param resourceGroup - Nombre del grupo de recursos.
     * @param containerName - Nombre para crear la instancia del contenedor.
     * @param containerImage - Nombre de la imagen a instancear, ejemplo: `macrtest.azurecr.io/maac-backend:v0.0.2`.
     * @param options
     */
    createCI: (resourceGroup: string, containerName: string, containerImage: string, options?: Options | undefined) => Promise<import("@azure/ms-rest-azure-js").LROPoller | undefined>;
    /**
     * Eliminar una instancia de contenedor.
     * @param resourceGroup - Nombre del grupo de recursos.
     * @param containerName - Nombre para crear la instancia del contenedor.
     */
    deleteCI: (resourceGroup: string, containerName: string) => Promise<import("@azure/arm-containerinstance/esm/models").ContainerGroupsDeleteMethodResponse | undefined>;
}
