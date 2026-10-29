# GamePulse Live — Database (Planned)

> **Status: Not implemented yet.**
> This folder contains only **planning documents**. No real SQL schema, migrations, or seed
> scripts have been created. The current phase uses the frontend mock data + localStorage as
> a temporary database.

## Planned Database

| Item     | Detail                          |
| -------- | ------------------------------- |
| Engine   | MySQL                           |
| DB Name  | `gamepulse_live`                |
| Hosting  | Aiven MySQL / Railway MySQL     |
| Access   | Spring Data JPA (Hibernate ORM) |

## Files in this Folder

| File                                     | Purpose                                       |
| ---------------------------------------- | --------------------------------------------- |
| [`schema-plan.md`](schema-plan.md)       | Planned tables, fields, and relationships     |
| [`seed-data-plan.md`](seed-data-plan.md) | Planned initial/demo data for first match     |

## Planned Tables (Overview)

```text
users · teams · players · matches · streams ·
scoreboards · ball_events · highlights · polls · votes
```

See [`schema-plan.md`](schema-plan.md) for the full field-level plan.

## Next Step

The actual SQL DDL (`CREATE TABLE ...`) and seed scripts will be created only when backend
development begins and is explicitly requested. Until then, these documents act as the
single source of truth for the data model so the frontend mock data stays aligned with the
future schema.
