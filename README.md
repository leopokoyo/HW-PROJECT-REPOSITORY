# HW-PROJECT-REPOSITORY

## Database Schema

### Table: `countries`

The `countries` table stores information about different countries, including their minimum wage, Big Mac price, and other related data.

| Column          | Type    | Not Null | Description                                                              |
|-----------------|---------|----------|--------------------------------------------------------------------------|
| `id`            | text    | NOT NULL | A unique identifier for each country.                                    |
| `name`          | text    |          | The name of the country.                                                 |
| `min_wage`      | numeric |          | The minimum wage in the country.                                         |
| `bm_price`      | numeric |          | The price of a Big Mac in the country.                                   |
| `nr_monthly_bm` | numeric |          | The number of Big Macs that can be bought with the monthly minimum wage. |
| `emoticon_code` | text    |          | The emoticon code representing the country.                              |

### Example Data for `countries`

| id   | name            | min_wage | bm_price | nr_monthly_bm | emoticon_code  |
|------|-----------------|----------|----------|---------------|----------------|
| NZ   | New Zealand     | 2790.58  | 4.23     | 659.09        | :new_zealand:  |
| AR   | Argentina       | 1779.17  | 2.71     | 657.70        | :argentina:    |
| AU   | Australia       | 2876.25  | 4.52     | 636.98        | :australia:    |
| UK   | United Kingdom  | 2474.17  | 4.23     | 584.70        | :uk:           |
| LU   | Luxembourg      | 2675.25  | 4.74     | 564.98        | :luxembourg:   |

---

### Table: `races`

The `races` table stores information about different races, including the participants and the type of race.

| Column  | Type    | Not Null | Description                          |
|---------|---------|----------|--------------------------------------|
| `id`    | numeric | NOT NULL | A unique identifier for each race.   |
| `p1`    | text    |          | The first participant (country ID).  |
| `p2`    | text    |          | The second participant (country ID). |
| `p3`    | text    |          | The third participant (country ID).  |
| `p4`    | text    |          | The fourth participant (country ID). |
| `type`  | text    |          | The type of race.                    |

### Foreign Keys for `races`

- `p1` references `countries(id)`
- `p2` references `countries(id)`
- `p3` references `countries(id)`
- `p4` references `countries(id)`

---

### Table: `participates`

The `participates` table stores information about the participation of countries in races, including whether they won and their place.

| Column     | Type    | Not Null | Description                                 |
|------------|---------|----------|---------------------------------------------|
| `cid`      | text    |          | The country ID (participant).               |
| `rid`      | numeric |          | The race ID.                                |
| `isWinner` | boolean |          | Indicates if the country won the race.      |
| `Place`    | numeric |          | The place the country achieved in the race. |

### Foreign Keys for `participates`

- `cid` references `countries(id)`
- `rid` references `races(id)`

---

### SQL Code to Create Tables

```sql
CREATE TABLE countries (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT,
    min_wage NUMERIC,
    bm_price NUMERIC,
    nr_monthly_bm NUMERIC,
    emoticon_code TEXT
);

CREATE TABLE races (
    id NUMERIC PRIMARY KEY,
    p1 TEXT,
    p2 TEXT,
    p3 TEXT,
    p4 TEXT,
    type TEXT,
    FOREIGN KEY (p1) REFERENCES countries(id),
    FOREIGN KEY (p2) REFERENCES countries(id),
    FOREIGN KEY (p3) REFERENCES countries(id),
    FOREIGN KEY (p4) REFERENCES countries(id)
);

CREATE TABLE participates (
    cid TEXT,
    rid NUMERIC,
    isWinner BOOLEAN,
    Place NUMERIC,
    FOREIGN KEY (cid) REFERENCES countries(id),
    FOREIGN KEY (rid) REFERENCES races(id)
);