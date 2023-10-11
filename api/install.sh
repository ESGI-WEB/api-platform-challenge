docker compose build --no-cache &&
docker compose run --rm --no-deps php composer install -o &&
docker compose run --rm --no-deps php bin/console lexik:jwt:generate-keypair --overwrite --no-interaction &&
docker compose up -d --remove-orphans &&
docker compose run --rm --no-deps php bin/console doctrine:database:create --if-not-exists --env=dev &&
docker compose run --rm --no-deps php bin/console doctrine:migrations:migrate -n --env=dev