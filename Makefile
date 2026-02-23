up-docker:
	cp -R redis-config redis
	docker compose up -d

up-docker-lean:
	docker compose up -d

down-docker-lean:
	docker compose down

down-docker:
	docker compose down
	rm -rf ./redis

start:
	npm start
