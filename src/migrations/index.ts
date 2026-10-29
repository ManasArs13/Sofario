import * as migration_20261028_164924_initial from './20261028_164924_initial';
import * as migration_20261029_053729_workshop_location from './20261029_053729_workshop_location';
import * as migration_20261029_053733_drop_map_embed_url from './20261029_053733_drop_map_embed_url';
import * as migration_20261029_064312_seo_city from './20261029_064312_seo_city';

export const migrations = [
  {
    up: migration_20261028_164924_initial.up,
    down: migration_20261028_164924_initial.down,
    name: '20261028_164924_initial',
  },
  {
    up: migration_20261029_053729_workshop_location.up,
    down: migration_20261029_053729_workshop_location.down,
    name: '20261029_053729_workshop_location',
  },
  {
    up: migration_20261029_053733_drop_map_embed_url.up,
    down: migration_20261029_053733_drop_map_embed_url.down,
    name: '20261029_053733_drop_map_embed_url',
  },
  {
    up: migration_20261029_064312_seo_city.up,
    down: migration_20261029_064312_seo_city.down,
    name: '20261029_064312_seo_city'
  },
];
