# Basic commands to use with MongoDB

``` bash
docker exec -it 'containerID' mongo -u bielmaia -p senhasecreta --authenticationDatabase herois
```

See which database that I can use
``` bash
show dbs
```

Change context to a specific table
``` bash
use herois
```

Show collections in bash
``` bash
Show collections
```

## Create
Add hero
``` javascript
db.herois.insert({
  nome: 'Flash',
  poder: 'Speedforce',
  dataNascimento: '1998-01-01'
})
```

## Read
Find all items
``` javascript
db.herois.find()
```

Find all items and show formatted
``` javascript
db.herois.find().pretty()
```

Count how many entries in database
``` javascript
db.herois.count()
```

Get first item
``` javascript
db.herois.findOne()
```

Find items limited to 100 and organized in upward
``` javascript
db.herois.find().limit(100).sort({ nome: -1 })
```

## Update
Update heroes that have id (delete all info and add info that you have entered)
``` javascript
db.herois.update({ _id: ObjectId("5f037a2f0c66a8b2636cdbea"), }, { nome: 'Supergirl' })
```
Update heroes that have id and updates only what you entered
``` javascript
db.herois.update({ _id: ObjectId("5f037a2f0c66a8b2636cdbea"), }, {
  $set: { nome: 'Green Lantern'}
})
```

## Delete
Deletes everything that matches query
``` javascript
db.herois.remove({ nome: 'Green Lantern' })
```