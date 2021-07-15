"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerInstance = void 0;
const index_1 = require("./config/index");
const identity_1 = require("@azure/identity");
const arm_containerinstance_1 = require("@azure/arm-containerinstance");
const subscriptionId = index_1.env.AZURE_SUBSCRIPTION_ID;
/**
 * Clase para crear y eliminar instancias de contenedor.
 * Requiere las siguientes variables de entorno
 * @envirment AZURE_SUBSCRIPTION_ID
 * @envirment AZURE_CLIENT_ID
 * @envirment AZURE_TENANT_ID
 * @envirment AZURE_CLIENT_SECRET
 */
class ContainerInstance {
    constructor() {
        this._creds = new identity_1.DefaultAzureCredential();
        this._client = new arm_containerinstance_1.ContainerInstanceManagementClient(this._creds, subscriptionId);
        /**
         * Esta función obtine todos los grupos de contenedores
         * Existentes en el repositorio
         */
        this.getAllCI = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._client.containerGroups.list();
                return response;
            }
            catch (error) {
                console.log('An error occurred:');
                console.error(error);
            }
        });
        /**
         * Crear nueva instancia de contenedor.
         * @param resourceGroup - Nombre del grupo de recursos.
         * @param containerName - Nombre para crear la instancia del contenedor.
         * @param containerImage - Nombre de la imagen a instancear, ejemplo: `macrtest.azurecr.io/maac-backend:v0.0.2`.
         * @param options
         */
        this.createCI = (resourceGroup, containerName, containerImage, options) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Creating container');
                const response = yield this._client.containerGroups.beginCreateOrUpdate(resourceGroup, containerName, {
                    name: containerName,
                    location: 'southcentralus',
                    containers: [{
                            name: containerName,
                            image: containerImage,
                            ports: (options === null || options === void 0 ? void 0 : options.ports) || [
                                {
                                    protocol: 'TCP',
                                    port: 80
                                }
                            ],
                            environmentVariables: (options === null || options === void 0 ? void 0 : options.environmentVariables) || [
                                {
                                    name: 'PORT',
                                    value: '80'
                                }
                            ],
                            resources: {
                                requests: (options === null || options === void 0 ? void 0 : options.requests) || {
                                    memoryInGB: 1,
                                    cpu: 1
                                }
                            }
                        }],
                    imageRegistryCredentials: [
                        {
                            server: index_1.env.CONTAINER_SERVER,
                            username: index_1.env.CONTAINER_USER,
                            password: index_1.env.CONTAINER_PASS,
                        }
                    ],
                    ipAddress: {
                        ports: (options === null || options === void 0 ? void 0 : options.ports) || [
                            {
                                protocol: 'TCP',
                                port: 80
                            }
                        ],
                        type: 'Public',
                        dnsNameLabel: containerName,
                        fqdn: `${containerName}.southcentralus.azurecontainer.io`,
                    },
                    osType: 'Linux',
                    sku: 'Standard',
                    initContainers: []
                });
                console.log('Container created');
                return response;
            }
            catch (error) {
                console.log(error);
            }
        });
        /**
         * Eliminar una instancia de contenedor.
         * @param resourceGroup - Nombre del grupo de recursos.
         * @param containerName - Nombre para crear la instancia del contenedor.
         */
        this.deleteCI = (resourceGroup, containerName) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._client.containerGroups.deleteMethod(resourceGroup, containerName);
                return response;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    ContainerInstance() {
    }
}
exports.ContainerInstance = ContainerInstance;
