import {Injectable} from '@angular/core';
import 'localforage';
import {NgForageConfig} from '../config/ng-forage-config.service';
import {NgForageOptions} from '../config/ng-forage-options';
import {localForage as lf} from '../imports/localforage';
import {DriverType} from '../misc/driver-type.type';

/** @internal */
interface InstanceMap {
  [hash: string]: LocalForage;
}

/** @internal */
const stores: InstanceMap = {};

/** @internal */
function getDriverString(driver?: DriverType | DriverType[]): string {
  if (!driver) {
    return '';
  } else if (Array.isArray(driver)) {
    return driver.slice().sort().join(',');
  } else {
    return <string>driver;
  }
}

/** @internal */
function getHash(cfg: NgForageOptions): string {
  return [
    getDriverString(cfg.driver),
    cfg.name,
    cfg.size,
    cfg.storeName,
    cfg.version,
    cfg.description,
    cfg.cacheTime
  ].join('|');
}

/** @internal */
const conf$ = Symbol('Config');

/**
 * Creates localForage instances
 */
@Injectable({providedIn: 'root'})
export class InstanceFactory {

  /** @internal */
  public constructor(conf: NgForageConfig) {
    this[conf$] = conf;
  }

  public getInstance(cfg: NgForageOptions): LocalForage {
    cfg = Object.assign({}, this[conf$].config, cfg || {});
    const hash = getHash(cfg);

    if (!stores[hash]) {
      // @ts-ignore
      stores[hash] = lf.createInstance(cfg);
    }

    return stores[hash];
  }
}
