declare module "swagger-jsdoc" {
    function swaggerJSDoc(options: swaggerJSDoc.Options): Record<string, unknown>;

    namespace swaggerJSDoc {
        interface Options {
            definition: Record<string, unknown>;
            apis: string[];
        }
    }

    export default swaggerJSDoc;
}
