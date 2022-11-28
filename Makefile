RUST_DIR = functions
BUILD_ARTIFACT_DIR = target/lambda/functions

.PHONY: build
build:
	cd $(RUST_DIR) && \
	cargo lambda build --release --arm64 && \
	zip -j $(BUILD_ARTIFACT_DIR)/bootstrap.zip $(BUILD_ARTIFACT_DIR)/bootstrap && \
	cd ../ ;

.PHONY: run-dev
run-dev:
	cd $(RUST_DIR) && \
	cargo lambda watch

.PHONY: deploy
deploy:
	make build
	cdk deploy