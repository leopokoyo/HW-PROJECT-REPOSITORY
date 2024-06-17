# HW-PROJECT-REPOSITORY

# Database Schema
## Tables

### `countries`
| Column          | Type    | Description                                                 |
|-----------------|---------|-------------------------------------------------------------|
| `id`            | TEXT    | Primary key, unique identifier for the country              |
| `name`          | TEXT    | Name of the country                                         |
| `min_wage`      | NUMERIC | Minimum wage in the country                                 |
| `bm_price`      | NUMERIC | Price of a Big Mac in the country                           |
| `nr_monthly_bm` | NUMERIC | Number of Big Macs that can be bought with the minimum wage |

### `races`
| Column    | Type | Description                                 |
|-----------|------|---------------------------------------------|
| `race_id` | TEXT | Primary key, unique identifier for the race |
| `time`    | DATE | Date and time of the race                   |
| `type`    | TEXT | Type of race                                |

### `race_info`
| Column    | Type | Description                                                                   |
|-----------|------|-------------------------------------------------------------------------------|
| `race_id` | TEXT | Foreign key, references `races(race_id)`                                      |
| `winner`  | TEXT | Foreign key, references `countries(id)`, ID of the winning country            |
| `p_1`     | TEXT | Foreign key, references `countries(id)`, ID of the country that placed first  |
| `p_2`     | TEXT | Foreign key, references `countries(id)`, ID of the country that placed second |
| `p_3`     | TEXT | Foreign key, references `countries(id)`, ID of the country that placed third  |
| `p_4`     | TEXT | Foreign key, references `countries(id)`, ID of the country that placed fourth |
