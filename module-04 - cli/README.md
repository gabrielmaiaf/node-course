# CLI for Hero's database

To see all available commands for CLI, use ```node index.js -h```.

There's all available commands:
```shell
  -c, --create "Create a hero"
  -r, --read "Read heroes"
  -u, --update [value] "Update a hero by id"
  -d, --delete [value] "Delete a hero by id"
```

Use these flags to pass any info for the options above:
```shell
  -n, --name [value] 'Hero name'
  -p, --power [value] 'Hero power'
  -i, --id [value] 'Hero id'
```