import { env } from './config/index';
import { DefaultAzureCredential } from '@azure/identity';
import { ContainerInstanceManagementClient } from '@azure/arm-containerinstance';
import { Options } from './interfaces/options';
const subscriptionId: string = env.AZURE_SUBSCRIPTION_ID;

/**
 * Clase para crear y eliminar instancias de contenedor.
 * Requiere las siguientes variables de entorno
 * @envirment AZURE_SUBSCRIPTION_ID
 * @envirment AZURE_CLIENT_ID
 * @envirment AZURE_TENANT_ID
 * @envirment AZURE_CLIENT_SECRET
 */
export class ContainerInstance {
    private _creds = new DefaultAzureCredential();
    private _client = new ContainerInstanceManagementClient(this._creds, subscriptionId);

    ContainerInstance() {
    }

    /**
     * Esta función obtine todos los grupos de contenedores 
     * Existentes en el repositorio
     */
    getAllCI = async () => {
        try {
            const response = await this._client.containerGroups.list();
            return response;
        } catch (error) {
            console.log('An error occurred:');
            console.error(error);
        }
    };

    /**
     * Crear nueva instancia de contenedor.
     * @param resourceGroup - Nombre del grupo de recursos.
     * @param containerName - Nombre para crear la instancia del contenedor.
     * @param containerImage - Nombre de la imagen a instancear, ejemplo: `macrtest.azurecr.io/maac-backend:v0.0.2`.
     * @param options  
     */
    createCI = async (
        resourceGroup: string,
        containerName: string,
        containerImage: string,
        options?: Options
    ) => {
        try {
            console.log('Creating container');
            const response = await this._client.containerGroups.beginCreateOrUpdate(resourceGroup, containerName, {
                name: containerName,
                location: 'southcentralus',
                containers: [{
                    name: containerName,
                    image: containerImage,
                    ports: options?.ports || [
                        {
                            protocol: 'TCP',
                            port: 80
                        }
                    ],
                    environmentVariables: options?.environmentVariables || [
                        {
                            name: 'PORT',
                            value: '80'
                        }
                    ],
                    resources: {
                        requests: options?.requests || {
                            memoryInGB: 1,
                            cpu: 1
                        }
                    }
                }],
                imageRegistryCredentials: [
                    {
                        server: env.CONTAINER_SERVER,
                        username: env.CONTAINER_USER,
                        password: env.CONTAINER_PASS,
                    }
                ],
                ipAddress: {
                    ports: options?.ports || [
                        {
                            protocol: 'TCP',
                            port: 80
                        }
                    ],
                    type: 'Public',
                    dnsNameLabel: containerName,
                    fqdn: `${ containerName }.southcentralus.azurecontainer.io`,
                },
                osType: 'Linux',
                sku: 'Standard',
                initContainers: []
            });
            console.log('Container created');
            return response;
        } catch (error) {
            console.log(error);
        }
    };

    /**
     * Eliminar una instancia de contenedor.
     * @param resourceGroup - Nombre del grupo de recursos.
     * @param containerName - Nombre para crear la instancia del contenedor.
     */
    deleteCI = async (resourceGroup: string, containerName: string) => {
        try {
            const response = await this._client.containerGroups.deleteMethod(resourceGroup, containerName);
            return response;
        } catch (error) {
            console.log(error);
        }
    };

}