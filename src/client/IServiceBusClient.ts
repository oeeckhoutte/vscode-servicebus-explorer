interface IServiceBusClient {
    getTopics(): Promise<[any]>;
    validateAndThrow():Promise<void>;
}