# Multi database (adding delete using Hapi)
Run Postgres and MongoDB with Docker and start coding with multi database.

See containers running in PC
```bash
docker ps
```

Obs.: course module adding delete using Hapi.js

## POSTGRES
Install Postgres
```bash
docker run --name postgres -e POSTGRES_USER=bielmaia -e POSTGRES_PASSWORD=senhasecreta -e POSTGRES_DB=heroes -p 5432:5432 -d postgres
```

Run commands inside Postgres container
```bash
docker exec -it postgres /bin/bash
```

Install Postgres GUI
```bash
docker run --name adminer -p 8080:8080 --link postgres:postgres -d adminer
```

---
## MONGODB
Install MongoDB
```bash
docker run --name mongodb -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=senhaadmin -p 27017:27017 -d mongo:4
```

Install MongoDB GUI
```bash
docker run --name mongoclient -p 3000:3000 --link mongodb:mongodb -d mongoclient/mongoclient
```

Create readWrite user to access database
```bash
docker exec -it mongodb mongo --host localhost -u admin -p senhaadmin --authenticationDatabase admin --eval "db.getSiblingDB('herois').createUser({ user: 'bielmaia', pwd: 'senhasecreta', roles: [{role: 'readWrite', db: 'herois'}] })
```