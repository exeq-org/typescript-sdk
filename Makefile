# TypeScript SDK Codegen

# Generate SDK from swagger spec
codegen:
	@echo "🔧 Generating TypeScript SDK..."
	@rm -rf src dist
	@export JAVA_HOME=/opt/homebrew/opt/openjdk && \
	export PATH=$$JAVA_HOME/bin:$$PATH && \
	pnpx @openapitools/openapi-generator-cli generate \
		-i swagger.yaml \
		-g typescript-fetch \
		-o . \
		--additional-properties=typescriptThreePlus=true,supportsES6=true,npmName=@exeq/sdk,npmVersion=1.0.0
	@cd src/apis && echo "export * from './ApikeyApi';" > index.ts
	@pnpm install && pnpm run build
	@echo "✅ SDK generated and built successfully!"

.PHONY: codegen
