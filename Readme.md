
# @mediaadmin/container-instances

It's a NodeJS library for create al delete instances of containers in Microsoft azure

## Installation

Use the package manager npm to install.

```bash
npm i --save @mediaadmin/container-instances
```

## Usage

Define the environment variables

  Variable  | Example Value
------------- | -------------
AZURE_SUBSCRIPTION_ID  | 00000000-0000-0000-0000-0000000
AZURE_CLIENT_ID  | 00000000-0000-0000-0000-0000000
AZURE_TENANT_ID  | 00000000-0000-0000-0000-0000000
CONTAINER_IMAGE  | admincr.azurecr.io/test-backend:v0.0.1
CONTAINER_USER  | admincr
CONTAINER_PASS  | ****************************

Get all instances of container

```typescript
const { ContainerInstance } = require('@mediaadmin/container-instances');
const cli = new ContainerInstance();

cli.getAllCI().then(res => {
    console.log(res);
});
```
### Create
To create an instance of container you can use the function "createCI"
```typescript
(property) ContainerInstance.createCI: (
   resourceGroup: string,
   containerName: string,
   containerImage: string,
   options?: Options
) => Promise<LROPoller>
```
Example:

```typescript
const { ContainerInstance } = require('@mediaadmin/container-instances');
const cli = new ContainerInstance();

cli.createCI(
    'ResourceGroup1',
    'Name of Container',
    'image.azurecr.com',
    {
        ports: [
            {
                port: 80,
                protocol: 'TCP'
            }
        ],
        environmentVariables: [
            {
                name: 'NODE_ENV',
                value: 'production'
            }
        ],
        requests: {
            memoryInGB: 1.5,
            cpu: 1
        }
    }
).then(res => {
    console.log(res);
});
```

### Delete
To delete an instance of container you can use the function "createCI"
```typescript
(property) ContainerInstance.createCI: (
   resourceGroup: string,
   containerName: string
) => Promise<LROPoller>
```
Example:

```typescript
const { ContainerInstance } = require('@mediaadmin/container-instances');
const cli = new ContainerInstance();

cli.deleteCI(
    'ResourceGroup1',
    'Name of Container',
).then(res => {
    console.log(res);
});
```